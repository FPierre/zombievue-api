const chalk = require('chalk')

const log = (process.env.NODE_ENV === 'test') ? () => {} : console.log

module.exports = {
  info: msg => log(chalk.blue(msg)),
  warning: msg => log(chalk.yellow(msg))
}
