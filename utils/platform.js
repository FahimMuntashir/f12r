function getPlatform() {
  if (process.platform === 'darwin') {
    return 'macos';
  }

  if (process.platform === 'linux') {
    return 'linux';
  }

  return 'unsupported';
}

function isMacOS() {
  return getPlatform() === 'macos';
}

function isLinux() {
  return getPlatform() === 'linux';
}

module.exports = {
  getPlatform,
  isMacOS,
  isLinux
};
