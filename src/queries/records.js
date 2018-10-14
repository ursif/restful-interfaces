const router = require('koa-rest-router')({ prefix: process.env.REST_PREFIX })

const index = (ctx, next) => {
  /**
   * Possible Query Args
   * owner = user_id of record to get
   * after = created_at date to get after
   * before = created_at date to get before
   * modified_after = last_updated date to get after
   * modified_before = last_updated date to get before
   */
  const { owner, after, before, modified_after, modified_before } = ctx.query

  const queries = [
    owner && ['user_id', '=', `'${owner}'`],
    after && ['created_at', '>', `'${new Date(after).toISOString()}'`],
    before && ['created_at', '<', `'${new Date(before).toISOString()}'`],
    modified_after && [
      'last_updated',
      '>',
      `'${new Date(modified_after).toISOString()}'`
    ],
    modified_before && [
      'last_updated',
      '<',
      `'${new Date(modified_before).toISOString()}'`
    ]
  ].filter(Boolean)

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

router.resource('records', {
  index
})

module.exports = router
