<!-- :M: tldr Emoji equivalents for waymark contexts (future feature) -->
<!-- :M: idea Visual scanning enhancement, not required for v0.1 -->
<!-- :M: revisit Consider after v0.5.0 based on user feedback -->

# Waymark Emoji Syntax

This document specifies the optional emoji equivalents for waymark contexts. This feature is planned for future releases to enhance visual scanning and accessibility, but is not part of the initial v0.1 release.

## Rationale

Emoji equivalents serve several purposes:
1. **Visual Scanning**: Quickly identify waymark types in code
2. **Accessibility**: Alternative visual representation for color-blind users
3. **International**: Emoji transcend language barriers
4. **Editor Support**: Some editors highlight emoji differently than text
5. **Personal Preference**: Some developers prefer visual markers

## Usage Philosophy

When implemented, emoji usage will follow these principles:
- **Optional**: Always optional, never required
- **Equivalent**: Emoji are aliases, not replacements
- **Consistent**: One emoji per context, no variations
- **Configurable**: Can be enabled/disabled per project or globally
- **Searchable**: Both text and emoji forms will be found by search

## Implementation Notes

When this feature is implemented:
- The waymark CLI will support the `--emoji` flag for output
- Formatters can optionally align emoji waymarks
- Search will treat emoji and text contexts as equivalent
- Configuration will allow custom emoji mappings

## Context-to-Emoji Mapping

### Work

- `todo` / `📝` - work to be done
- `fix` / `🐛` - bugs to fix (synonym: `fixme`)
- `done` / `✅` - completed work
- `ask` / `❓` - questions needing answers
- `review` / `🔍` - needs review
- `needs` / `🔗` - dependencies (synonyms: `depends on`, `requires`)
- `chore` / `🧹` - routine maintenance tasks (e.g., lint fixes, dependency bumps)
- `hotfix` / `🚑️` - urgent production patch (synonym: `patch`)
- `spike` / `🧬` - exploratory proof-of-concept work

### Lifecycle/Maturity

- `stub` / `🌱` - skeleton/basic implementation
- `draft` / `🪴` - work in progress (synonym: `wip`)
- `stable` / `🌳` - mature/solid code
- `shipped` / `🚢` - deployed to production
- `good` / `👍` - approved (synonyms: `lgtm`, `approved`, `thumbsup`)
- `bad` / `👎` - not approved (synonyms: `nope`, `thumbsdown`)
- `hold` / `⏸️` - work intentionally paused or blocked (synonym: `paused`)
- `stale` / `🥀` - work that has stagnated or is out-of-date
- `cleanup` / `🧼` - code cleanup or dead-code removal
- `remove` / `🗑️` - scheduled deletion (synonym: `delete`)

### Alerts/Warnings

- `warn` / `🟠` - warning
- `crit` / `🔴` - critical issue (synonym: `critical`)
- `unsafe` / `❌` - dangerous code
- `caution` / `🚧` - proceed carefully (synonym: `careful`)
- `broken` / `💥` - non-functional code
- `locked` / `🔒` - do not modify (synonym: `freeze`)
- `deprecated` / `💀` - scheduled for removal
- `audit` / `🕵️` - requires audit or compliance review
- `legal` / `⚖️` - legal or licensing obligations
- `temp` / `🍂` - temporary code (synonym: `temporary`)
- `revisit` / `🔄` - flag for future reconsideration (synonym: `review-later`)

### Information

- `tldr` / `🪧` - brief summary: one per file at top (synonym: `aboutme`, `about`)
- `summary` / `📖` - code section summary (synonym: `description`)
- `note` / `✏️` - general note (synonym: `info`)
- `thought` / `💭` - thinking out loud
- `docs` / `📚` - documentation reference
- `why` / `🤔` - explains reasoning
- `see` / `👀` - cross-reference (synonyms: `ref`, `xref`)
- `example` / `👉` - usage example

### Meta

- `important` / `⭐` - important information
- `hack` / `🏴‍☠️` - hacky solution
- `flag` / `🚩` - generic marker
- `pin` / `📍` - pinned item
- `idea` / `💡` - future possibility
- `test` / `🧪` - test-specific marker

## Example Usage

When enabled, emoji can be used as context equivalents:

```javascript
// Text form
// :M: todo implement validation
// :M: sec check user permissions
// :M: tmp remove after v2.0

// Emoji form (future)
// :M: 📝 implement validation
// :M: 🔒 check user permissions  
// :M: 🍂 remove after v2.0

// Mixed usage (supported when implemented)
// :M: todo implement validation
// :M: 🔒 check user permissions
```

## Formatting with Emoji

Formatters will be able to align emoji waymarks for visual consistency:

```javascript
// Unaligned
// :M: 📝 implement caching
// :M: 🐛 memory leak
// :M: 🪧 handles authentication

// Aligned by formatter
// :M: 📝  implement caching
// :M: 🐛  memory leak  
// :M: 🪧  handles authentication
// :M: 🔒  do not modify until v3.0
```

## Configuration

When implemented, emoji support will be configurable:

```json
{
  "waymark": {
    "emoji": {
      "enabled": true,
      "outputFormat": "emoji",  // "text", "emoji", or "both"
      "customMappings": {
        "todo": "📝",
        "urgent": "🚨"  // Custom contexts can have emoji too
      }
    }
  }
}
```

## Search Behavior

The waymark CLI will treat text and emoji forms as equivalent:

```bash
# These will find the same waymarks
waymark list --context todo
waymark list --context 📝

# Ripgrep patterns will need to account for both
rg ":M: (todo|📝)"
```

## Editor Integration

Editors can provide:
- Emoji picker for waymark contexts
- Toggle between text/emoji display
- Syntax highlighting for emoji waymarks
- Autocomplete for both forms

## Accessibility Considerations

- Screen readers will announce emoji names
- Emoji provide visual differentiation beyond color
- Text form always available as a fallback
- High contrast themes work well with emoji

## Migration Path

When this feature is released:
1. Emoji support will be opt-in
2. Existing text waymarks remain valid
3. Projects can gradually adopt emoji
4. Tools will support both forms transparently

## Future Considerations

- Custom emoji mappings per project
- Emoji-only mode for compact display
- Unicode symbol alternatives for terminals without emoji
- AI agents trained on both text and emoji forms