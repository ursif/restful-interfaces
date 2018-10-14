/**
 * This module holds all of the validations
 * for the routes exposed via the server.
 *
 * You should have all routes that are exposed
 * covered by this file.
 *
 * A validation is a koa-rest-router middleware that ensures
 * that the needed arguments are set and the query will
 * only return the appropriate columns
 *
 * Every validation _must_ call `next()`. This way, we can
 * go all the way down to the DB layer.
 */
const users = require('./users')
const records = require('./records')
const todos = require('./todos')
const lists = require('./lists')
const reminders = require('./reminders')
const events = require('./events')

module.exports = {
  users,
  records,
  todos,
  lists,
  reminders,
  events
}
