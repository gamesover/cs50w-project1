import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Books from './Books'
import Book from './Book'

const App = () => (
    <Router>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/books/:id" component={Book} />
        <PrivateRoute path="/books" component={Books} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
)

export default App
