# f12r

`f12r` is a macOS CLI for checking, installing, and uninstalling common developer tools.

It helps developers:

- inspect their machine with `f12r doctor`
- install missing tools with `f12r setup`
- install everything non-interactively with `f12r setup --all`
- remove supported tools with `f12r uninstall`

## Features

- checks for Homebrew, Git, Node.js, npm, Docker, and VS Code
- shows friendly colored output
- installs missing tools with Homebrew
- installs selected VS Code extensions
- supports interactive and `--all` setup flows
- works as a global CLI command: `f12r`

## Install

### Homebrew

```bash
brew install FahimMuntashir/f12r/f12r
```

### npm

```bash
npm install -g @f12r/f12r
```

## Quick Start

```bash
f12r --help
f12r doctor
f12r setup
```

## Commands

### `f12r doctor`

Checks whether these tools are installed:

- Homebrew
- Git
- Node.js
- npm
- Docker
- VS Code

It also shows version info when available.

### `f12r setup`

- detects missing tools
- installs Homebrew automatically if needed
- asks before installing each missing tool
- can install these VS Code extensions:
- `esbenp.prettier-vscode`
- `dbaeumer.vscode-eslint`
- `GitHub.copilot`

### `f12r setup --all`

Installs all missing supported tools without per-tool prompts.

### `f12r uninstall`

Lets the user choose a supported tool to remove with Homebrew.

## Local Development

```bash
npm install
node index.js --help
node index.js doctor
node index.js setup
node index.js uninstall
```

To link it globally on your machine:

```bash
npm link
```

## Tech Stack

- Node.js
- CommonJS
- commander
- inquirer
- chalk
- ora
- execa

## Project Links

- GitHub source: `https://github.com/FahimMuntashir/f12r`
- Homebrew tap: `https://github.com/FahimMuntashir/homebrew-f12r`
- npm package: `@f12r/f12r`

## Maintainer Notes

If you are updating or republishing this project later, use:

- `RELEASE_GUIDE.md` for the full release workflow
- `AI_CONTEXT.md` for future AI-agent handoff context
