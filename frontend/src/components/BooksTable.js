import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './BooksTable.css'

class BooksTable extends React.Component {
  getColumns() {
    const columns = [
      {
        Header: 'Id',
        accessor: 'id',
        className: 'text-center',
        Cell: props => <Link to={{ pathname: `/books/${props.value}` }}>{props.value}</Link>
      },
      {
        Header: 'ISBN',
        accessor: 'isbn',
        className: 'text-center'
      }, {
        Header: 'Title',
        accessor: 'title',
        className: 'text-center'
      }, {
        Header: 'Author',
        accessor: 'author',
        className: 'text-center'
      }, {
        Header: 'Year',
        accessor: 'year',
        className: 'text-center'
      }
    ]

    return columns
  }

  render() {
    return (
      <div className='books-table'>
        <ReactTable
          data={this.props.books}
          columns={this.getColumns()}
          defaultPageSize={10}
        />
      </div>
    )
  }
}

export default connect()(BooksTable)