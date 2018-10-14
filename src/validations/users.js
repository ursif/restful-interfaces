const bcrypt = require('bcrypt')
const router = require('koa-rest-router')({ prefix: process.env.REST_PREFIX })

const safeColumns = ['id', 'username', 'created_at', 'last_updated']

const genericUser = (ctx, next) => {
  ctx.restReturning = safeColumns

  return next()
}

const createUser = [
  async (ctx, next) => {
    if (!ctx.request.body) {
      const err = new Error('No body given for creating a user!')

      err.code = 401

      throw err
    }

    const { body } = ctx.request

    if (!body.username || !body.password) {
      const err = new Error(
        'You must give createUser both a username and a password'
      )

      err.code = 401

      throw err
    }

    const hashed = await bcrypt.hash(body.password, 10)

    ctx.request.body.password = hashed

    return next()
  },
  genericUser
]

router.resource('users', {
  create: createUser,
  show: genericUser,
  index: genericUser,
  remove: genericUser,
  update: genericUser
})

module.exports = router
