const { TOOLS, getSystemStatus } = require('../utils/checker');
const { ensureHomebrewInstalled, installTool, installVSCodeExtensions } = require('../utils/installer');
const { confirmInstallTool, confirmInstallExtensions } = require('../utils/prompts');
const { heading, info, success, warning, blank } = require('../utils/logger');

async function runSetup(options = {}) {
  heading('f12r setup');
  info('🔍 Checking system...');

  await ensureHomebrewInstalled();

  const results = await getSystemStatus();
  const missingTools = results.filter((tool) => !tool.installed && tool.key !== 'brew');

  if (!missingTools.length) {
    success('✅ All core tools are already installed.');
  } else {
    for (const tool of missingTools) {
      const shouldInstall = options.all ? true : await confirmInstallTool(tool.label);

      if (!shouldInstall) {
        warning(`Skipped ${tool.label}.`);
        continue;
      }

      await installTool(tool.key);
    }
  }

  const codeStatus = await TOOLS.code.check();
  if (!codeStatus.installed) {
    warning('VS Code extensions were skipped because the `code` command is not available.');
    return;
  }

  const shouldInstallExtensions = options.all ? true : await confirmInstallExtensions();

  if (!shouldInstallExtensions) {
    info('VS Code extensions skipped.');
    return;
  }

  await installVSCodeExtensions();
  blank();
  success('✅ Setup complete.');
}

module.exports = runSetup;
