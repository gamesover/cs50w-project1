import React from 'react'
import { connect } from 'react-redux'
import { Container, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Label, Button, Form, FormGroup, Input, FormText } from 'reactstrap'
import Rating from 'react-rating'
import { getApi, postApi } from '../services/Api'

import './Book.css'

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goodreads_rating_stat: {},
      book: {},
      rating: 0,
      comment: '',
      is_commented: true,
      reviews: []
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id
    getApi(`/books/${id}`)
      .then(data => {
        this.setState({ book: data.book, 
          reviews: data.reviews, 
          goodreads_rating_stat: data.goodreads_rating_stat,
          is_commented: data.is_commented
         })
      })
  }

  onClickRating = (value) => {
    this.setState({ rating: value })
  }

  handleChangeComment = (event) => {
    this.setState({ comment: event.target.value });
  }

  handleSubmit = () => {
    const params = {
      'rating': this.state.rating,
      'comment': this.state.comment
    }

    if (this.state.rating === 0 || this.state.comment.length === 0) {
      alert('Ary you input valid rating and comment?')
      return
    }

    const id = this.props.match.params.id
    const url = `/books/${id}/reviews`
    postApi(url, params)
      .then(data => {
        this.setState({ reviews: data.reviews, is_commented: true })
      })
  }

  render() {
    return (
      <Container>
        <h2 className="text-center">Book</h2>

        <div>
          <div className='row'>
            <div className='col-3'>Title</div><div className='col-9'>{this.state.book.title}</div>
          </div>
          <div className='row'>
            <div className='col-3'>Author</div><div className='col-9'>{this.state.book.author}</div>
          </div>
          <div className='row'>
            <div className='col-3'>Year</div><div className='col-9'>{this.state.book.year}</div>
          </div>
          <div className='row'>
            <div className='col-3'>ISBN</div><div className='col-9'>{this.state.book.isbn}</div>
          </div>
        </div>

        <div className='goodreads-ratings-summary'>
          Goodreads Ratings Summary
          <div className='row'>
            <div className='col-3'>Average Rating</div><div className='col-9'>{this.state.goodreads_rating_stat.average_rating}</div>
          </div>
          <div className='row'>
            <div className='col-3'>Ratings Count</div><div className='col-9'>{this.state.goodreads_rating_stat.ratings_count}</div>
          </div>
        </div>

        <ListGroup flush>
          {
            this.state.reviews.map(function (review, index) {
              return (
                <ListGroupItem key={index}>
                  <ListGroupItemHeading>
                    <Rating initialRating={review.rating} readonly={true} emptySymbol="fa fa-lg fa-star-o" fullSymbol="fa fa-lg fa-star" />
                  </ListGroupItemHeading>
                  <ListGroupItemText>
                    {review.comment}
                  </ListGroupItemText>
                </ListGroupItem>
              )
            }
            )
          }
        </ListGroup>

        {
          !this.state.is_commented &&
          <Form className='review-form'>
            <FormGroup>
              <Rating initialRating={this.state.rating} onClick={this.onClickRating} emptySymbol="fa fa-lg fa-star-o" fullSymbol="fa fa-lg fa-star" />
            </FormGroup>
            <FormGroup>
              <Label>Comment</Label>
              <Input type="textarea" name="comment" value={this.state.comment} onChange={this.handleChangeComment} />
            </FormGroup>
            <Button onClick={this.handleSubmit}>Submit</Button>
          </Form>
        }
      </Container>
    )
  }
}

export default connect()(Book)