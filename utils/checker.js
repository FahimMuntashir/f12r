const execa = require('execa');
const { isLinux, isMacOS, getPlatform } = require('./platform');

async function commandExists(command) {
  try {
    await execa('which', [command]);
    return true;
  } catch (err) {
    return false;
  }
}

async function getVersion(command, args = ['--version']) {
  try {
    const { stdout } = await execa(command, args);
    const firstLine = stdout.split('\n').find(Boolean);
    return firstLine ? firstLine.trim() : null;
  } catch (err) {
    return null;
  }
}

async function checkToolWithVersion({ key, label, command, versionArgs, optional }) {
  const installed = await commandExists(command);

  return {
    key,
    label,
    command,
    optional: Boolean(optional),
    installed,
    version: installed ? await getVersion(command, versionArgs) : null
  };
}

const TOOLS = {
  brew: {
    key: 'brew',
    label: 'Homebrew',
    command: 'brew',
    brewName: 'brew',
    installType: 'formula',
    supportedPlatforms: ['macos'],
    check() {
      return checkToolWithVersion(this);
    }
  },
  apt: {
    key: 'apt',
    label: 'APT',
    command: 'apt',
    versionArgs: ['--version'],
    supportedPlatforms: ['linux'],
    check() {
      return checkToolWithVersion(this);
    }
  },
  git: {
    key: 'git',
    label: 'Git',
    command: 'git',
    versionArgs: ['--version'],
    brewName: 'git',
    aptName: 'git',
    installType: 'formula',
    supportedPlatforms: ['macos', 'linux'],
    check() {
      return checkToolWithVersion(this);
    }
  },
  node: {
    key: 'node',
    label: 'Node.js',
    command: 'node',
    versionArgs: ['--version'],
    brewName: 'node',
    aptName: 'nodejs',
    installType: 'formula',
    supportedPlatforms: ['macos', 'linux'],
    check() {
      return checkToolWithVersion(this);
    }
  },
  npm: {
    key: 'npm',
    label: 'npm',
    command: 'npm',
    versionArgs: ['--version'],
    brewName: null,
    aptName: 'npm',
    installType: null,
    supportedPlatforms: ['macos', 'linux'],
    check() {
      return checkToolWithVersion(this);
    }
  },
  docker: {
    key: 'docker',
    label: 'Docker',
    command: 'docker',
    versionArgs: ['--version'],
    brewName: 'docker',
    aptName: 'docker.io',
    installType: 'cask',
    optional: true,
    supportedPlatforms: ['macos', 'linux'],
    check() {
      return checkToolWithVersion(this);
    }
  },
  code: {
    key: 'code',
    label: 'VS Code',
    command: 'code',
    versionArgs: ['--version'],
    brewName: 'visual-studio-code',
    aptName: null,
    snapName: 'code',
    installType: 'cask',
    supportedPlatforms: ['macos', 'linux'],
    check() {
      return checkToolWithVersion(this);
    }
  }
};

function getSupportedToolDefinitions() {
  const platform = getPlatform();

  return Object.values(TOOLS).filter((tool) => tool.supportedPlatforms.includes(platform));
}

async function getSystemStatus() {
  const tools = getSupportedToolDefinitions();
  return Promise.all(tools.map((tool) => checkToolWithVersion(tool)));
}

async function getManagedTools() {
  const keys = ['git', 'node', 'docker', 'code'];
  const tools = await Promise.all(keys.map((key) => TOOLS[key].check()));
  const platform = getPlatform();
  return tools.filter((tool) => TOOLS[tool.key].supportedPlatforms.includes(platform));
}

module.exports = {
  TOOLS,
  commandExists,
  getSystemStatus,
  getManagedTools,
  getSupportedToolDefinitions,
  isLinux,
  isMacOS
};
