const router = require('koa-rest-router')({ prefix: process.env.REST_PREFIX })

const safeColumns = '*'

const generic = (ctx, next) => {
  ctx.restReturning = safeColumns

  return next()
}

const create = [
  (ctx, next) => {
    if (!ctx.request.body) {
      const err = new Error('No body given for creating of a reminder!')

      err.code = 403

      throw err
    }

    const { body } = ctx.request

    if (!body.title) {
      const err = new Error('You must give a title for the reminder!')

      err.code = 403

      throw err
    }

    if (!body.user_id) {
      const err = new Error('You must give a user_id for the reminder!')

      err.code = 403

      throw err
    }

    return next()
  },
  generic
]

router.resource('reminders', {
  create,
  show: generic,
  index: generic,
  remove: generic,
  update: generic
})

module.exports = router
