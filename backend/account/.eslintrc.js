module.exports = {
  env: {
    es2022: true,
    node: true,
  },
  extends: '@rocketseat/eslint-config/node',
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-useless-constructor': 'off',
    'no-use-before-define': 'off',
  },
}
