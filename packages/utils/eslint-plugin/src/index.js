// ::: tldr Custom ESLint rules plugin
module.exports = {
  meta: {
    name: '@waymark/eslint-plugin',
    version: '0.0.0'
  },
  rules: {
    'enforce-result-pattern': require('./enforce-result-pattern'),
  },
};