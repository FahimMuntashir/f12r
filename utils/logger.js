const chalk = require('chalk');

function heading(message) {
  console.log(chalk.cyan.bold(message));
}

function info(message) {
  console.log(chalk.blue(message));
}

function success(message) {
  console.log(chalk.green(message));
}

function warning(message) {
  console.log(chalk.yellow(message));
}

function error(message) {
  console.error(chalk.red(message));
}

function blank() {
  console.log('');
}

module.exports = {
  heading,
  info,
  success,
  warning,
  error,
  blank
};
