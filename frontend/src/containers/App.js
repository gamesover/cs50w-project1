import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

const App = () => (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/book" component={Book} />
      </Switch>
    </Router>
)

App.propTypes = {
  store: PropTypes.object.isRequired
}

export default App
