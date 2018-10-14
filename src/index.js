/**
 * This module is responsible for hooking
 * all of the pipes together. It sets up
 * an instance of Koa, adds middleware, and
 * starts listening on a port.
 *
 * Most if not all of the actual logic should
 * be housed inside of its own top level directory
 * and this file should just point a specific app
 * instance at that logic and inject configuration
 * into that logic.
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Koa = require('koa')

const createLogger = require('./logger')
const globalMiddleware = require('./globalMiddleware')
const db = require('./db')
const rest = require('./rest')

/**
 * We have the ability to validate incoming requests
 * along with map URL query arguments into an SQL
 * statement. You can see each module's main export
 * file to see what each of these things do and where
 * to put what logic.
 */
const validations = require('./validations')
const queries = require('./queries')

const { PORT = 3210 } = process.env

const logger = createLogger({
  instance: console,
  level: 'debug'
})

const middlewareConfig = {
  logger
}

const app = globalMiddleware.reduce(
  (a, fn) => a.use(fn(middlewareConfig)),
  (() => {
    const a = new Koa()

    a.context.db = db

    return a
  })()
)

const routes = ['users', 'todos', 'lists', 'reminders', 'records']

/**
 * Here we add our validations per resource
 * that we have registered inside of our
 * rest router. This is also where we set
 * what each route returns, injecting a value
 * into `ctx.restReturning`
 */
routes.forEach(key => {
  if (!(key in validations)) {
    const err = new Error(
      'You did not create a validation for `' +
        key +
        '`. Please fix this and try again.'
    )

    throw err
  }

  app.use(validations[key].middleware())
})

/**
 * We can also attach a query to the REST
 * routes.
 */
Object.keys(queries).forEach(query => {
  app.use(queries[query].middleware())
})

/**
 * WARNING: THIS TALKS TO DB WITHOUT RULES!
 *
 * This needs to be the last middleware
 * that we add. This talks to the DB without
 * any checks. We need to catch and set things
 * above this.
 */
app.use(
  rest({
    routes
  }).middleware()
)

/**
 * Finally, once all of our world is set up,
 * we start listening at the specified port
 */
app.listen(PORT, () =>
  logger.info(`RESTful Interface Listening at http://localhost:${PORT}`)
)
