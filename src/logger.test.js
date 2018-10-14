const createLogger = require('./logger')

describe('Logger', () => {
  it('returns the correct methods', () => {
    const { timing, info, error, warn } = createLogger()

    expect(timing).toBeDefined()
  })

  it('does not call a level below the set level', () => {
    const config = {
      instance: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
      },
      level: 'warn'
    }

    const logger = createLogger(config)

    logger.info('nope')
    logger.warn('sure')
    logger.error('of course')

    expect(config.instance.info).not.toHaveBeenCalled()
    expect(config.instance.warn).toHaveBeenCalled()
    expect(config.instance.error).toHaveBeenCalled()
  })

  describe('Timing', () => {
    it('logs the correct string given an object', () => {
      const info = {
        title: 'title',
        time: 1,
        status: 200
      }

      const instance = {
        log: jest.fn()
      }

      const logger = createLogger({
        instance
      })

      logger.timing(info)

      expect(instance.log).toHaveBeenCalledWith('title: 1ms [200]')
    })
  })
})
