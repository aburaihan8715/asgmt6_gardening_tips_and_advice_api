import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: { globals: globals.browser },
    ignores: ['**/node_modules/', '.dist/'],

    rules: {
      'no-unused-vars': 'error', // Default rule for regular JS
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-undef': 'error',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'], // Specific to TypeScript files
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: 'err|error', // Only warn for unused err/error variables
          argsIgnorePattern: '^_', // (Optional) ignore args starting with _
        },
      ],
    },
  },
];
