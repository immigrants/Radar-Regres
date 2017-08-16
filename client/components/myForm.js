import React from 'react'
import { connect } from 'react-redux'
import { fetchUsers,fetchDatabase, searchDatabase, fetchFields, fetchDatabases,fetchTables } from '../store'
import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import {FormControl, ControlLabel, FormGroup} from 'react-bootstrap'

//this form is assuming that the table we're currently rendering is the Users table

class myForm extends React.Component {

  constructor() {
    super()
    this.state = {
      selectThese: [],
      whereThese: [],
      orderedBy: [],
      conditionals : ['greater than', 'greater than or equal to', 'less than', 'less than or equal to','equal to', 'not', 'between', 'not between'],
      conditionalOperator: ['>', '> =', '<', '<=', '===', '!==', '[]', '![]'],
      orderType : ['None','Ascending', 'Descending'],
      chartTypes: ['Pie', 'Scatter', 'Donut', 'Bar', 'Line'],
      choosenChart: '',
      Title: '',
      xLabel: '',
      yLabel: '',
      height: '',
      width: '',
      myGraphs: []
    }

  }

  componentDidMount() {
    let db = { database: this.props.match.params.dbName}
    this.props.fetchAllUsers()
    this.props.fetchDat(db)

  }

  handleSelectChange = (evt) => {
    const {name, value} = evt.target
    this.setState( (prevState) => ({ selectThese: prevState.selectThese.map( (val, index) => {
      return (index == name) ? { col: value } : val
    })}))
  }

  addSelect = (evt) => {
    this.setState( (prevState) => ({ selectThese: [...prevState.selectThese, {col:'All'}] }))
  }

  handleWhereChange = (evt) => {
    const [type, i] = evt.target.name.split(' ')
    let newVal = {}
    newVal[type] = (type === 'is') ? this.state.conditionalOperator[evt.target.value] : evt.target.value
    this.setState( (prevState) => ({ whereThese: prevState.whereThese.map( (val, index) => {
      return (index == i) ? {...val, ...newVal} : val
    })}))
  }

  addWhere = (evt) => {
    this.setState( (prevState) => ({ whereThese: [...prevState.whereThese, {col:'none', is: 'equal to', spec: '' }] }))
  }

  handleOrderChange = (index, evt) => {
    this.setState( (prevState) => ( { orderedBy: prevState.orderedBy.map( (val, i) => {
      return (index === i) ? event.target.value : val
    })}))
  }
  handleRemove = (index, fromWhere, evt) => {
    this.setState( (prevState) => ({
      [fromWhere]: [...prevState[fromWhere].slice(0, index), ...prevState[fromWhere].slice(index + 1)]
    }))
  }

  handleChange = (fromWhere, evt) => {
    this.setState({
      [fromWhere]: evt.target.value
    })
  }

  makeGraph = (evt) => {
    evt.preventDefault()
    const newGraph = null;
    this.setState((prevState) =>  ({
      myGraphs: [...prevState.myGraphs, newGraph]
    }))
  }

  tableChange = (evt) => {
    this.props.grabTableData(this.props.match.params.dbName, evt.target.value)
  }

  renderTables = () => {
      return <div>
                <label>From</label>
                  <select name="From" onChange={this.tableChange}>
                    {this.props.tables && this.props.tables.map((table,i) => <option value={table} key={i}>{table}</option>)}
                  </select>
                  <button type="button" className="btn btn-danger" onClick={this.tableChange}> Grab Table </button>
              </div>
  }

  renderSelects = () => {
      return <div>
                <label>Select</label>
                { this.state.selectThese.map((sel, index) => {
                    return  <div>
                                <select name={index} key={index} onChange={this.handleSelectChange}>
                                    {this.props.columns && this.props.columns.map((val,i) => <option value={val} key={i}>{val}</option>)}
                                </select>
                                <button type="button" className="btn btn-danger" onClick={this.handleRemove.bind(this, index, 'selectThese')}> - </button>
                            </div>
                    })
                }
                <button type="button" className="btn btn-primary" onClick={this.addSelect}>+</button>
            </div>
  }

