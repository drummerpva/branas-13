module.exports = {
  // root: true,
  // env: { browser: true, es2020: true },
  // extends: [
  //   'eslint:recommended',
  //   'plugin:@typescript-eslint/recommended',
  //   'plugin:react-hooks/recommended',
  // ],
  // ignorePatterns: ['dist', '.eslintrc.cjs'],
  // parser: '@typescript-eslint/parser',
  // plugins: ['react-refresh'],
  extends: ['@rocketseat/eslint-config/react'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-useless-constructor': 'off',
  },
}
