const { getManagedTools } = require('../utils/checker');
const { uninstallTool } = require('../utils/installer');
const { chooseToolToUninstall, confirmUninstallTool } = require('../utils/prompts');
const { heading, info, warning, success } = require('../utils/logger');
const { isMacOS, isLinux } = require('../utils/platform');

async function runUninstall() {
  heading('f12r uninstall');
  info('🔍 Checking installed removable tools...');

  if (!isMacOS() && !isLinux()) {
    warning('Automatic uninstall is only supported on macOS and Linux.');
    return;
  }

  const removableTools = await getManagedTools();
  const installedTools = removableTools.filter((tool) => tool.installed);

  if (!installedTools.length) {
    warning('No supported tools are currently installed via detectable commands.');
    return;
  }

  const selectedToolKey = await chooseToolToUninstall(installedTools);
  const selectedTool = installedTools.find((tool) => tool.key === selectedToolKey);
  const shouldUninstall = await confirmUninstallTool(selectedTool.label);

  if (!shouldUninstall) {
    warning(`Cancelled uninstall for ${selectedTool.label}.`);
    return;
  }

  await uninstallTool(selectedTool.key);
  success(`✅ ${selectedTool.label} uninstall flow finished.`);
}

module.exports = runUninstall;
