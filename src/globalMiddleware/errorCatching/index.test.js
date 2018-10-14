const errorCatching = require('./')

describe('Error Catching', () => {
  it('calls the logger if an error is thrown', () => {
    const logger = {
      error: jest.fn()
    }

    const middleware = errorCatching({ logger })

    const next = () => {
      throw new Error('Sup?')
    }

    return middleware({}, next).then(() =>
      expect(logger.error).toHaveBeenCalled()
    )
  })

  it('does not call the logger if no error is thrown', () => {
    const logger = {
      error: jest.fn()
    }

    const middleware = errorCatching({ logger })

    const next = () => {}

    return middleware({}, next).then(() =>
      expect(logger.error).not.toHaveBeenCalled()
    )
  })

  it('passes the error to the logger if thrown', () => {
    const logger = {
      error: jest.fn()
    }

    const middleware = errorCatching({ logger })
    const err = new Error('Sup?')

    const next = () => {
      throw err
    }

    return middleware({}, next).then(() =>
      expect(logger.error).toHaveBeenCalledWith(err)
    )
  })
})
