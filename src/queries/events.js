const router = require('koa-rest-router')({ prefix: process.env.REST_PREFIX })

const index = (ctx, next) => {
  /**
   * Possible Query Args
   * owner = user_id of record to get
   */
  const { owner } = ctx.query

  const queries = [owner && ['user_id', '=', `'${owner}'`]].filter(Boolean)

  if (queries.length) {
    ctx.restQuery = queries.reduce(
      (a, [column, op, value]) =>
        a
          ? `${a} AND ${column} ${op} ${value}`
          : `WHERE ${column} ${op} ${value}`,
      ''
    )
  }

  return next()
}

router.resource('events', {
  index
})

module.exports = router
