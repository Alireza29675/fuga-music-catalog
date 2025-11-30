# @fuga-catalog/tooling

Shared linting and formatting configs for the FUGA catalog monorepo.

## What's Included

- **ESLint configs** - TypeScript, Node.js, React with custom rules
- **Prettier config** - Opinionated code formatting
- **Custom ESLint rules** - Project-specific linting

## Features

### ESLint

**Base Config (`@fuga-catalog/tooling/eslint/base`)**
- TypeScript support with recommended rules
- Import order enforcement
- Circular dependency detection
- Console log warnings (allows console.error/warn)
- Unused variable checking with `_` prefix support

**Node.js Config (`@fuga-catalog/tooling/eslint/node`)**
- Extends base config
- Node.js globals (console, process, Buffer, etc.)
- Jest/test globals (describe, it, expect, etc.)
- Custom `no-process-env` rule (restricts process.env to specific files)
- Node.js best practices (no-process-exit, no-path-concat)

**React Config (`@fuga-catalog/tooling/eslint/react`)**
- Extends base config
- React recommended rules
- React Hooks rules (rules-of-hooks, exhaustive-deps)
- Next.js compatible (no react-in-jsx-scope)
- JSX best practices

### Custom Rules

**no-process-env**
- Restricts `process.env` usage to specific files
- Allowed in:
  - `env.ts`
  - `test-setup.ts`
  - `*.test.ts`, `*.spec.ts`
  - `*.test.tsx`, `*.spec.tsx`
- Forces environment variables to be centralized in `env.ts`

### Prettier

- 80 character line width
- 2 space indentation
- Single quotes
- Semicolons enabled
- Trailing commas (ES5)
- LF line endings

## Usage

### In Node.js/API packages

```javascript
// eslint.config.js
import nodeConfig from '@fuga-catalog/tooling/eslint/node';
export default nodeConfig;
```

### In React/Next.js packages

```javascript
// eslint.config.js
import reactConfig from '@fuga-catalog/tooling/eslint/react';
export default reactConfig;
```

### In shared TypeScript packages

```javascript
// eslint.config.js
import baseConfig from '@fuga-catalog/tooling/eslint/base';
export default baseConfig;
```

### Prettier

```javascript
// prettier.config.js
import config from '@fuga-catalog/tooling/prettier';
export default config;
```

## Scripts

Add these to your package.json:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "eslint": "^9.16.0",
    "prettier": "^3.4.1"
  }
}
```

## Rules Summary

### Console Usage
- ⚠️ Warning: `console.log`, `console.debug`, `console.info`
- ✅ Allowed: `console.error`, `console.warn`
- Exception: All console methods allowed in test files

### Process.env
- ❌ Error: Using `process.env` outside allowed files
- ✅ Allowed: In `env.ts`, `test-setup.ts`, test files

### Import Order
- ⚠️ Warning: Imports not in alphabetical/grouped order
- Groups: builtin → external → internal → parent → sibling → index

### Circular Dependencies
- ⚠️ Warning: Circular import detected (max depth: 10)

### TypeScript
- ❌ Error: Unused variables (unless prefixed with `_`)
- ⚠️ Warning: Using `any` type
- ⚠️ Warning: Non-null assertions (`!`)

## Overriding Rules

If you need package-specific rules:

```javascript
// eslint.config.js
import nodeConfig from '@fuga-catalog/tooling/eslint/node';

export default [
  ...nodeConfig,
  {
    rules: {
      // Your overrides
      'no-console': 'off',
    },
  },
];
```

## Dependencies

This package includes all necessary ESLint plugins and configs. Consumer packages only need:
- `eslint` (devDependency)
- `prettier` (devDependency)

## Version Compatibility

- Node.js: >=20.9.0
- ESLint: ^9.16.0
- TypeScript: ^5.7.0
- Prettier: ^3.4.0
