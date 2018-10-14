const router = require('koa-rest-router')({ prefix: process.env.REST_PREFIX })

const safeColumns = '*'

const generic = (ctx, next) => {
  ctx.restReturning = safeColumns

  return next()
}

const create = [
  (ctx, next) => {
    if (!ctx.request.body) {
      const err = new Error('No body given for creating of a event!')

      err.code = 403

      throw err
    }

    const { body } = ctx.request

    if (!body.user_id) {
      const err = new Error('You must give a user_id for the event!')

      err.code = 403

      throw err
    }

    if (!body.start_at) {
      const err = new Error('You must give a start at for the event!')

      err.code = 403

      throw err
    }

    return next()
  },
  generic
]

router.resource('events', {
  create,
  show: generic,
  index: generic,
  remove: generic,
  update: generic
})

module.exports = router
