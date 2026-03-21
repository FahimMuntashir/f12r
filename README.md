# f12r

`f12r` is a macOS CLI for checking, installing, and uninstalling common developer tools.

It supports:

- `f12r doctor`
- `f12r setup`
- `f12r setup --all`
- `f12r uninstall`

The project is built with Node.js and uses:

- `commander`
- `inquirer`
- `chalk`
- `ora`
- `execa`

## What This Project Does

`f12r doctor`

- checks whether these tools are installed:
- Homebrew
- Git
- Node.js
- npm
- Docker
- VS Code

`f12r setup`

- checks what is missing
- installs Homebrew automatically if needed
- asks before installing tools
- can install common VS Code extensions

`f12r uninstall`

- lets the user choose a supported tool to remove with Homebrew

## Project Structure

```text
f12r/
├── index.js
├── package.json
├── package-lock.json
├── README.md
├── RELEASE_GUIDE.md
├── AI_CONTEXT.md
├── commands/
│   ├── doctor.js
│   ├── setup.js
│   └── uninstall.js
└── utils/
    ├── checker.js
    ├── installer.js
    ├── logger.js
    └── prompts.js
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
node index.js --help
node index.js doctor
node index.js setup
node index.js uninstall
```

### 3. Link globally on your own machine

```bash
npm link
```

Then test:

```bash
f12r --help
f12r doctor
```

## Public Install

### Homebrew

```bash
brew install FahimMuntashir/f12r/f12r
```

### npm

```bash
npm install -g @f12r/f12r
```

### Verify installation

```bash
f12r --version
f12r --help
f12r doctor
```

## Beginner Publishing Flow

There are 3 parts:

1. GitHub source repository
2. npm package
3. Homebrew tap

Current project locations:

- Source repo: `https://github.com/FahimMuntashir/f12r`
- Homebrew tap repo: `https://github.com/FahimMuntashir/homebrew-f12r`
- npm package: `@f12r/f12r`

If you are changing the app later, use [RELEASE_GUIDE.md](/Users/innospace/Desktop/f12r/RELEASE_GUIDE.md).

If another AI agent needs full context, give it [AI_CONTEXT.md](/Users/innospace/Desktop/f12r/AI_CONTEXT.md).
