const timing = ({ logger }) => async (ctx, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()

  logger.timing({
    title: `${ctx.request.method} ${ctx.request.path}`,
    time: end - start,
    status: ctx.status
  })
}

module.exports = timing