  renderWheres = () => {
    return  <div>
              <label>Where</label>
              {
                this.state.whereThese.map((sel, index) => {
                  return  <div>
                            <select name={`col ${index}`} onChange={this.handleWhereChange}>
                              {this.props.columns && this.props.columns.map(v => <option value={v}>{v}</option>)}
                            </select>
                            <h4>is</h4>
                              <select name={`is ${index}`} onChange={this.handleWhereChange}>
                              {this.state.conditionals && this.state.conditionals.map((val, ind) => <option value={ind}>{val}</option>)}
                              </select>
                              <input className="form-control" name={`spec ${index}`} onChange={this.handleWhereChange}/>
                              <button type="button" className="btn btn-danger" onClick={this.handleRemove.bind(this, index, 'whereThese')}> - </button>
                          </div>
                })
              }
                <button type="button" className="btn btn-primary" onClick={this.addWhere}>+</button>
            </div>
  }

  renderOrderBy = () =>  {
    return <div className="form-group">
            <label>Order by</label>
            {
              <select onChange={this.handleOrderChange.bind(this,0)}>
               { this.state.orderType.map(v => <option value={v}>{v}</option>) }
              </select>
            }
            {
              <select onChange={this.handleOrderChange.bind(this, 1)}>
               { this.state.selectThese.length && this.state.selectThese.map( val => <option value={val.col}>{val.col}</option>) }
               { !(this.state.selectThese.length) && this.props.columns && this.props.columns.map(v => <option value={v}>{v}</option>) }
              </select>
            }
          </div>
  }


  render () {
    const DBName = this.props.match.params.dbName
    return (
      <div>
        <h2>User {DBName} Query Selection Form</h2>
        <form>
            { this.renderTables() }
            { this.renderSelects() }
            { this.renderWheres() }
            { this.renderOrderBy() }
          <button type="submit" className="btn btn-success">Submit</button>
        </form>
        <h2>Chart choice</h2>
        <form>
            <label>Chart Type</label>
              <select name='choosenChart' onChange={this.handleChange.bind(this, 'choosenChart')} >
               {this.state.chartTypes.map((val,i) => <option value={val} key={i}>{val}</option>)}
              </select>
            <label>Chart Title</label>
            <input className="form-control" onChange={this.handleChange.bind(this, 'Title')}/>
         
            <label>Height</label>
            <input className="form-control" onChange={this.handleChange.bind(this, 'height')}/>
       
            <label>Width</label>
            <input className="form-control" onChange={this.handleChange.bind(this, 'width')}/>
   
            <label>X axis</label>
            {
              <select onChange={this.handleChange.bind(this, 'xLabel')}>
               { this.state.selectThese.length && this.state.selectThese.map( val => <option value={val.col}>{val.col}</option>) }
               { !(this.state.selectThese.length) && this.props.columns && this.props.columns.map(val => <option value={val}>{val}</option>) }
              </select>
            }
            <input className="form-control"/>
            <label>Y axis</label>
            {
              <select onChange={this.handleChange.bind(this, 'yLabel')}>
               { this.state.selectThese.length && this.state.selectThese.map( val => <option value={val.col}>{val.col}</option>) }
               { !(this.state.selectThese.length) && this.props.columns && this.props.columns.map( val => <option value={val}>{val}</option>) }
              </select>
            }
            <input className="form-control"/>
          <button type="submit" className="btn btn-success" onClick={this.makeGraph}>Make my graph</button>
        </form>
        {
          this.state.myGraphs.map(val => val)
        }
      </div>
    )
  }
}

const mapState = state => {
  console.log(state)
  return ({
    tables: state.tables,
    table: state.database,
    columns: state.fields || ((state.users[0] ? Object.keys(state.users[0]) : undefined))
  })
}

const mapDispatch = dispatch => {
  return ({
    fetchAllUsers () {
      dispatch(fetchUsers())
    },
    fetchDat (DBname) {
      dispatch( fetchTables(DBname) )
    },
    grabTableData(database, table) {
      dispatch( fetchFields({ database, table}))
    }
  })
}

export default connect(mapState, mapDispatch)(myForm)