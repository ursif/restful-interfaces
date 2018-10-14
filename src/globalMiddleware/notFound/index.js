module.exports = () => async (ctx, next) => {
  await next()

  if (ctx.status !== 204) {
    if (!ctx.body || (!ctx.body.data && !ctx.body.error)) {
      const err = new Error('Resource Not found at ' + ctx.request.path)

      err.code = 404

      throw err
    }
  }
}
