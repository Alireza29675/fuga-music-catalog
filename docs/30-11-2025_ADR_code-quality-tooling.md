# [ADR] Code Quality and Linting Tooling

- **Author:** Alireza Sheikholmolouki
- **Date:** 30 November 2025
- **Status:** Approved (30 November 2025 by _Alireza Sheikholmolouki_)
- **References:**
  - [PRD: Music Catalog Management](./29-11-2025_PRD_music-catalog-management.md)
  - [ADR: Basic Architecture and Tech Stack](./29-11-2025_ADR_basic-architecture-and-tech-stack.md)

## Context

To maintain code consistency across the monorepo and enforce best practices, we need standardized linting and formatting configurations that can be shared across all packages.

## Decision

Introduce `@fuga-catalog/tooling` as a shared package containing centralized ESLint and Prettier configurations with custom rules specific to our architecture.

### Implementation

**Shared Package Structure:**
```
shared/tooling/
|-- eslint/
|   |-- base.js          # TypeScript, import order, circular deps
|   |-- node.js          # api specific rules
|   |-- react.js         # Next.js rules
|   |-- rules/
|       # custom rules for our codebase
|-- prettier/
|   |-- index.js         # Standard formatting config
```

**Custom Rules:**
- `no-process-env`: Enforces centralized environment variable management through `env.ts` files

## Impact on Packages

**All Packages:**
- Add `eslint`, `prettier` and `@fuga-catalog/tooling` as devDependencies
- Include `lint`, `lint:fix`, `format`, `format:check` scripts

**Node Packages:**
- Extends `@fuga-catalog/tooling/eslint/node`
- Must use `env.ts` for env variables

**Web Package:**
- Extends `@fuga-catalog/tooling/eslint/react`
- Must use `env.ts` for env variables

**Shared/Util Packages:**
- Extend `@fuga-catalog/tooling/eslint/base`

## Consequences

**Positive:**
- Consistent code style across monorepo
- Catches common errors (circular deps, misuse of env vars)
- Easy to update rules in one place
- We can later tighten the rules gradually and manage codebase quality easier

**Negative:**
- Could introduce some learning curve in the team

## Alternatives Considered

- No linting: Rejected as code quality may suffer from this and codebase can become messy and harder to maintain
- Individual package configs: Rejected due to inconsistency risk
- Stricter rules (errors vs warnings): Rejected for now (and we switch to warning) to avoid blocking development
