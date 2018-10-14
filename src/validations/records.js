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

const viewRecords = [genericRecord]

router.resource('records', {
  create: createRecord,
  show: genericRecord,
  index: viewRecords,
  remove: genericRecord,
  update: genericRecord
})

module.exports = router
