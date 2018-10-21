const router = require('koa-rest-router')

module.exports = () =>
  router({
    prefix: process.env.REST_PREFIX || ''
  })
