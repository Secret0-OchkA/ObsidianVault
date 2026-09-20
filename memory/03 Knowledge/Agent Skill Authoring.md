---
type: knowledge
status: developed
created: 2026-09-15
updated: 2026-09-15
tags:
  - knowledge
  - topic/agents
  - topic/agent-customization
template_version: 2
source: .github/skills/create-skill/SKILL.md
confidence: medium
review_status: reconstructed
---

# Agent Skill Authoring

This note describes how to create an executable VS Code Agent Skill. The note itself is reusable knowledge; the runtime package belongs under `.github/skills/<skill-name>/`.

## Package structure

A skill directory must contain `SKILL.md` and may contain `scripts/`, `references/`, `assets/`, and `templates/`.

- `scripts/`: tested automation with `--help` and error handling.
- `references/`: larger documentation loaded only when needed.
- `assets/`: files consumed unchanged.
- `templates/`: scaffolds the agent reads and modifies.

## SKILL.md frontmatter

Use lowercase kebab-case for a unique name, no longer than 64 characters. The description is the primary discovery mechanism and must state what the skill does, when to use it, and relevant keywords.

```yaml
---
name: skill-name
description: |
  Toolkit for X. Use when asked to Y, Z, or W.
  Supports A, B, and C.
---
```

## Body

Write concise imperative instructions for an experienced specialist. Include prerequisites, step-by-step workflows, troubleshooting, exact commands, and relative references. Keep `SKILL.md` under 500 lines.

## Safety and validation

- Never hardcode credentials or secrets.
- Warn before irreversible actions and document network calls.
- Validate frontmatter, unique naming, discovery description, line count, relative references, scripts, and registration.
- Register the runtime skill in `AGENTS.md` when the repository convention requires it.
- Enable `chat.useAgentSkills: true` in VS Code.

## Progressive loading

Keep discovery metadata lightweight. Load the full skill instructions only after the request matches the description; load scripts and references only when explicitly needed.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]
