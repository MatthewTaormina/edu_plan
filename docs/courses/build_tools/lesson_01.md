# Lesson 01 — Node.js & Package Management

> **Course:** Build Tools & Toolchain · **Time:** 45 minutes
> **📖 Wiki:** [JavaScript Core](../../domains/web_dev/javascript_core.md)
> **🔗 Official Docs:** [Node.js Docs](https://nodejs.org/en/docs) · [npm Docs](https://docs.npmjs.com/) · [pnpm Docs](https://pnpm.io/)

---

## 🎯 Learning Objectives

- [ ] Explain why Node.js is needed for frontend development (even though you're not writing server-side code)
- [ ] Initialize a project with `npm init`
- [ ] Install, remove, and audit dependencies
- [ ] Read and understand `package.json` fields
- [ ] Understand the difference between `dependencies` and `devDependencies`

---

## 📖 Concepts

### What is Node.js and Why Do You Need It?

Node.js is a JavaScript runtime built on Chrome's V8 engine. It lets JavaScript run **outside the browser** — on your machine or a server.

Even though you're building a frontend (browser) application, you need Node.js for:
- Running your **dev server** (hot reloading, proxying)
- **Bundling** your source files into browser-compatible output
- **Running scripts** — linting, testing, building
- **Installing packages** via npm

You are not writing server-side code. Node.js is just your toolchain host.

### Installing Node.js

```powershell
# Windows — download the LTS installer from nodejs.org
# OR use winget:
winget install OpenJS.NodeJS.LTS

# Verify installation
node --version   # v20.x.x or later
npm --version    # 10.x.x or later
```

```bash
# Linux — use nvm (Node Version Manager) — recommended
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts

# Verify
node --version
npm --version
```

### Initialising a Project

```bash
# Create a new directory and enter it
mkdir my-project
cd my-project

# Initialise — creates package.json
npm init -y    # -y accepts all defaults
```

### `package.json` Explained

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample project",
  "type": "module",          // Enables ES Modules (import/export) — always add this
  "scripts": {
    "dev":   "vite",          // npm run dev  → starts dev server
    "build": "vite build",    // npm run build → create production bundle
    "test":  "vitest"         // npm run test  → run tests
  },
  "dependencies": {
    // Libraries that are needed at RUNTIME in the browser
    "react":     "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    // Libraries only needed during DEVELOPMENT — not shipped to users
    "vite":     "^5.4.0",
    "vitest":   "^1.6.0",
    "eslint":   "^9.0.0"
  }
}
```

- **`dependencies`**: shipped with the app (`react`, `axios`, etc.)
- **`devDependencies`**: only used at build/test time (`vite`, `eslint`, `typescript`)

### Installing Packages

```bash
# Install a runtime dependency
npm install react react-dom

# Install a dev dependency
npm install --save-dev vite typescript eslint

# Install a specific version
npm install react@18.3.0

# Remove a package
npm uninstall some-package

# Install all dependencies listed in package.json (e.g. after cloning a repo)
npm install
```

### `node_modules` and `.gitignore`

`npm install` downloads packages into `node_modules/`, which can be hundreds of MB. **Never commit this folder to Git.**

```bash
# .gitignore
node_modules/
dist/
.env
.env.local
```

Anyone who clones your repo runs `npm install` to rebuild the folder.

### `package-lock.json` — Reproducible Installs

`package-lock.json` records the exact version of every installed package (including transitive dependencies). Always commit this file so that everyone on the team gets *identical* installs.

### pnpm — Faster, Disk-Efficient Alternative

pnpm is a popular drop-in replacement for npm that stores packages in a global content-addressed store, using hard links instead of copying. This makes installs significantly faster and uses far less disk space on machines with multiple projects.

```bash
# Install pnpm globally
npm install -g pnpm

# Same commands, pnpm prefix
pnpm init
pnpm install react react-dom
pnpm add --save-dev vite
pnpm remove some-package
pnpm install               # Install all deps from package.json
```

---

## 🏗️ Assignments

### Assignment 1 — Project Initialisation

1. Create a new directory `toolchain-practice`.
2. Run `npm init -y`.
3. Add `"type": "module"` to `package.json`.
4. Add three scripts: `dev`, `build`, `test` (they can point to `echo` commands for now).
5. Install `vite` as a devDependency.
6. Create a `.gitignore` with `node_modules/` and `dist/`.

### Assignment 2 — Package Exploration

1. Install `date-fns` (a utility library).
2. Open `node_modules/date-fns` and look at its `package.json`.
3. Run `npm ls` to see the full dependency tree.
4. Run `npm outdated` to see which packages have newer versions.

---

## ✅ Milestone Checklist

- [ ] I initialised a project with `npm init` and understand every field in `package.json`
- [ ] I know the difference between `dependencies` and `devDependencies`
- [ ] I added `node_modules/` to `.gitignore`
- [ ] I understand what `package-lock.json` is for and why to commit it

## ➡️ Next Unit

[Lesson 02 — ES Modules, Bundling & Tree-Shaking](./lesson_02.md)
