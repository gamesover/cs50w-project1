import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from '../containers/App'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={AngryDude} />
        <Route path="/quiet" component={KeepQuiet} />
        <Route path="/smile" component={SmileLady} />
        <Route path="/think" component={ThinkHard} />
        <Route path="/thumbs" component={ThumbsUp} />
        <Route path="/excited" component={BeExcited} />
      </Switch>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root