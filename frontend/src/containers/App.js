import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Home from '../components/Home'
import Login from './Login'
import Register from './Register'

const App = () => (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        {/* <PrivateRoute path="/book" component={Book} /> */}
      </Switch>
    </Router>
)

export default App
