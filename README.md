<!-- tldr ::: Universal pattern for making codebases AI-navigable and greppable -->
# 🪧 Waymarks ::: Blazing fast code navigation for agents

> [!IMPORTANT]
> **🚧 Work in Progress** - This is an early proof of concept exploring how to make codebases more navigable for AI agents. I'm actively seeking feedback, suggestions, and use cases. Join the discussion in [Issues](https://github.com/outfitter-dev/waymark/issues) or share your thoughts!

> [!TIP]
> **A simple pattern for code navigation.** Waymarks (`:::`) provide a consistent way to mark important spots in code that both AI agents and humans can easily find with grep.

## 📚 Documentation

- **[Quick Start](docs/guides/quick-start.md)** - Get started in 5 minutes
- **[Examples](docs/examples.md)** - Real-world patterns and workflows  
- **[Conventions](docs/conventions.md)** - Common tags and best practices
- **[Syntax Reference](docs/syntax.md)** - Complete waymark syntax
- **[Documentation Hub](docs/)** - All documentation resources

## 🤔 The Problem

AI coding agents and developers face the same challenge: **How do you quickly navigate to the right spot in a codebase?**

Even in well-structured repos, critical information is scattered across:

- Ad-hoc TODOs with inconsistent formatting
- Security concerns buried in comment threads  
- Temporary hacks that overstay their welcome
- Context and assumptions that only exist in developers' heads

Current approaches fail because they're:

- **Unpredictable**: Every project uses different conventions
- **Invisible to AI**: Agents can't reliably pattern-match free-form comments
- **Hard to search**: `grep TODO` returns hundreds of results with no structure

