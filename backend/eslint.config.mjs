// eslint.config.mjs
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default tseslint.config(
  // Ignore build + deps
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // JS recommended rules
  eslint.configs.recommended,

  // TypeScript strict (mais stable pour Nest)
  ...tseslint.configs.strictTypeChecked,

  // Prettier plugin
  eslintPluginPrettier,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
    },
  },

  {
    rules: {
      // ***************
      // CLEAN CODE RULES
      // ***************
  '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // ******************************
      // PRACTICAL RULES FOR NEST + ORM
      // ******************************
      // TypeORM + Decorators rendent ces règles impossibles à respecter
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',

  // Template literals should allow numbers (handy in logs and IDs)
  '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

      // Utile et pas relou
      '@typescript-eslint/no-floating-promises': 'error',

      // ***************
      // PRETTIER CONFIG
      // ***************
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          trailingComma: 'all',
        },
      ],
    },
  },

  // Overrides for Nest constructs that are intentionally empty classes
  {
    files: ['**/*.module.ts', '**/dto/**/*.ts', '**/dto/*.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
);
