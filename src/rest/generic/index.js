/**
 * This is a Generic wrapper around a DB connection.
 * That DB connection must expose the following API
 *
 * - db(table).create: Create a row in a table
 * - db(table).read: Read a list of columns from a table
 * - db(table).update: Update a row in a table
 * - db(table).destroy: Remove a row from a table
 * - db(table).byId: Get a row in a table by ID
 *
 * You can also give the `ctx` a `restReturning` before
 * it gets to here in order to return specific columns
 * from the query. Else, it will return _all_ columns
 *
 * The index route has the ability to have a SQL command
 * be read from `ctx.restQuery`.
 */

const options = {
  methods: {
    // I think PATCH is the correct way to update
    // a resource because PUT means we are overriding
    // But that's just like, my opinion man
    put: 'PATCH'
  }
}

const handlers = (type, handleResponse) => ({
  /* GET /:type */
  index: async ctx => {
    const {
      limit = 10,
      offset = 0,
      order_by = 'last_updated',
      sort = 'DESC'
    } = ctx.query

    return handleResponse(
      ctx,
      ctx.db(type).read(
        {
          limit,
          offset,
          order_by,
          sort
        },
        ctx.restReturning,
        ctx.restQuery
      )
    )
  },
  /* POST /:type */
  create: ctx =>
    handleResponse(
      ctx,
      ctx.db(type).create(ctx.request.body, ctx.restReturning)
    ),
  /* PATCH /:type/:id */
  update: ctx =>
    handleResponse(
      ctx,
      ctx.db(type).update(
        {
          id: ctx.params[type.slice(0, -1)],
          ...ctx.request.body
        },
        ctx.restReturning
      )
    ),
  /* DELETE /:type/:id */
  remove: ctx =>
    handleResponse(
      ctx,
      ctx.db(type).destroy(ctx.params[type.slice(0, -1)], ctx.restReturning)
    ),
  /* GET /:type/:id */
  show: ctx =>
    handleResponse(
      ctx,
      ctx.db(type).byId(ctx.params[type.slice(0, -1)], ctx.restReturning)
    )
})

module.exports = {
  options,
  handlers
}
