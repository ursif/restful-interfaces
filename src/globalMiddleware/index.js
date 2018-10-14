const errorCatching = require('./errorCatching')
const timing = require('./timing')
const helmet = require('./helmet')
const ratelimit = require('./ratelimit')
const bodyParser = require('koa-bodyparser')

module.exports = [errorCatching, timing, helmet, () => bodyParser()]
