import React from 'react'
import { Jumbotron } from 'reactstrap'

const Home = () => (
  <div>
    <Jumbotron>
      <h1>Books</h1>
      <p>
        This is an amazing place you can review thousands of books reading reviews.
      </p>
      <p>
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link active" href="/login">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/register">Register</a>
          </li>
        </ul>
      </p>
    </Jumbotron>
  </div>
)

export default Home