const execa = require('execa');
const ora = require('ora');
const { TOOLS } = require('./checker');
const { warning, info } = require('./logger');

const VS_CODE_EXTENSIONS = [
  'esbenp.prettier-vscode',
  'dbaeumer.vscode-eslint',
  'GitHub.copilot'
];

async function runBrew(args) {
  return execa('brew', args, { stdio: 'pipe' });
}

async function ensureHomebrewInstalled() {
  const brewStatus = await TOOLS.brew.check();

  if (brewStatus.installed) {
    return;
  }

  const spinner = ora('🚀 Installing Homebrew...').start();

  try {
    await execa(
      '/bin/bash',
      [
        '-c',
        '$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)'
      ],
      {
        env: {
          ...process.env,
          NONINTERACTIVE: '1'
        },
        shell: false,
        stdio: 'pipe'
      }
    );
    spinner.succeed('✅ Homebrew installed successfully');
  } catch (err) {
    spinner.fail('❌ Failed to install Homebrew');
    throw new Error(formatCommandError(err));
  }
}

async function installTool(toolKey) {
  const tool = TOOLS[toolKey];

  if (!tool || !tool.brewName) {
    throw new Error(`Unsupported tool: ${toolKey}`);
  }

  const spinner = ora(`🚀 Installing ${toolKey === 'code' ? 'VS Code' : capitalize(toolKey)}...`).start();

  try {
    if (tool.installType === 'cask') {
      await runBrew(['install', '--cask', tool.brewName]);
    } else {
      await runBrew(['install', tool.brewName]);
    }

    spinner.succeed(`✅ ${toolKey === 'code' ? 'VS Code' : capitalize(toolKey)} installed successfully`);
  } catch (err) {
    spinner.fail(`❌ Failed to install ${toolKey === 'code' ? 'VS Code' : capitalize(toolKey)}`);
    throw new Error(formatCommandError(err));
  }
}

async function uninstallTool(toolKey) {
  const tool = TOOLS[toolKey];

  if (!tool || !tool.brewName) {
    throw new Error(`Unsupported tool: ${toolKey}`);
  }

  const spinner = ora(`🧹 Uninstalling ${toolKey === 'code' ? 'VS Code' : capitalize(toolKey)}...`).start();

  try {
    if (tool.installType === 'cask') {
      await runBrew(['uninstall', '--cask', tool.brewName]);
    } else {
      await runBrew(['uninstall', tool.brewName]);
    }

    spinner.succeed(`✅ ${toolKey === 'code' ? 'VS Code' : capitalize(toolKey)} removed successfully`);
  } catch (err) {
    spinner.fail(`❌ Failed to uninstall ${toolKey === 'code' ? 'VS Code' : capitalize(toolKey)}`);
    throw new Error(formatCommandError(err));
  }
}

async function installVSCodeExtensions() {
  info('🚀 Installing VS Code extensions...');

  for (const extension of VS_CODE_EXTENSIONS) {
    const spinner = ora(`Installing ${extension}...`).start();

    try {
      await execa('code', ['--install-extension', extension], { stdio: 'pipe' });
      spinner.succeed(`✅ Installed ${extension}`);
    } catch (err) {
      spinner.fail(`❌ Failed to install ${extension}`);
      warning(formatCommandError(err));
    }
  }
}

function formatCommandError(err) {
  const output = err.stderr || err.stdout || err.shortMessage || err.message;
  return output.trim();
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

module.exports = {
  VS_CODE_EXTENSIONS,
  ensureHomebrewInstalled,
  installTool,
  uninstallTool,
  installVSCodeExtensions
};
