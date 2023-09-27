module.exports = {
  env: {
    browser: true,
    mocha: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: [],
  rules: {
    "@typescript-eslint/no-explicit-any": ["off"],
    "no-var": ["error"],
  },
};
