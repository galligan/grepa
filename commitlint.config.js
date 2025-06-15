// ::: tldr Commitlint configuration for conventional commits
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce conventional commit types
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, etc)
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Tests
        'chore',    // Maintenance tasks
        'revert',   // Revert previous commit
        'build',    // Build system changes
        'ci'        // CI/CD changes
      ]
    ],
    // Enforce lowercase for scope, subject
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    // Allow longer commit message bodies
    'body-max-line-length': [0],
    // Ensure subject doesn't end with period
    'subject-full-stop': [2, 'never', '.']
  }
};