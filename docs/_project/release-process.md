<!-- ::: tldr: Automated release process using changesets and GitHub Actions -->

# Release Process

This document describes the automated release process for the Waymark project using [Changesets](https://github.com/changesets/changesets) and GitHub Actions.

## Overview

The release process is fully automated and follows these principles:

1. **CI First**: All PRs must pass CI checks before merging
2. **Changesets**: Version bumps and changelogs are managed by changesets
3. **Automated Releases**: Releases happen automatically when changesets are merged
4. **No Duplicate Work**: The workflow checks for existing changes before creating new PRs

## How It Works

### 1. Development Workflow

When making changes:

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm changeset` to create a changeset file describing your changes
4. Commit both your code and the changeset file
5. Open a PR to `main`

### 2. CI Process

The CI workflow (`.github/workflows/ci.yml`) runs on every PR and ensures:

- Tests pass (`pnpm test`)
- TypeScript compiles (`pnpm typecheck`)
- Linting passes (`pnpm lint`)
- Build succeeds (`pnpm build`)
- No temporary code waymarks exist (`pnpm check:waymarks`)

### 3. Release Process

Once a PR with changesets is merged to `main`:

1. The release workflow (`.github/workflows/release.yml`) triggers automatically
2. It checks if there are differences between `main` and `changeset-release/main`
3. If changes exist, it either:
   - **Creates a Version PR**: If there are unpublished changesets, it creates a PR that:
     - Bumps package versions according to the changesets
     - Updates CHANGELOG files
     - Removes consumed changeset files
   - **Publishes Packages**: If the Version PR is merged, it publishes to npm

### 4. Smart Change Detection

The release workflow includes a smart check that prevents duplicate work:

```yaml
- name: Check for changes between main and changeset-release/main
  id: check_changes
  run: |
    # Fetch the changeset-release/main branch if it exists
    git fetch origin changeset-release/main:refs/remotes/origin/changeset-release/main || echo "changeset-release/main doesn't exist yet"
    # Check if there are any differences
    if git rev-parse --verify origin/changeset-release/main >/dev/null 2>&1; then
      # Branch exists, check for differences
      if git diff --quiet HEAD origin/changeset-release/main; then
        echo "has_changes=false" >> $GITHUB_OUTPUT
        echo "No changes detected between main and changeset-release/main"
      else
        echo "has_changes=true" >> $GITHUB_OUTPUT
        echo "Changes detected between main and changeset-release/main"
      fi
    else
      # If changeset-release/main doesn't exist, we have changes
      echo "has_changes=true" >> $GITHUB_OUTPUT
      echo "changeset-release/main branch doesn't exist, proceeding with release"
    fi
```

This prevents the changeset action from running when there are no actual changes to release.

## Creating Changesets

### Using the CLI

Run `pnpm changeset` and follow the prompts:

1. Select which packages have changed
2. Choose the version bump type (patch/minor/major)
3. Write a summary of the changes

### Changeset File Format

Changesets are stored in `.changeset/` as markdown files:

```markdown
---
"@waymark/cli": minor
"@waymark/core": patch
---

Added new search functionality to the CLI and fixed parser edge cases
```

## Version PR Process

When changesets are detected on `main`, the workflow creates a PR titled "chore: version packages" that:

1. Updates version numbers in `package.json` files
2. Updates `CHANGELOG.md` files with entries from changesets
3. Deletes the consumed changeset files

This PR can be reviewed and merged like any other PR. Once merged, the packages are automatically published.

## Required Secrets

The release workflow requires these GitHub secrets:

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `NPM_TOKEN`: npm automation token for publishing packages

## Manual Release (Emergency Only)

If automated releases fail, you can manually release:

```bash
# Ensure you're on main with latest changes
git checkout main
git pull

# Create versions
pnpm changeset version

# Commit version changes
git add .
git commit -m "chore: version packages"

# Build packages
pnpm build

# Publish to npm
pnpm changeset publish

# Push tags
git push --follow-tags
```

## Troubleshooting

### Release PR Not Created

If the release PR isn't created after merging changesets:

1. Check the Actions tab for workflow failures
2. Ensure changesets were included in the merge
3. Verify the `changeset-release/main` branch state

### Publish Fails

If publishing fails after merging the version PR:

1. Check npm token validity
2. Ensure all packages build successfully
3. Verify npm registry access

### Duplicate Release PRs

The workflow now prevents duplicate PRs by checking for changes. If you see duplicates:

1. Close the older PR
2. Ensure only one release workflow is running
3. Check for branch protection rule conflicts

## Best Practices

1. **Write Clear Changesets**: Changesets become CHANGELOG entries
2. **Use Semantic Versioning**: Choose appropriate version bumps
3. **Review Version PRs**: Check version bumps before merging
4. **Monitor Releases**: Watch the Actions tab during releases
5. **Keep Dependencies Updated**: Regular dependency updates prevent conflicts

## Related Documentation

- [Changesets Documentation](https://github.com/changesets/changesets)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules)