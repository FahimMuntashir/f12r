const inquirer = require('inquirer');

async function confirmInstallTool(toolLabel) {
  const { shouldInstall } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldInstall',
      message: `Install ${toolLabel}?`,
      default: true
    }
  ]);

  return shouldInstall;
}

async function confirmInstallExtensions() {
  const { shouldInstallExtensions } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldInstallExtensions',
      message: 'Install VS Code extensions?',
      default: true
    }
  ]);

  return shouldInstallExtensions;
}

async function chooseToolToUninstall(installedTools) {
  const { tool } = await inquirer.prompt([
    {
      type: 'list',
      name: 'tool',
      message: 'Which tool would you like to remove?',
      choices: installedTools.map((installedTool) => ({
        name: installedTool.label,
        value: installedTool.key
      }))
    }
  ]);

  return tool;
}

async function confirmUninstallTool(toolLabel) {
  const { shouldUninstall } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldUninstall',
      message: `Uninstall ${toolLabel}?`,
      default: false
    }
  ]);

  return shouldUninstall;
}

module.exports = {
  confirmInstallTool,
  confirmInstallExtensions,
  chooseToolToUninstall,
  confirmUninstallTool
};
