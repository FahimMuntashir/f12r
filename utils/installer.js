const execa = require('execa');
const ora = require('ora');
const { TOOLS, commandExists } = require('./checker');
const { warning, info } = require('./logger');
const { getPlatform, isLinux, isMacOS } = require('./platform');

const VS_CODE_EXTENSIONS = [
  'esbenp.prettier-vscode',
  'dbaeumer.vscode-eslint',
  'GitHub.copilot'
];

async function runBrew(args) {
  return execa('brew', args, { stdio: 'pipe' });
}

async function runApt(args) {
  return execa('sudo', ['apt-get', ...args], { stdio: 'pipe' });
}

async function ensureHomebrewInstalled() {
  if (!isMacOS()) {
    return;
  }

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

async function ensurePackageManagerReady() {
  if (isMacOS()) {
    await ensureHomebrewInstalled();
    return;
  }

  if (isLinux()) {
    const aptStatus = await TOOLS.apt.check();

    if (!aptStatus.installed) {
      throw new Error('APT is not available on this Linux system.');
    }

    const spinner = ora('🔍 Refreshing APT package index...').start();

    try {
      await runApt(['update']);
      spinner.succeed('✅ APT package index updated');
    } catch (err) {
      spinner.fail('❌ Failed to refresh APT package index');
      throw new Error(formatCommandError(err));
    }
  }
}

async function installTool(toolKey) {
  const tool = TOOLS[toolKey];
  const platform = getPlatform();

  if (!tool) {
    throw new Error(`Unsupported tool: ${toolKey}`);
  }

  const label = tool.label;
  const spinner = ora(`🚀 Installing ${label}...`).start();

  try {
    if (platform === 'macos') {
      if (!tool.brewName) {
        throw new Error(`Unsupported tool on macOS: ${toolKey}`);
      }

      if (tool.installType === 'cask') {
        await runBrew(['install', '--cask', tool.brewName]);
      } else {
        await runBrew(['install', tool.brewName]);
      }
    } else if (platform === 'linux') {
      if (tool.key === 'code') {
        await installVSCodeOnLinux();
      } else if (tool.aptName) {
        await runApt(['install', '-y', tool.aptName]);
      } else {
        throw new Error(`Unsupported tool on Linux: ${toolKey}`);
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    spinner.succeed(`✅ ${label} installed successfully`);
  } catch (err) {
    spinner.fail(`❌ Failed to install ${label}`);
    throw new Error(formatCommandError(err));
  }
}

async function uninstallTool(toolKey) {
  const tool = TOOLS[toolKey];
  const platform = getPlatform();

  if (!tool) {
    throw new Error(`Unsupported tool: ${toolKey}`);
  }

  const spinner = ora(`🧹 Uninstalling ${tool.label}...`).start();

  try {
    if (platform === 'macos') {
      if (!tool.brewName) {
        throw new Error(`Unsupported tool on macOS: ${toolKey}`);
      }

      if (tool.installType === 'cask') {
        await runBrew(['uninstall', '--cask', tool.brewName]);
      } else {
        await runBrew(['uninstall', tool.brewName]);
      }
    } else if (platform === 'linux') {
      if (tool.key === 'code') {
        await uninstallVSCodeOnLinux();
      } else if (tool.aptName) {
        await runApt(['remove', '-y', tool.aptName]);
      } else {
        throw new Error(`Unsupported tool on Linux: ${toolKey}`);
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    spinner.succeed(`✅ ${tool.label} removed successfully`);
  } catch (err) {
    spinner.fail(`❌ Failed to uninstall ${tool.label}`);
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

async function installVSCodeOnLinux() {
  const hasSnap = await commandExists('snap');

  if (!hasSnap) {
    throw new Error('VS Code install on Linux requires `snap`. Install snapd first or install VS Code manually.');
  }

  await execa('sudo', ['snap', 'install', 'code', '--classic'], { stdio: 'pipe' });
}

async function uninstallVSCodeOnLinux() {
  const hasSnap = await commandExists('snap');

  if (!hasSnap) {
    throw new Error('VS Code uninstall on Linux requires `snap`.');
  }

  await execa('sudo', ['snap', 'remove', 'code'], { stdio: 'pipe' });
}

function formatCommandError(err) {
  const output = err.stderr || err.stdout || err.shortMessage || err.message;
  return output.trim();
}

module.exports = {
  VS_CODE_EXTENSIONS,
  ensurePackageManagerReady,
  ensureHomebrewInstalled,
  installTool,
  uninstallTool,
  installVSCodeExtensions
};
