/**
 * This module holds all of the query mapping
 * that will need to happen between the REST
 * request and the DB call.
 *
 * You should have any non key/value requests
 * mapped here, such as adding any query args
 * that are not limit, offset, order_by, or sort
 *
 * A query mapping is a koa-rest-router middleware that
 * maps the `ctx.query` into `ctx.restQuery`, a SQL string
 * that gets passed to any requested routes.
 *
 * Every query mapping _must_ call `next()` in order to
 * get the request all the way down to the DB layer.
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
