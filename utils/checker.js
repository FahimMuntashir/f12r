const execa = require('execa');

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

const TOOL_DEFINITIONS = [
  {
    key: 'brew',
    label: 'Homebrew',
    command: 'brew',
    versionArgs: ['--version']
  },
  {
    key: 'git',
    label: 'Git',
    command: 'git',
    versionArgs: ['--version']
  },
  {
    key: 'node',
    label: 'Node.js',
    command: 'node',
    versionArgs: ['--version']
  },
  {
    key: 'npm',
    label: 'npm',
    command: 'npm',
    versionArgs: ['--version']
  },
  {
    key: 'docker',
    label: 'Docker',
    command: 'docker',
    versionArgs: ['--version'],
    optional: true
  },
  {
    key: 'code',
    label: 'VS Code',
    command: 'code',
    versionArgs: ['--version']
  }
];

const TOOLS = {
  brew: {
    brewName: 'brew',
    installType: 'formula',
    check: () => checkToolWithVersion(TOOL_DEFINITIONS[0])
  },
  git: {
    brewName: 'git',
    installType: 'formula',
    check: () => checkToolWithVersion(TOOL_DEFINITIONS[1])
  },
  node: {
    brewName: 'node',
    installType: 'formula',
    check: () => checkToolWithVersion(TOOL_DEFINITIONS[2])
  },
  npm: {
    brewName: null,
    installType: null,
    check: () => checkToolWithVersion(TOOL_DEFINITIONS[3])
  },
  docker: {
    brewName: 'docker',
    installType: 'cask',
    check: () => checkToolWithVersion(TOOL_DEFINITIONS[4])
  },
  code: {
    brewName: 'visual-studio-code',
    installType: 'cask',
    check: () => checkToolWithVersion(TOOL_DEFINITIONS[5])
  }
};

async function getSystemStatus() {
  return Promise.all(TOOL_DEFINITIONS.map((tool) => checkToolWithVersion(tool)));
}

async function getManagedTools() {
  const keys = ['git', 'node', 'docker', 'code'];
  const tools = await Promise.all(keys.map((key) => TOOLS[key].check()));
  return tools;
}

module.exports = {
  TOOLS,
  commandExists,
  getSystemStatus,
  getManagedTools
};
