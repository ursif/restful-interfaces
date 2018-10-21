const defaultAsk = {
  /**
   * The priority of the task being asked
   *
   * 0 = not at all important
   * 100 = the most important thing I could do ever
   */
  priority: 0,
  /**
   * What keywords do we want to associate
   * to this task?
   */
  keywords: [],
  /**
   * Is there any meta information we want to
   * save with this ask?
   */
  meta: {}
}

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

module.exports = {
  create,
  show: generic,
  index: generic,
  remove: generic,
  update: generic
}
