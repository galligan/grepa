<!-- tldr ::: Contributing guidelines for the Waymark project -->

# Contributing to Waymark

Thank you for your interest in contributing to Waymark! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm 8.x or higher

### Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/waymark.git
   cd waymark
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the project:
   ```bash
   pnpm build
   ```

4. Run tests:
   ```bash
   pnpm test
   ```

## Development Workflow

### Available Scripts

- pnpm build - Build the TypeScript code
- pnpm dev - Watch mode for development
- pnpm test - Run tests
- pnpm test:watch - Run tests in watch mode
- pnpm typecheck - Type check without building
- pnpm lint - Run ESLint
- pnpm changeset - Create a changeset for your changes

### Git Workflow

1. Create a feature branch from dev:
   ```bash
   git checkout dev
   git pull
   git checkout -b feat/your-feature
   ```

2. Make your changes following our conventions

3. Commit using conventional commits:
   ```bash
   git commit -m "feat: add new feature"
   ```

### Git Hooks

We use Husky for git hooks:

- **pre-commit**: Runs ESLint on staged TypeScript files
- **commit-msg**: Validates commit messages (conventional commits)
- **pre-push**: Runs tests and type checking

## Code Conventions

### TypeScript

We follow strict TypeScript conventions:

- Use Result<T, E> pattern for error handling
- Runtime validation with Zod schemas
- No direct throwing of errors
- See `docs/tooling/conventions/typescript.md` for details

### Waymarks

Use waymarks in your code:

```typescript
// tldr ::: [Brief description of the module]
export class MyClass {
  // note ::: [Public method documentation]
  public myMethod(): Result<string> {
    // ::: [Important context or assumptions]
    // alert ::: [Security considerations +security]
  }
}
```

### Commit Messages
Follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

## Testing

- Write tests for all new functionality
- Place tests in `src/__tests__/`
- Use Vitest for testing
- Maintain test coverage

## Pull Requests

1. Create a changeset:
   ```bash
   pnpm changeset
   ```

2. Push your branch and create a PR against `dev`

3. Ensure all checks pass:
   - Tests
   - Type checking
   - Linting

4. Provide a clear PR description

## Release Process

We use changesets for releases:

1. Contributors create changesets with their PRs
2. Maintainers merge to `main` 
3. GitHub Actions creates a version PR
4. Merging the version PR triggers npm publish

## Questions?

Feel free to:

- Open an issue for bugs or features
- Start a discussion for questions
- Check existing issues before creating new ones

Thank you for contributing! 🪧