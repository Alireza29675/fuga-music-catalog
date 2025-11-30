/**
 * Shared Prettier configuration for all packages in the monorepo
 * Simple, opinionated formatting rules
 */
export default {
  // Line width
  printWidth: 120,

  // Use 2 spaces for indentation
  tabWidth: 2,
  useTabs: false,

  // Semicolons and quotes
  semi: true,
  singleQuote: true,

  // Trailing commas for cleaner diffs
  trailingComma: 'es5',

  // Spacing
  bracketSpacing: true,
  arrowParens: 'always',

  // Line endings (consistent across OS)
  endOfLine: 'lf',

  // JSX
  jsxSingleQuote: false,
  bracketSameLine: false,

  // Other
  proseWrap: 'preserve',
};
