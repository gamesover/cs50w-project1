import os

from flask import Flask, abort, request, jsonify, g, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_httpauth import HTTPTokenAuth
from elasticsearch import Elasticsearch

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Set up database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['ELASTICSEARCH_URL'] = os.getenv("ELASTICSEARCH_URL")
db = SQLAlchemy(app)

from models import User, Book, Review

migrate = Migrate(app, db)

auth = HTTPTokenAuth()
es = Elasticsearch()
app.elasticsearch = Elasticsearch([app.config['ELASTICSEARCH_URL']]) if app.config['ELASTICSEARCH_URL'] else None

@auth.verify_token
def verify_token(token):
    user = User.verify_auth_token(token)
    if not user:
        return False
    g.user = user
    return True


@app.route('/users', methods=['POST'])
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400)    # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400)    # existing user
    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    g.user = user
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()

    if user and user.verify_password(password):
        g.user = user
        token = g.user.generate_auth_token(600)
        return jsonify({'token': token.decode('ascii'), 'duration': 600})
    else:
        abort(401)


@app.route('/api/resource')
@auth.login_required
def get_resource():
    return jsonify({'data': 'Hello, %s!' % g.user.username})

@app.route('/books')
def books():
    search = request.args.get('search') 
    query, _total = Book.search(search)
 
    return jsonify(books=[book.serialize for book in query.all()])

@app.route('/books/<int:id>')
@auth.login_required
def book(id):
    book = Book.query.filter_by(id=id).first()
    if not book:
        abort(404)
    goodreads_rating_stat = book.goodreads_rating_stat()
    return jsonify(
        book=book.serialize, 
        reviews=[review.serialize for review in book.reviews],
        goodreads_rating_stat=goodreads_rating_stat,
        is_commented=book.is_commented(user=g.user)
        )

@app.route('/books/<int:id>/reviews', methods=['POST'])
@auth.login_required
def reviews(id):
    book = Book.query.filter_by(id=id).first()
    comment = request.json.get('comment')
    rating = request.json.get('rating')
    Review(comment=comment, rating=rating, user=g.user, book=book)
    db.session.commit()

    return jsonify(reviews=[review.serialize for review in book.reviews])


@app.route('/api/<string:isbn>')
def api_book(isbn):
    book = Book.query.filter_by(isbn=isbn).first()
    if not book:
        abort(404)

    review_count = db.session.query(Review).filter(Review.book==book).count()
    average_score = book.average_rating()

    book_json = book.serialize
    book_json['review_count'] = review_count
    book_json['average_score'] = average_score

    return jsonify(book_json)