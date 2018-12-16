import React from 'react'
import { connect } from 'react-redux'
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import BooksTable from './BooksTable'
import {getApi} from '../services/Api'

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      books: [],
      displayTable: false
    }
  }

  handleChangeSearch = (event) => {
    this.setState({ search: event.target.value })
  }

  handleSearch = () => {
    const params = {
      'search': this.state.search,
    }
    getApi('/books', params)
    .then(data => {
      this.setState({ books: data.books, displayTable: true });
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

      {
        this.state.displayTable && <BooksTable books={this.state.books} />
      }
      </Container>
    )
  }
}

export default connect()(Books)