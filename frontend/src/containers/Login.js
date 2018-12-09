import React from 'react'
import { connect } from 'react-redux'
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { setToken } from '../actions'

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setToken(token))
})

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  }

  handleChangePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  handleSubmit = () => {
    fetch('/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then(response => response.json())
    .then(data => {
      this.props.setToken(data.token)
    })
  }

  render() {
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