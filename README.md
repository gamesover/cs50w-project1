# Project 1

Web Programming with Python and JavaScript
https://github.com/gamesover/cs50w-project1

## Backend
* use FLASK as api server
* use flask_sqlalchemy as ORM (sorry, I know it is forbidden. But I think ORM is the right way for production.)
* use flask-migrate for migration control
* use elastic search for search book

## Frontend
* use react SPA as frontend
* use redux to store token

## Major Files
1. app.py: contains all controllers actions
2. models.py: contains Book, User, Review models
3. frontend/src/compoents: contains major components
4. frontend/src/reducers: contains redux reducers
5. frontend/src/actions: contains redux actions

## Cons
* redux stored values will gone if hard input a url, it is better to work with `redux-persist` lib
* css is largely ignored
* unit test is ignored
