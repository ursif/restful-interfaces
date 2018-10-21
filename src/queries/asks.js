const router = require('../router.js')()

const index = (ctx, next) => {
  return next()
}

router.resource('asks', {
  index
})

module.exports = router
