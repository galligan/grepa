# 🍇 Grepa (grep-anchor) - Code Navigation for AI Agents and Humans
<!-- :ga:tldr Universal pattern for making codebases AI-navigable and greppable -->
<!-- :ga:core Main project documentation and overview -->

> [!IMPORTANT]
> **🚧 Work in Progress** - This is an early proof of concept exploring how to make codebases more navigable for AI agents. I'm actively seeking feedback, suggestions, and use cases. Join the discussion in [Issues](https://github.com/galligan/grepa/issues) or share your thoughts!

> [!TIP]
> **A simple pattern for code navigation.** Grepa (`:ga:`) suggests a consistent way to mark important spots in code that both AI agents and humans can easily find with grep.

## 📚 Documentation

- **[Quick Start](docs/guides/quick-start.md)** - Get started in 5 minutes
- **[Examples](docs/examples.md)** - Real-world patterns and workflows  
- **[Conventions](docs/conventions/)** - Common tags and best practices
- **[Progressive Guide](docs/guides/progressive-enhancement.md)** - Adopt at your own pace
- **[AI Patterns](docs/conventions/ai-patterns.md)** - Working with AI agents

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

## 💡 Proposed Solution: grep-anchor (`:ga:`)

A **grep-anchor** is a small, consistent marker that helps make comments more discoverable:

```javascript
// :ga:todo add input validation
function processPayment(amount) {
    // :ga:sec verify amount is positive
    chargeCard(amount);
}
```

Search examples:
```bash
rg ":ga:"          # List all anchors
rg ":ga:sec"  # Jump to security concerns
rg ":ga:todo"      # Find all tasks
```

### Custom Anchors

While `:ga:` is the recommended default, teams can choose their own anchor pattern:

```javascript
// :proj: for your project
// :team: for your team  
// :myco: for your company
```

**Some suggestions:**
- **One anchor per project** - Consider keeping the same anchor pattern throughout a codebase
- **Monorepo?** You might use tags instead of different anchors: `:ga:auth-service`, `:ga:web-app`
- **Document your choice** - If not using `:ga:`, it helps to note it in your README

## 🚀 Quick Start

### 1. Start Simple
- `:ga:todo` - Mark work that needs doing
  ```python
  # :ga:todo implement retry logic
  def api_call():
      response = requests.get(url)
      return response
  ```

### 2. Add AI Instructions
- `:ga:@agent` - Direct AI agents to specific tasks
  ```javascript
  // :ga:@agent write unit tests for edge cases
  function divide(a, b) {
      return a / b;  // :ga:todo handle division by zero
  }
  ```

### 3. Mark Important Context
- `:ga:ctx` - Document important assumptions
  ```go
  // :ga:ctx user_ids are always UUIDs, never integers
  func GetUser(userID string) (*User, error) {
      // :ga:sec validate UUID format to prevent injection
      return db.FindUser(userID)
  }
  ```

### 4. Combine as Needed
- Stack multiple tags for richer meaning
  ```typescript
  // :ga:sec,todo fix rate limiting
  // :ga:tmp,ctx remove after Redis upgrade
  ```

## 🎯 Core Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| `:ga:tldr` | Brief summary/overview | `// :ga:tldr handles user authentication` |
| `:ga:todo` | Work to be done | `// :ga:todo add error handling` |
| `:ga:ctx` | Important context | `// :ga:ctx expects UTC timestamps` |
| `:ga:@agent` | AI agent tasks | `// :ga:@agent implement this function` |
| `:ga:sec` | Security concerns | `// :ga:sec validate all inputs` |
| `:ga:tmp` | Temporary code | `// :ga:tmp remove after v2.0` |

## 📈 Progressive Enhancement

### Level 1: Basic TODO Migration
Start by enhancing your existing TODOs:
```javascript
// TODO :ga: implement caching
// FIXME :ga:sec sanitize user input
```

### Level 2: Structured Tasks
Or use standalone markers:
```javascript
// :ga:todo implement caching
// :ga:task:auth add OAuth support
// :ga:issue(42) fix memory leak
```

### Level 3: Rich Context
Add metadata when needed:
```javascript
// :ga:epic(user-onboarding) new user flow
// :ga:deadline(2024-03-01) compliance update
// :ga:owner(@alice) payment integration
```

## 🤖 Example AI Agent Workflow

### 1. Human marks the spot:
```python
class UserService:
    # :ga:ctx all users must have unique emails
    def create_user(self, email: str, name: str):
        # :ga:@agent implement with proper validation
        # :ga:sec prevent duplicate emails
        # :ga:todo add rate limiting
        pass
```

### 2. AI agent finds the work:
```bash
$ rg ":ga:@agent"
user_service.py:4: # :ga:@agent implement with proper validation
```

### 3. AI reads the context:
```bash
$ rg ":ga:ctx|:ga:sec" user_service.py
user_service.py:2: # :ga:ctx all users must have unique emails
user_service.py:5: # :ga:sec prevent duplicate emails
```

