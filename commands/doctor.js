const { getSystemStatus } = require('../utils/checker');
const { heading, info, success, error, warning, blank } = require('../utils/logger');

async function runDoctor() {
  heading('f12r doctor');
  info('🔍 Checking system...');

  const results = await getSystemStatus();
  blank();

  results.forEach((tool) => {
    if (tool.installed) {
      success(`✅ ${tool.label}: Installed${tool.version ? ` (${tool.version})` : ''}`);
      return;
    }

    if (tool.optional) {
      warning(`❌ ${tool.label}: Not Installed (optional)`);
      return;
    }

    error(`❌ ${tool.label}: Not Installed`);
  });
}

module.exports = runDoctor;
