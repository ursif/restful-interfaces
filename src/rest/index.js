/**
 * REST Interface for Postgres DB
 *
 * You can find the shape and types by looking at
 * the DB sql file
 *
 * You will need the following environment variables
 * to properly use this file:
 *
 * - REST_PREFIX
 *
 * You will need to have the following things attached
 * to the `ctx` of the requests:
 *
 * - db: { create, read, update, destrory, byId }
 *
 * You can have the following things attached to the
 * `ctx` of the requests:
 *
 * - restReturning: [array, of, columns, to, return]
 *                  || 'string, of, columns'
 *                  || '*'
 *
 * For the main GET /:type requests, you can also set
 * an SQL query to be ran instead of just reading the last
 * from the table:
 *
 * - `ctx.restQuery`: A SQL command to put between
 *                    `SELECT * FROM table`
 *                    and `ORDER BY LIMIT OFFSET`
 */

const router = require('koa-rest-router')({ prefix: process.env.REST_PREFIX })
const generic = require('./generic')

const handleResponse = async (ctx, prom, status = 200) => {
  ctx.status = status
  ctx.body = {
    data: await prom
  }
}

module.exports = ({ routes }) => {
  const withHandlers = routes.map(r => [r, generic])

  withHandlers.forEach(([resourceName, routeInfo]) => {
    router.resource(
      resourceName,
      routeInfo.handlers(resourceName, handleResponse),
      routeInfo.options
    )
  })

  return router
}
