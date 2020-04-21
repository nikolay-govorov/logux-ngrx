module.exports = {
  extends: "@logux/eslint-config",
  overrides: [
    {
      env: {
        jest: true
      },
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint', '@angular-eslint'],

      rules: {
        'no-unused-vars': 'off' // Don't work with TS
      },
    },
    {
      files: ['*.component.html'],
      parser: '@angular-eslint/template-parser',
      plugins: ['@angular-eslint/template'],
      rules: {
        '@angular-eslint/template/banana-in-a-box': 'error',
        '@angular-eslint/template/no-negated-async': 'error',
      },
    },
    {
      files: ['*.component.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      plugins: ['@angular-eslint/template'],
      processor: '@angular-eslint/template/extract-inline-html',
      rules: {
        'no-unused-vars': 'off', // Don't work with TS
      }
    },
  ]
};
