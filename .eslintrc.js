/* @flow */
module.exports = {
  'env': {
    'browser': true,
    'mocha': true,
    'node': true,
    'es6': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'plugins': [],
  'rules': {
    '@typescript-eslint/no-explicit-any': ['off'],

    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single', 'avoid-escape'],
    'semi': ['error', 'always'],
    'no-var': ['error'],
    'brace-style': ['error'],
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'no-spaced-func': ['error'],
    'no-whitespace-before-property': ['error'],
    'space-before-blocks': ['error', 'always'],
    'keyword-spacing': ['error']
  }
};
