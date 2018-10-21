const throwError = (msg, code) => {
  const err = new Error(msg)

  err.code = code

  throw err
}

const create = (ctx, next) => {
  if (!ctx.request.body) {
    throwError('No body given for creating of an ask', 403)
  }

  const { body } = ctx.request

  if (!body.title) {
    throwError('No title given for the ask!', 400)
  }

  if (body.title.length > 240) {
    throwError(
      'You cannot save a title greater than 240 characters. Please change your title and try again.',
      400
    )
  }

  if (body.priority > 100) {
    throwError('Something cannot be more important than 100!', 400)
  }

  if (body.priority < 0) {
    throwError('Something cannot be less important than 0!', 400)
  }

  if (body.due_date && new Date(body.due_date).getMilliseconds() < Date.now()) {
    throwError('You cannot have something that was due before now!', 400)
  }

  return next()
}

module.exports = {
  create
}
