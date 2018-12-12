import React from 'react'
import { connect } from 'react-redux'
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import { setToken } from '../actions'
import {postApi} from '../services/Api'

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setToken(token))
})

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      redirectToBooks: false
    }
  }

  handleChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  }

  handleChangePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  handleSubmit = () => {
    const params = {
      'username': this.state.username,
      'password': this.state.password
    }
    postApi('/login', params)
    .then(data => {
      this.props.setToken(data.token)
      this.setState({ redirectToBooks: true })
    })
  }

  render() {
    if (this.state.redirectToBooks) return <Redirect to='/books' />

    return (
      <Container className="login">
        <h2>Login</h2>
        <Form>
          <FormGroup>
            <Label>Username</Label>
            <Input type="text" name="username" value={this.state.username} onChange={this.handleChangeUsername} />
          </FormGroup>
          <FormGroup>
            <Label>password</Label>
            <Input type="password" name="password" value={this.state.password} onChange={this.handleChangePassword} />
          </FormGroup>
          <Button onClick={this.handleSubmit}>Login</Button>
        </Form>
      </Container>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Login)