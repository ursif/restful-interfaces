/**
 * This module is responsible for adding any global
 * middleware that needs to be ran _before_ any other
 * middleware is ran.
 *
 * This is a good place for error handling, authentication,
 * session management, etc.
 *
 * Note that all middleware are local even if they
 * are direct calls to underlying NPM modules.
 *
 * Global Middleware: (Config) => KoaMiddleware
 */

const errorCatching = require('./errorCatching')
const timing = require('./timing')
const helmet = require('./helmet')
const ratelimit = require('./ratelimit')
const bodyParser = require('./bodyParser')
const cors = require('./cors')

module.exports = [errorCatching, timing, helmet, bodyParser, cors]
