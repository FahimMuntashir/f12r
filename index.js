#!/usr/bin/env node

const { Command } = require('commander');
const runDoctor = require('./commands/doctor');
const runSetup = require('./commands/setup');
const runUninstall = require('./commands/uninstall');
const { error } = require('./utils/logger');
const packageJson = require('./package.json');

const program = new Command();

program
  .name('f12r')
  .description('Set up and manage a macOS development environment.')
  .version(packageJson.version, '-v, --version', 'Show the current f12r version');

program
  .command('doctor')
  .description('Check installed development tools and their versions')
  .action(async () => {
    try {
      await runDoctor();
    } catch (err) {
      error(err.message);
      process.exitCode = 1;
    }
  });

program
  .command('setup')
  .description('Interactively install missing development tools')
  .option('-a, --all', 'Install all missing tools without prompting')
  .action(async (options) => {
    try {
      await runSetup(options);
    } catch (err) {
      error(err.message);
      process.exitCode = 1;
    }
  });

program
  .command('uninstall')
  .description('Remove an installed development tool')
  .action(async () => {
    try {
      await runUninstall();
    } catch (err) {
      error(err.message);
      process.exitCode = 1;
    }
  });

program.showHelpAfterError('(run with --help for usage information)');

program.parseAsync(process.argv);
