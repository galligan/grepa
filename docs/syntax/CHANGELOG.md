# Waymark Syntax Changelog

All notable changes to the waymark syntax specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-14

### Added

- Star (`*`) signal for branch-scoped work tracking
- Complete signal system with position and intensity signals
- Formalized blessed property keys
- TLDR as the most critical marker pattern
- Actor-first syntax with `@mentions`
- Comprehensive search patterns and ripgrep integration

### Changed

- **BREAKING**: Changed canonical sigil from `:::` to `:::`
- **BREAKING**: Renamed "prefix" to "marker" throughout
- Clarified signal ordering (position signals before intensity)
- Updated grammar to separate position and intensity signals

### Finalized

- v1.0 syntax as stable specification
- 41 markers across 8 semantic categories
- Signal system with `*`, `!`, `!!`, `?`, `??`, `-`, `--`, `_`
- Blessed property keys for structured metadata

## [0.1.0] - 2025-01-30

### Added

- Initial waymark syntax specification
- Core `:::` identifier with mandatory single space (later changed to `:::`)
- Three delimiter types with semantic purposes:
  - Colon (`:`) for classifications
  - Parentheses `()` for parameters
  - Brackets `[]` for arrays
- Support for bare tokens, parameterized markers, and arrays
- Context organization into semantic groups
- Comprehensive examples and patterns

### Established

- No complex object syntax within waymarks
- No regex/pattern matching as core feature
- Focus on grep-ability and LLM navigation
- One waymark per line recommendation