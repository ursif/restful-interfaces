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
 *
 * All files inside of this folder are exported as their
 * name without the extension
 */
const fs = require('fs')

const paths = fs.readdirSync(__dirname).filter(path => path !== 'index.js')

module.exports = paths.reduce((a, path) => {
  const name = path.slice(0, -3)
  return {
    ...a,
    [name]: require(`${__dirname}/${path}`)
  }
}, {})
