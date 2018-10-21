const router = require('../router.js')()

const create = (ctx, next) => {
  if (!ctx.request.body) {
    const err = new Error('No body given for creating of an ask')

    err.code = 403

    throw err
  }

  const { body } = ctx.request

  if (!body.title) {
    const err = new Error('No title given for the ask!')

    err.code = 400

    throw err
  }

  if (body.title.length > 240) {
    const err = new Error(
      'You cannot save a title greater than 240 characters. Please change your title and try again.'
    )

    err.code = 400

    throw err
  }

  return next()
}

router.resource('asks', {
  create
})

module.exports = router
