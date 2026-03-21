# AI Context For f12r

This file is meant to help a future AI agent understand the `f12r` project quickly.

## Project Identity

- Project name: `f12r`
- CLI command: `f12r`
- Source repository: `https://github.com/FahimMuntashir/f12r`
- npm package: `@f12r/f12r`
- Homebrew tap repository: `https://github.com/FahimMuntashir/homebrew-f12r`
- Homebrew install command: `brew install FahimMuntashir/f12r/f12r`

## Project Purpose

`f12r` is a macOS-focused Node.js CLI that helps developers set up and manage a development environment.

Main commands:

- `f12r doctor`
- `f12r setup`
- `f12r uninstall`

Bonus command behavior:

- `f12r setup --all`

## Tech Stack

- Node.js
- CommonJS modules
- `commander`
- `inquirer`
- `chalk`
- `ora`
- `execa`

## Current Source Structure

- [index.js](/Users/innospace/Desktop/f12r/index.js): CLI entrypoint and command registration
- [commands/doctor.js](/Users/innospace/Desktop/f12r/commands/doctor.js): doctor command
- [commands/setup.js](/Users/innospace/Desktop/f12r/commands/setup.js): setup command
- [commands/uninstall.js](/Users/innospace/Desktop/f12r/commands/uninstall.js): uninstall command
- [utils/checker.js](/Users/innospace/Desktop/f12r/utils/checker.js): command detection and version checks
- [utils/installer.js](/Users/innospace/Desktop/f12r/utils/installer.js): Homebrew/npm install helpers and VS Code extension installs
- [utils/logger.js](/Users/innospace/Desktop/f12r/utils/logger.js): colored log wrappers
- [utils/prompts.js](/Users/innospace/Desktop/f12r/utils/prompts.js): Inquirer prompt helpers
- [package.json](/Users/innospace/Desktop/f12r/package.json): package metadata and CLI bin declaration

## Important Functional Behavior

### `doctor`

Checks:

- Homebrew
- Git
- Node.js
- npm
- Docker
- VS Code

Shows installed/not installed and version when available.

### `setup`

- ensures Homebrew exists
- checks installed tools
- skips tools already installed
- prompts to install missing tools unless `--all` is used
- optionally installs VS Code extensions:
- `esbenp.prettier-vscode`
- `dbaeumer.vscode-eslint`
- `GitHub.copilot`

### `uninstall`

- shows supported removable tools
- uses Homebrew uninstall
- prompts before uninstalling

## Publishing History And Constraints

### npm naming

The unscoped name `f12r` was rejected by npm because it was too similar to an existing package.

The working package name is:

```json
"name": "@f12r/f12r"
```

### CLI command name

Even though the npm package is scoped, the user-facing command remains:

```json
"bin": {
  "f12r": "index.js"
}
```

### Homebrew

Homebrew installation currently works through a custom tap, not `homebrew/core`.

Supported public install command:

```bash
brew install FahimMuntashir/f12r/f12r
```

Not supported yet:

```bash
brew install f12r
```

## Homebrew Formula Details

Tap local path on the maintainer machine:

```bash
/opt/homebrew/Library/Taps/fahimmuntashir/homebrew-f12r
```

Formula path:

```bash
/opt/homebrew/Library/Taps/fahimmuntashir/homebrew-f12r/Formula/f12r.rb
```

Current formula strategy:

- `depends_on "node"`
- installs from npm tarball URL
- uses `system "npm", "install", *std_npm_args`
- wraps the `f12r` executable with `write_env_script`

## Important Operational Notes

### If a maintainer wants to release a new version

Use [RELEASE_GUIDE.md](/Users/innospace/Desktop/f12r/RELEASE_GUIDE.md).

High-level flow:

1. change code
2. bump version
3. push git changes and tags
4. publish npm package
5. update Homebrew formula URL and SHA
6. test brew install
7. push the tap repo

### If `brew untap` breaks the shell

This happened before because the shell was inside the tap directory when untapping it.

Always move elsewhere first:

```bash
cd ~
brew untap FahimMuntashir/f12r
```

### If npm tokens are exposed

Revoke them immediately from npm account settings.

## Recommended Future Improvements

- add automated tests
- add a proper README with examples and screenshots or terminal demos
- add GitHub Actions for lint/test on the source repo
- optionally support more tools
- optionally detect missing VS Code `code` shell command more explicitly

## Best Files To Read First For Any Future Agent

1. [package.json](/Users/innospace/Desktop/f12r/package.json)
2. [index.js](/Users/innospace/Desktop/f12r/index.js)
3. [utils/checker.js](/Users/innospace/Desktop/f12r/utils/checker.js)
4. [utils/installer.js](/Users/innospace/Desktop/f12r/utils/installer.js)
5. [RELEASE_GUIDE.md](/Users/innospace/Desktop/f12r/RELEASE_GUIDE.md)
