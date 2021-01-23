/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    // Prettier Exclusions (should be last)
    'prettier',
    'prettier/react',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  globals: {
    JSX: 'readable',
  },
  rules: {
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        // Prettier Exclusions (should be last)
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/react',
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react', 'prettier'],
      rules: {
        'prettier/prettier': 'warn',
        'react/prop-types': 'off',
      },
    },
  ],
};