> **grep** is a command-line utility for searching plain-text data sets for lines that match a regular expression. Its name comes from the ed command g/re/p (globally search a regular expression and print). [Learn more on Wikipedia](https://en.wikipedia.org/wiki/Grep).

## 💡 Proposed Solution: Waymarks (`:::`)

A **waymark** is a small, consistent marker that helps make comments more discoverable:

```javascript
// todo ::: add input validation
function processPayment(amount) {
    // alert ::: verify amount is positive +security
    chargeCard(amount);
}
```

Search examples:

```bash
rg ":::"          # List all waymarks
rg "alert :::"    # Jump to alerts
rg "todo :::"     # Find all tasks
```

### Why `:::`?

The `:::` sigil is the canonical marker for waymarks. Like how "TODO" became a universal convention, using a single standard sigil:

- **Visual clarity** - The `:::` clearly separates prefix from content
- **Avoids conflicts** - Unlikely to appear in regular code or prose
- **Universal understanding** - Any developer or AI can recognize `:::`
- **Fast to type** - Three colons in quick succession

**For monorepos:** Use hashtags to distinguish services:

```javascript
// todo ::: implement OAuth #auth-service
// fix ::: responsive layout #web-app #frontend
```

## 📦 Installation

### As a Global CLI Tool

```bash
npm install -g waymark
# or
pnpm add -g waymark
```

### As a Dev Dependency

```bash
npm install --save-dev waymark
# or
pnpm add -D waymark
```

### CLI Usage

```bash
# Parse files for waymarks
waymark parse src/**/*.ts

# Search for specific contexts
waymark search todo src/
waymark search security --context 2

# List all anchors in files
waymark list src/ --json

# Show only unique contexts
waymark list src/ --contexts
```

## 🚀 Quick Start

### 1. Start Simple

- `todo :::` - Mark work that needs doing
  ```python
  # todo ::: implement retry logic
  def api_call():
      response = requests.get(url)
      return response
  ```

### 2. Add AI Instructions

- `@mentions` - Direct AI agents to specific tasks
  ```javascript
  // todo ::: @agent write unit tests for edge cases
  function divide(a, b) {
      return a / b;  // fix ::: handle division by zero
  }
  ```

### 3. Mark Important Context

- Pure notes - Document important assumptions
  ```go
  // ::: user_ids are always UUIDs, never integers
  func GetUser(userID string) (*User, error) {
      // alert ::: validate UUID format to prevent injection +security
      return db.FindUser(userID)
  }
  ```

### 4. Use Properties and Tags

- Add structured data and classification
  ```typescript
  // todo ::: priority:high fix rate limiting +performance
  // temp ::: remove after Redis upgrade
  ```

## 🎯 Core Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| `tldr :::` | Brief summary/overview | `// tldr ::: handles user authentication` |
| `todo :::` | Work to be done | `// todo ::: add error handling` |
| `:::` | Important context (pure note) | `// ::: expects UTC timestamps` |
| `@mentions` | AI agent tasks | `// todo ::: @agent implement this function` |
| `alert :::` | Security/safety concerns | `// alert ::: validate all inputs +security` |
| `temp :::` | Temporary code | `// temp ::: remove after v2.0` |

## 📈 Getting Started

Start simple and add complexity as needed:

```javascript
// Basic waymarks
// todo ::: implement caching
// alert ::: sanitize user input +security

// Add properties and hashtags when helpful
// todo ::: fixes:#42 fix memory leak
// todo ::: @alice payment integration #backend
```

## 🤖 Example AI Agent Workflow

### 1. Human marks the spot:

```python
class UserService:
    # ::: all users must have unique emails
    def create_user(self, email: str, name: str):
        # todo ::: @agent implement with proper validation
        # alert ::: prevent duplicate emails +security
        # todo ::: add rate limiting +performance
        pass
```

### 2. AI agent finds the work:

```bash
$ rg "todo ::: .*@agent"
user_service.py:4: # todo ::: @agent implement with proper validation
```

### 3. AI reads the context:

```bash
$ rg ":::" user_service.py
user_service.py:2: # ::: all users must have unique emails
user_service.py:5: # alert ::: prevent duplicate emails +security
```

### 4. AI implements with full understanding:

```python
def create_user(self, email: str, name: str):
    # Validate email format
    if not self._is_valid_email(email):
        raise ValueError("Invalid email format")
    
    # ::: enforcing unique email constraint
    if self.user_repo.exists_by_email(email):
        raise DuplicateEmailError(f"Email {email} already exists")
    
    # Create user with validated data
    return self.user_repo.create(email=email, name=name)
```

## ✨ Potential Benefits

### For AI Agents

- **Reliable navigation**: Consistent pattern that's less likely to match prose
- **Contextual understanding**: Find assumptions and constraints
- **Clear task delegation**: Helps identify what needs doing

### For Developers

- **One command**: `rg ":::"` shows all important contexts
- **Flexible vocabulary**: Use patterns that make sense for your team
- **Progressive adoption**: Start simple, add richness over time

### For Teams

- **Shared language**: Consistent patterns across the codebase
- **Tool-friendly**: Works with grep, ripgrep, ag, and any search tool
- **Adaptable**: Can evolve with changing needs

## 🔧 Common Patterns

**Core prefixes:**
- `todo :::` - Work to be done
- `fix :::` - Bugs to fix  
- `alert :::` - Warnings and cautions
- `temp :::` - Temporary code
- `tldr :::` - Brief summaries
- `:::` - Pure notes (no prefix)

**With properties and hashtags:**
- `todo ::: fixes:#123 implement auth` - Link to issue
- `todo ::: @alice payment flow` - Assign ownership
- `todo ::: priority:high fix memory leak #critical` - Set priority

See [Conventions](docs/conventions.md) for complete patterns.

## 🚪 Escape Hatch

If you need to remove all waymarks:

```bash
# Find all files with waymarks
rg -l ":::" 

# Preview what would be removed
rg ".*:::.*$" 

# Remove all waymarks (backup first!)
find . -type f -exec sed -i.bak 's/.*:::[^*]*//g' {} +
```

## 📋 Quick Reference

```bash
# Find everything
rg ":::"

# Find by prefix
rg "todo :::"
rg "alert :::"
rg "fix :::"

# Find with context (lines before/after)
rg -B1 -A1 "alert :::"  # 1 line before and after
rg -C2 "todo :::"      # 2 lines context

# Find by hashtag
rg "#security"
rg "#frontend"

# Find @mentions
rg ":::.*@\w+"

# Find in specific files
rg ":::" --type js
rg ":::" src/

# Extract prefixes
rg -o "(\w+) :::" -r '$1' | sort | uniq -c
```

## 🎬 Getting Started

1. **Try it now**: Add `// todo ::: implement feature` to your code
2. **Search for it**: Run `rg ":::"` or `waymark search todo`
3. **Tell your AI**: "Look for ::: waymarks to understand the codebase"
4. **Evolve naturally**: Add prefixes, properties, and hashtags as needed

**The goal is discoverability.** Start simple and let your patterns evolve with your needs.

## 🛠️ Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

### Quick Setup

```bash
git clone https://github.com/outfitter-dev/waymark.git
cd waymark
pnpm install
pnpm build
pnpm test
```

## 📖 Docs

### Core Documentation

- [Quick Start Guide](docs/guides/quick-start.md) - Get started with waymarks in 5 minutes
- [Examples](docs/examples.md) - Real-world waymark usage patterns
- [Syntax Reference](docs/syntax.md) - Complete waymark syntax
- [Conventions](docs/conventions.md) - Common patterns and best practices
- [Waymarks in Documentation](docs/waymarks-in-documentation.md) - Integration with JSDoc, docstrings, etc.
- [Documentation Hub](docs/) - All documentation resources

### Tooling & Reference

- [CLI Reference](docs/tooling/CLI.md) - Command-line interface
- [API Reference](docs/tooling/API.md) - Waymark parser and search APIs
- [Prior Art](docs/about/priors.md) - Related concepts and inspiration

---

## 🌟 Inspiration: Lessons from OpenAI Codex

The idea for waymarks comes directly from the Codex team's "Missing Manual" interview on Latent Space (May 17, 2025). The engineers emphasized that AI agents need to jump around repos with a single, collision-free token:

> *"Make your codebase discoverable — a well-named and organised tree lets Codex navigate the filesystem as quickly as a brand-new engineer might."*

They also advised capturing agent-specific conventions in a canonical doc so models "grow as model intelligence grows" — echoing our proposal for a root-level `waymark.yml` dictionary.

That mindset — pick a unique string, grep it everywhere, document the contract — is exactly what `:::` formalizes. Think of waymarks as the portable follow-up to Codex's internal practice, distilled into a three-character sigil any OSS project or LLM can rely on.

### Sources

- **Blog & transcript**: [latent.space/p/codex](https://www.latent.space/p/codex)
- **Video**: [youtube.com/watch?v=LIHP4BqwSw0](https://www.youtube.com/watch?v=LIHP4BqwSw0)
