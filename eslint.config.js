import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'
import preferArrow from 'eslint-plugin-prefer-arrow-functions'

export default defineConfig([
  globalIgnores(['node_modules', 'eslint.config.js', 'vitest.config.js']),
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    plugins: {
      'prefer-arrow-functions': preferArrow,
    },
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          allowNamedFunctions: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'no-console': 'warn',
      'require-await': 'error',
      'prefer-template': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ClassDeclaration',
          message: 'Classes are not allowed. Use plain functions and objects instead.',
        },
        {
          selector: 'ClassExpression',
          message: 'Classes are not allowed. Use plain functions and objects instead.',
        },
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use named exports instead of export default.',
        },
      ],
    },
  },
])
