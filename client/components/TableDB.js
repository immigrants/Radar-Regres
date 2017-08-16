import React, {Component} from 'react'
import {Table, thead, tr, th, tbody, td} from 'react-bootstrap'
import {connect} from 'react-redux'

class TableDB extends Component {

  componentDidMount () {
    this.props.fetchAllTables()
  }
  
  render() {
    return (
      <div>
        <div>
          <h4>Table</h4>
        </div>

        <div>
          <Table>
            <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr>
            </tbody>
          </Table>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    tables: state.tables
  })
}

export default connect(mapStateToProps) (TableDB)