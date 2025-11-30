/**
 * Custom ESLint rule to restrict process.env usage to specific files
 * Allows process.env only in:
 * - env.ts
 * - test-setup.ts
 * - *.test.ts
 * - *.spec.ts
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow process.env except in configuration and test files',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noProcessEnv:
        'Direct process.env access is not allowed. Import from env.ts instead.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    const allowedPatterns = [
      /env\.ts$/,
      /test-setup\.ts$/,
      /\.test\.ts$/,
      /\.spec\.ts$/,
      /\.test\.tsx$/,
      /\.spec\.tsx$/,
    ];

    // Check if current file is allowed to use process.env
    const isAllowed = allowedPatterns.some((pattern) => pattern.test(filename));

    if (isAllowed) {
      return {};
    }

    return {
      MemberExpression(node) {
        // Check for process.env access
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'process' &&
          node.property.type === 'Identifier' &&
          node.property.name === 'env'
        ) {
          context.report({
            node,
            messageId: 'noProcessEnv',
          });
        }
      },
    };
  },
};
