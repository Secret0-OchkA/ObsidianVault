---
type: knowledge
status: developed
created: 2026-09-15
updated: 2026-09-15
tags:
  - knowledge
  - topic/agents
  - topic/planning
template_version: 2
source: .github/skills/task-analyst/SKILL.md
confidence: medium
review_status: reconstructed
---

# Task Analysis

Use this workflow for non-trivial development tasks that need requirements analysis, planning, delegation, and verification. The note is reusable knowledge; executable orchestration remains a runtime skill or agent configuration.

## Workflow

1. Read repository instructions and documentation relevant to the request.
2. Clarify ambiguity before planning.
3. Identify affected layers, owning abstractions, exact files, tests, and documentation.
4. Present the plan and wait for explicit approval before delegation when approval is required.
5. Delegate to the specialist owning the work: .NET/C# to the C# specialist, frontend to the frontend specialist, schema/migrations to the SQL specialist, and incidents to the incident investigator first.
6. Require every delegate to run the relevant build and unit tests, add missing tests, and report results.
7. Run review after code changes and iterate on significant findings.
8. Start the integration environment and inspect resource status and logs when the change needs it.
9. Run live integration tests for API, database, or seed-data changes.
10. Report completed checks, failures, unresolved questions, and residual risk.

## Jira and irreversible actions

Before creating or updating a Jira issue, load the Jira authoring knowledge. Confirm the assignee explicitly when it is not supplied; never infer it. Confirm screenshots or other project-specific required fields before issue creation. Never commit or create a branch without explicit user approval.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Планирование]]
- [[06 Hubs/Hub - Knowledge]]
