const bcrypt = require('bcrypt')
const router = require('koa-rest-router')({ prefix: process.env.REST_PREFIX })

const safeColumns = '*'

const genericRecord = (ctx, next) => {
  ctx.restReturning = safeColumns

  return next()
}

const createRecord = [
  (ctx, next) => {
    if (!ctx.request.body) {
      const err = new Error('No body given for creating of a record')

      err.code = 403

      throw err
    }

    const { body } = ctx.request

    if (!body.title) {
      const err = new Error('You must give a title for the record')

      err.code = 403

      throw err
    }

    if (!body.user_id) {
      const err = new Error('You must give a user for the record')

      erro.code = 403

      throw err
    }

    return next()
  },
  genericRecord
]

const viewRecords = [
  (ctx, next) => {
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
      before && ['created_at', '<', new Date(before).toISOString()],
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

    ctx.restQuery = queries.reduce(
      (a, [column, op, value]) =>
        a
          ? `${a} AND ${column} ${op} ${value}`
          : `WHERE ${column} ${op} ${value}`,
      ''
    )

    return next()
  },
  genericRecord
]

router.resource('records', {
  create: createRecord,
  show: genericRecord,
  index: viewRecords,
  remove: genericRecord,
  update: genericRecord
})

module.exports = router
