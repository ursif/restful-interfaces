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
 * that gets passed to any requested routes
 */
const records = require('./records')

module.exports = {
  records
}