### 4. AI implements with full understanding:
```python
def create_user(self, email: str, name: str):
    # Validate email format
    if not self._is_valid_email(email):
        raise ValueError("Invalid email format")
    
    # :ga:ctx enforcing unique email constraint
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
- **One command**: `rg ":ga:"` shows all important markers
- **Flexible vocabulary**: Use patterns that make sense for your team
- **Progressive adoption**: Start simple, add richness over time

### For Teams
- **Shared language**: Consistent patterns across the codebase
- **Tool-friendly**: Works with grep, ripgrep, ag, and any search tool
- **Adaptable**: Can evolve with changing needs

## 🔧 Common Patterns

### Security & Quality
- `:ga:sec` - Security-critical code
- `:ga:audit` - Needs review
- `:ga:perf` - Performance concerns
- `:ga:bug` - Known issues

### Project Management
- `:ga:todo` - General tasks
- `:ga:task:` - Specific work items
- `:ga:issue(123)` - Link to issue tracker
- `:ga:epic(auth)` - Feature grouping

### Priority Examples (define your own!)
- `:ga:p0` - Critical priority
- `:ga:urgent` - Needs immediate attention
- `:ga:next-sprint` - Upcoming work
- `:ga:someday` - Future considerations

### AI-Specific
- `:ga:@agent` - Any AI can help
- `:ga:@cursor` - Cursor-specific
- `:ga:prompt` - AI instructions
- `:ga:review` - AI should review

## 🚪 Escape Hatch

If you need to remove all grepa markers:

```bash
# Find all files with :ga: markers
rg -l ":ga:" 

# Preview what would be removed
rg ":ga:.*$" 

# Remove all :ga: markers (backup first!)
find . -type f -exec sed -i.bak 's/:ga:[^*]*//g' {} +
```

## 📋 Quick Reference

```bash
# Find everything
rg ":ga:"

# Find by type
rg ":ga:todo"
rg ":ga:sec"
rg ":ga:@agent"

# Find with context (lines before/after)
rg -B1 -A1 ":ga:sec"  # 1 line before and after
rg -C2 ":ga:todo"          # 2 lines context

# Find related tags nearby
rg -B2 -A2 ":ga:sec" | rg ":ga:(sec|todo)"

# Find combinations
rg ":ga:sec.*todo|:ga:todo.*sec"

# Find in specific files
rg ":ga:" --type js
rg ":ga:" src/

# Count by type
rg ":ga:(\w+)" -o | sort | uniq -c
```

## 🎬 Getting Started

1. **Try it now**: Add `// :ga:todo` to something in your code
2. **Search for it**: Run `rg ":ga:"` 
3. **Tell your AI**: "Look for :ga: markers to understand the codebase"
4. **Evolve naturally**: Add patterns as you need them

**The goal is discoverability.** Start simple and let your patterns evolve with your needs.

## 📖 Docs

### Core Documentation
- [Quick Start Guide](docs/guides/quick-start.md) - Get started with grep-anchors in 5 minutes
- [Examples](docs/examples.md) - Real-world grep-anchor usage patterns
- [Progressive Enhancement](docs/guides/progressive-enhancement.md) - Three levels of adoption

### Notation & Conventions
- [Notation Overview](docs/notation/README.md) - Technical format specification
- [Format Specification](docs/notation/format.md) - Detailed syntax rules
- [Payload Rules](docs/notation/payloads.md) - How to structure tag payloads
- [Examples](docs/notation/examples.md) - Notation examples across languages

### Conventions & Patterns
- [Conventions Overview](docs/conventions/README.md) - Usage patterns and best practices
- [Common Patterns](docs/conventions/common-patterns.md) - Essential tags like `tldr`, `sec`, `tmp`
- [AI Patterns](docs/conventions/ai-patterns.md) - Working with AI agents using `@cursor` and `@claude`
- [Workflow Patterns](docs/conventions/workflow-patterns.md) - Task tracking and workflows
- [Domain-Specific](docs/conventions/domain-specific.md) - Specialized patterns for frameworks
- [Combinations](docs/conventions/combinations.md) - Using multiple tags effectively

### Advanced Topics
- [Custom Anchors](docs/guides/custom-anchors.md) - Creating your own sigils
- [Advanced Patterns](docs/advanced-patterns.md) - Complex usage scenarios
- [What Ifs](docs/what-ifs.md) - Vision for AI-native development

### Project Information
- [Prior Art](docs/about/priors.md) - Related concepts and inspiration
- [V0 Specification](docs/project/specs/v0.md) - Initial specification
- [V1 Specification](docs/project/specs/v1.md) - Current specification

---

## 🌟 Inspiration: Lessons from OpenAI Codex

The idea for grep-anchors comes directly from the Codex team's "Missing Manual" interview on Latent Space (May 17, 2025). The engineers emphasized that AI agents need to jump around repos with a single, collision-free token:

> *"Make your codebase discoverable — a well-named and organised tree lets Codex navigate the filesystem as quickly as a brand-new engineer might."*

They also advised capturing agent-specific conventions in a canonical doc so models "grow as model intelligence grows" — echoing our proposal for a root-level `grep-anchor.yml` dictionary.

That mindset — pick a unique string, grep it everywhere, document the contract — is exactly what `:ga:` formalizes. Think of grepa as the portable follow-up to Codex's internal practice, distilled into a four-byte sigil any OSS project or LLM can rely on.

### Sources

* **Blog & transcript**: [latent.space/p/codex](https://www.latent.space/p/codex)
* **Video**: [youtube.com/watch?v=LIHP4BqwSw0](https://www.youtube.com/watch?v=LIHP4BqwSw0)
