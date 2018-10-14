const ratelimit = require('koa-ratelimit')

module.exports = () =>
  ratelimit({
    duration: 60000,
    max: 100
  })
