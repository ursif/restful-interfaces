if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Koa = require('koa')

const createLogger = require('./logger')
const globalMiddleware = require('./globalMiddleware')
const db = require('./db')
const rest = require('./rest')
const validations = require('./validations')

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
 * rest router. This is also where we can
 * inject values into the context of the
 * request such as `restReturning`
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
 * This needs to be the last middleware
 * that we add. This talks to the DB without
 * any checks. We need to catch and set things
 * above this
 */
app.use(
  rest({
    routes
  }).middleware()
)

app.listen(PORT, () =>
  logger.info(`REST Listening at http://localhost:${PORT}`)
)
