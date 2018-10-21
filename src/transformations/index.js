/**
 * This module holds all of the request
 * transformations that need to happen for
 * any given request. This is not the same as
 * transforming the _queries_ or as _validating_
 * the input is correct.
 *
 * This is for doing things such as plain text
 * to hashed passwords, setting defaults for requests,
 * or any other request _transformation_.
 */
const fs = require('fs')
const router = require('../router.js')()
const paths = fs.readdirSync(__dirname).filter(path => path !== 'index.js')

module.exports = paths.reduce((a, path) => {
  const name = path.slice(0, -3)
  const route = router.resource(name, require(`${__dirname}/${path}`))

  return { ...a, [name]: route }
}, {})
