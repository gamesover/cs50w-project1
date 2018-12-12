import csv
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    isbn = db.Column(db.String(10), unique=True, nullable=False)
    title = db.Column(db.String(128), nullable=False)
    author = db.Column(db.String(128), nullable=False)
    year = db.Column(db.Integer, nullable=False)

def main():
    with open('books.csv') as csvfile:
      reader = csv.reader(csvfile)
      next(reader, None)
      for isbn, title, author, year in reader:
          book = Book(isbn=isbn, title=title, author=author, year=year)
          db.session.add(book)
      db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        main()