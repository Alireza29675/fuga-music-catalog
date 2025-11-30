import baseConfig from './base.js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * ESLint configuration for React/Next.js applications (Web)
 * Extends base config and adds React-specific rules
 */
export default [
  ...baseConfig,

  // React configuration
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React recommended rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React best practices
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js/React 17+
      'react/jsx-uses-react': 'off',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/self-closing-comp': 'warn',
      'react/jsx-boolean-value': ['warn', 'never'],

      // Next.js specific
      'react/no-unescaped-entities': 'warn',
    },
  },

  // Test files - relaxed rules
  {
    files: ['**/*.test.tsx', '**/*.spec.tsx', '**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
];
