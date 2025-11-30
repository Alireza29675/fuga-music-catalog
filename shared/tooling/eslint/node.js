import globals from 'globals';
import baseConfig from './base.js';
import noProcessEnvRule from './rules/no-process-env.js';

/**
 * ESLint configuration for Node.js/Express applications (API)
 * Extends base config and adds Node-specific rules including custom no-process-env
 */
export default [
  ...baseConfig,

  // Node.js specific configuration
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      'custom-rules': {
        rules: {
          'no-process-env': noProcessEnvRule,
        },
      },
    },
    rules: {
      // Custom rule: no process.env except in allowed files
      'custom-rules/no-process-env': 'error',

      // Node.js best practices
      'no-process-exit': 'warn',
      'no-path-concat': 'error',

      // Allow require in certain contexts
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Test files - relaxed rules
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/test-setup.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
];
