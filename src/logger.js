const chalk = require('chalk')

// Disable logging for tests
// const log = (process.env.NODE_ENV === 'test') ? () => {} : console.log
const log = console.log

module.exports = {
  info: msg => log(chalk.blue(msg)),
  warning: msg => log(chalk.yellow(msg))
}
