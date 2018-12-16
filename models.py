from flask_httpauth import HTTPBasicAuth
from datetime import datetime
from app import db, app
from passlib.apps import custom_app_context as pwd_context
from sqlalchemy import exists, and_
import requests
import json
import xml.etree.ElementTree as ET
from itsdangerous import (
    TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

from search import add_to_index, remove_from_index, query_index


class SearchableMixin(object):
    @classmethod
    def search(cls, expression, page=None, per_page=None):
        ids, total = query_index(cls.__tablename__, expression, page, per_page)
        if total == 0:
            return cls.query.filter_by(id=0), 0
        when = []
        for i in range(len(ids)):
            when.append((ids[i], i))
        return cls.query.filter(cls.id.in_(ids)).order_by(
            db.case(when, value=cls.id)), total

    @classmethod
    def before_commit(cls, session):
        session._changes = {
            'add': list(session.new),
            'update': list(session.dirty),
            'delete': list(session.deleted)
        }

    @classmethod
    def after_commit(cls, session):
        for obj in session._changes['add']:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        for obj in session._changes['update']:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        for obj in session._changes['delete']:
            if isinstance(obj, SearchableMixin):
                remove_from_index(obj.__tablename__, obj)
        session._changes = None

    @classmethod
    def reindex(cls):
        for obj in cls.query:
            add_to_index(cls.__tablename__, obj)


db.event.listen(db.session, 'before_commit', SearchableMixin.before_commit)
db.event.listen(db.session, 'after_commit', SearchableMixin.after_commit)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), index=True,
                         unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user


class Book(SearchableMixin, db.Model):
    __searchable__ = ['isbn', 'title', 'author', 'year']

    id = db.Column(db.Integer, primary_key=True)
    isbn = db.Column(db.String(10), unique=True, nullable=False)
    title = db.Column(db.String(128), nullable=False)
    author = db.Column(db.String(128), nullable=False)
    year = db.Column(db.Integer, nullable=False)

    @property
    def serialize(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def goodreads_rating_stat(self):
        url = f"https://www.goodreads.com/book/isbn/{self.isbn}?key=S7ZiF0QFGMnSHgHpEZ3v2w"
        response = requests.get(url)

        root = ET.fromstring(response.content)
        ratings_sum = float(root.find("book/work/ratings_sum").text)
        ratings_count = int(root.find("book/work/ratings_count").text)
        average_rating = round(ratings_sum / ratings_count, 2)
        return {'average_rating': average_rating, 'ratings_count': ratings_count}

    def is_commented(self, user):
        (commented, ), = db.session.query(exists().where(and_(Review.user==user, Review.book==self)))
        return commented

    def average_rating(self):
        (result, ), = Review.query.with_entities(db.func.avg(Review.rating).label('average')).filter(Review.book == self).all()
        return round(float(result), 2)


class Review(db.Model):
    __table_args__ = (
        db.UniqueConstraint('user_id', 'book_id',
                            name='unique_user_book_review'),
    )

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False,
                           default=db.func.now(), onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    book = db.relationship('Book', backref=db.backref('reviews', lazy=True))

    @property
    def serialize(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
