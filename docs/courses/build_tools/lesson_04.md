# Lesson 04 — Linting & Formatting

> **Course:** Build Tools & Toolchain · **Time:** 30 minutes
> **🔗 Official Docs:** [ESLint Docs](https://eslint.org/docs/latest/) · [Prettier Docs](https://prettier.io/docs/en/)

---

## 🎯 Learning Objectives

- [ ] Explain the difference between a linter and a formatter
- [ ] Configure ESLint for a TypeScript project
- [ ] Configure Prettier and integrate it with ESLint
- [ ] Add editor integration so errors appear inline in VS Code

---

## 📖 Concepts

### Linter vs. Formatter

| | ESLint | Prettier |
|-|--------|---------|
| **Purpose** | Find bugs and enforce code patterns | Enforce consistent whitespace/style |
| **Examples** | Unused variables, missing `await`, `==` vs `===` | Indentation, quote style, trailing commas |
| **Auto-fix?** | Yes (for some rules) | Yes (fully) |

Use both: ESLint catches logic errors, Prettier handles all formatting decisions.

### ESLint Setup

```bash
# Initialize ESLint config interactively
npm init @eslint/config@latest

# Or install manually
npm install --save-dev eslint @eslint/js typescript-eslint
```

```javascript
// eslint.config.js (flat config — ESLint 9+)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            // Error-level: code cannot ship with these
            'no-console': 'warn',               // Warn on console.log
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn', // Avoid 'any' type

            // Off rules you find too strict
            '@typescript-eslint/no-non-null-assertion': 'off',
        }
    }
);
```

```json
// package.json — add lint scripts
{
    "scripts": {
        "lint":     "eslint src/",
        "lint:fix": "eslint src/ --fix"
    }
}
```

### Prettier Setup

```bash
npm install --save-dev prettier eslint-config-prettier
```

```json
// .prettierrc (configuration file)
{
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "printWidth": 100,
    "tabWidth": 2,
    "arrowParens": "avoid"
}
```

```
# .prettierignore
dist/
node_modules/
```

Integrate with ESLint (disable formatting rules that Prettier handles):
```javascript
// eslint.config.js — add prettier config last to override ESLint formatting rules
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,  // ← this disables ESLint format rules
    { rules: { /* your custom rules */ } }
);
```

```json
// package.json
{
    "scripts": {
        "format":       "prettier --write src/",
        "format:check": "prettier --check src/"
    }
}
```

### VS Code Integration

Install these extensions:
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)

```json
// .vscode/settings.json — shared settings for the project
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
```

Commit `.vscode/settings.json` so the whole team gets the same editor behaviour.

---

## ✅ Milestone Checklist

- [ ] ESLint catches unused variables and TypeScript errors
- [ ] Prettier formats on save in VS Code
- [ ] `npm run lint` exits with 0 when code is clean
- [ ] I understand why Prettier and ESLint serve different purposes

## ➡️ Next Unit

[Lesson 05 — Testing Setup](./lesson_05.md)
