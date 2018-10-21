const router = require('../router.js')()

const defaultAsk = {}

const safeColumns = '*'

const generic = (ctx, next) => {
  ctx.restReturning = safeColumns

  return next()
}

const create = [
  (ctx, next) => {
    ctx.request.body = Object.assign({}, defaultAsk, ctx.request.body)
    // ALWAYS CALL next()!
    return next()
  },
  generic
]

router.resource('asks', {
  create,
  show: generic,
  index: generic,
  remove: generic,
  update: generic
})

module.exports = router
