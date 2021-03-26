module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2019
  },
  env: {
    node: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "prettier"
  ],
  plugins: ["prettier", "node"],
  rules: {
    "prettier/prettier": "error"
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true
      }
    }
  ]
};
