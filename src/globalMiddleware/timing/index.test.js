const timing = require('./')
const dummyLogger = {
  timing: () => {}
}
const dummyCTX = {
  request: {
    method: 'GET',
    path: '/'
  }
}
const dummyNext = () => {}
describe('Timing', () => {
  it('exists', () => expect(timing).toBeTruthy())
  it('returns a function', () => expect(typeof timing({})).toBe('function'))

  describe('Timing Middleware', () => {
    const configured = timing({ logger: dummyLogger })

    it('returns a promise', () =>
      expect(configured(dummyCTX, dummyNext).then).toBeDefined())

    it('calls next', () => {
      const next = jest.fn()

      return configured(dummyCTX, next)
        .then(() => expect(next).toHaveBeenCalled())
        .catch(() => expect(true).not.toBe(true))
    })

    it('calls timing with the correct information', () => {
      const next = () => new Promise(res => setTimeout(res, 1000))
      const logger = {
        timing: jest.fn()
      }

      const middleware = timing({ logger })

      return middleware(dummyCTX, next).then(() => {
        const [[timing]] = logger.timing.mock.calls

        expect(timing.time >= 1000).toBe(true)
        expect(timing.title).toBe('GET /')
      })
    })
  })
})
