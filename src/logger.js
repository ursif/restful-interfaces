const timing = logger => ({ title, time, status }) =>
  logger.log(`${title}: ${time}ms [${status}]`)

module.exports = ({ instance = console, level = 'debug' } = {}) => {
  const timed = timing(instance)
  const levels = ['debug', 'info', 'log', 'warn', 'error']

  return levels.reduce(
    (a, c) => ({
      ...a,
      [c]: msg => {
        if (levels.indexOf(c) >= levels.indexOf(level)) {
          return instance[c](msg)
        }
      }
    }),
    { timing: timed }
  )
}
