const db = require('./db')

const addContext = app => {
  /**
   * Add the db instance to all requests
   */
  app.context.db = db
  /**
   * Add the current version to all requests
   */
  app.context.version = process.env.REST_VERSION || 0

  return app
}

module.exports = addContext
