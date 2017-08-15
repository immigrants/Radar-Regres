import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import user from './user'
import users from './users'
import database from './database'
import fields from './fields'

const reducer = combineReducers({
	user,
	users,
	database,
	fields
})

const middleware = applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './users'
export * from './database'
export * from './fields'
