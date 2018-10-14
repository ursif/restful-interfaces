const { STATUS_CODES } = require('http')

const errorCatching = ({ logger }) => async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    logger.error(e)

    ctx.status = e.code && (e.code > 99 && e.code < 600) ? e.code : 500

    ctx.body = {
      error: {
        message: e.message || 'Internal Server Error',
        overlord: STATUS_CODES[ctx.status],
        trace: process.env.NODE_ENV !== 'production' ? e.stack : undefined
      }
    }
  }
}

module.exports = errorCatching
