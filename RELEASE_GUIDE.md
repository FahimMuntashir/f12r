# f12r Release Guide

This file is a beginner-friendly guide for publishing and updating `f12r`.

## Quick Summary

The project has 3 public pieces:

1. Source code repository
2. npm package
3. Homebrew formula

Current public setup:

- GitHub source repo: `https://github.com/FahimMuntashir/f12r`
- Homebrew tap repo: `https://github.com/FahimMuntashir/homebrew-f12r`
- npm package name: `@f12r/f12r`
- Homebrew install command: `brew install FahimMuntashir/f12r/f12r`

## One-Time Setup That Is Already Done

These are already completed for this project:

- GitHub repo created
- npm account connected
- npm package published
- Homebrew tap created
- Homebrew formula added
- Global `brew install FahimMuntashir/f12r/f12r` tested successfully

## How Users Install f12r

### Option 1: Homebrew

```bash
brew install FahimMuntashir/f12r/f12r
```

### Option 2: npm

```bash
npm install -g @f12r/f12r
```

## Very Important Safety Notes

### 1. If you ever paste an npm token somewhere public

Revoke it immediately in npm account settings and create a new token.

### 2. Do not rename the CLI command

The npm package name is scoped as `@f12r/f12r`, but the actual command should stay:

```bash
f12r
```

### 3. `brew install f12r` is not available yet

The public install command for now is:

```bash
brew install FahimMuntashir/f12r/f12r
```

`brew install f12r` only becomes possible if Homebrew later accepts the package into `homebrew/core`.

## Normal Release Flow For A New Version

Example: releasing `1.0.1`

### Step 1. Make your code changes

Update the source code in this repo and test locally:

```bash
npm install
node index.js doctor
node index.js --help
```

If needed:

```bash
node index.js setup
node index.js uninstall
```

### Step 2. Bump the version

For a patch release:

```bash
npm version patch
```

For a minor release:

```bash
npm version minor
```

For a major release:

```bash
npm version major
```

This updates `package.json`, updates `package-lock.json`, and creates a git tag.

### Step 3. Push source code to GitHub

```bash
git push
git push --tags
```

### Step 4. Publish the new npm version

```bash
npm publish --access=public
```

Then verify:

```bash
npm view @f12r/f12r version
```

If npm has a short delay, wait a few minutes and try again.

### Step 5. Update the Homebrew formula

The formula lives in the tap repo, not in this source repo.

Formula path:

```bash
/opt/homebrew/Library/Taps/fahimmuntashir/homebrew-f12r/Formula/f12r.rb
```

Update:

- `url`
- `sha256`

The URL format will be:

```bash
https://registry.npmjs.org/@f12r/f12r/-/f12r-VERSION.tgz
```

Example:

```bash
https://registry.npmjs.org/@f12r/f12r/-/f12r-1.0.1.tgz
```

### Step 6. Get the new SHA256

Run:

```bash
curl -L https://registry.npmjs.org/@f12r/f12r/-/f12r-1.0.1.tgz | shasum -a 256
```

Copy the SHA256 output into the formula.

### Step 7. Test the Homebrew formula

First move to a safe existing directory:

```bash
cd ~
```

Then run:

```bash
brew audit --strict FahimMuntashir/f12r/f12r
brew reinstall --build-from-source FahimMuntashir/f12r/f12r
f12r --version
f12r doctor
```

If `brew reinstall` gives trouble, use:

```bash
brew uninstall f12r
brew install FahimMuntashir/f12r/f12r
```

### Step 8. Push the updated formula

```bash
cd /opt/homebrew/Library/Taps/fahimmuntashir/homebrew-f12r
git status
git add Formula/f12r.rb
git commit -m "Update f12r to 1.0.1"
git push
```

After this, Homebrew users can install the new version.

## First-Time Homebrew Formula Reference

Current working formula:

```rb
class F12r < Formula
  desc "CLI to set up and manage a macOS development environment"
  homepage "https://github.com/FahimMuntashir/f12r"
  url "https://registry.npmjs.org/@f12r/f12r/-/f12r-1.0.0.tgz"
  sha256 "aa8232c019f1d368f775f973bd743494f7747de6a6db074d6cbe5762a0e660b9"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    (bin/"f12r").write_env_script libexec/"bin/f12r", PATH: "#{Formula["node"].opt_bin}:$PATH"
  end

  test do
    assert_match "f12r", shell_output("#{bin}/f12r --help")
  end
end
```

## Common Problems

### Problem: npm says package name is too similar to another package

Use the scoped npm package name:

```json
"name": "@f12r/f12r"
```

### Problem: `npm view @f12r/f12r version` returns 404 right after publish

Wait a few minutes and try again. npm can take a short time to update.

### Problem: `brew untap` breaks the current terminal directory

This happens if you are standing inside the tap folder while untapping it.

Wrong:

```bash
cd /opt/homebrew/Library/Taps/fahimmuntashir/homebrew-f12r
brew untap FahimMuntashir/f12r
```

Correct:

```bash
cd ~
brew untap FahimMuntashir/f12r
```

### Problem: Homebrew install works locally but not for others

Check these:

- the tap repo was pushed to GitHub
- the formula file was committed and pushed
- the npm tarball URL in the formula is correct
- the SHA256 matches the published tarball

### Problem: `brew install f12r` does not work

That is expected for now.

Use:

```bash
brew install FahimMuntashir/f12r/f12r
```

## What To Tell Future AI Agents

If you use another AI later, share:

- [AI_CONTEXT.md](/Users/innospace/Desktop/f12r/AI_CONTEXT.md)
- [RELEASE_GUIDE.md](/Users/innospace/Desktop/f12r/RELEASE_GUIDE.md)

That will give the AI the correct project and publishing context quickly.
