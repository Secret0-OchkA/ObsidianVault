---
type: knowledge
status: active
tags:
  - knowledge
  - agents
  - routing
  - dotnet
  - jira
created: 2026-09-15
updated: 2026-09-21
template_version: 2
source: user-level Copilot knowledge migration
confidence: high
review_status: reviewed
---

# Agent Knowledge Routing

These four documents are reusable knowledge, not executable skills. Agents should read them from Obsidian when the matching work is present.

## .NET implementation and review

- [[03 Knowledge/Dotnet Code Style]] - mandatory naming, type-shape, async, nullability, DI, visibility, comments, and file-organization guidance. Read for every .NET/C# implementation or review.
- [[03 Knowledge/Dotnet Pattern Playbook]] - pattern-selection index. Read the index, then read only the one matching reference note for the current implementation situation. Do not load the whole pattern catalog.

## Jira task creation

- [[03 Knowledge/Jira Task Authoring]] - generic Jira task authoring. Read before creating or updating a Jira issue. If the assignee is not provided, ask the user who should be assigned the issue and wait before creating it.
- [[03 Knowledge/Jira Ticket Creator ADOC]] - ADOC-specific Jira fields, ADF format, options, and transitions. Read instead of the generic Jira note for ADOC issues. Confirm the assignee before creating the issue.

## Source of truth

The Obsidian notes are the canonical reusable knowledge. The original local copies are preserved under `C:\Users\matvey.kuvin\.copilot\knowledge-archive` for history and recovery, but they are no longer active skills. Project-specific facts belong in `01 Projects/<project>/`.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]

### Specification and planning

- [[03 Knowledge/Specification Workflow]] - пакетный Spec-Driven Development workflow и границы `spec.md`, `design.md`, `decisions.md`, `tasks.md` и `tests.md`.

### Agent feedback and learning

- [[_Templates/Agent Feedback]] - raw feedback artifact for repeated corrections, missed context, review findings, test discoveries, and agent-to-agent handoffs.
- [[03 Knowledge/Development Process]] - feedback thresholds, routing, and the `sub-agent -> supervising agent -> human` protocol.

Create raw feedback first, then promote it only after evidence and appropriate human confirmation. Keep reusable rules in `03 Knowledge`; keep project-specific decisions in the repository documentation.
