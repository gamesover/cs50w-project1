import React from 'react'
import { connect } from 'react-redux'
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap'

import {postApi} from '../services/Api'

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    }
  }

  handleChangeSearch = (event) => {
    this.setState({ search: event.target.value });
  }

  handleSearch = () => {
    const params = {
      'search': this.state.search,
    }
    postApi('/books', params)
    .then(data => {
      this.props.setToken(data.token)
    })
  }

  render() {
    return (
      <Container>
        <h2 className="text-center">Books</h2>
   
        <Form>
          <FormGroup>
            <Input type="search" name="search" value={this.state.search} onChange={this.handleChangeSearch} placeholder="search ISBN, title, author or publication year"/>
          </FormGroup>
          <div className="text-center">
          <Button color="primary" onClick={this.handleSearch} >Search</Button>
          </div>
        </Form>
      </Container>
    )
  }
}

export default connect()(Books)