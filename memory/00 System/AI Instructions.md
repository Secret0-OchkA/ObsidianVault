---
type: system
status: active
tags:
  - system
  - agents
  - knowledge
updated: 2026-09-21
source: Obsidian agent operating instructions
confidence: high
review_status: reviewed
---
# AI Instructions and Knowledge

## Source of truth

Use the current user request, repository instructions, project documentation, and canonical Obsidian knowledge notes in that order of specificity. Concrete project facts belong in the current repository documentation, not in Obsidian project notes.

## Knowledge boundary

Obsidian stores general, reusable knowledge, references, workflows, and personal notes. A project repository stores its own architecture, code structure, runtime behavior, configuration, queues, commands, deployment facts, and operational documentation. Do not duplicate project documentation in Obsidian.

When a reusable lesson comes from a project, remove project names, paths, credentials, and environment-specific values before adding it to `03 Knowledge`. Keep the concrete decision and current implementation in the repository.

## Obsidian knowledge

Before work that matches a documented domain, read [[03 Knowledge/Agent Knowledge Routing]] and then load only the relevant notes from [[03 Knowledge/Agent Knowledge Index]]. Reusable notes in `03 Knowledge` are knowledge, references, and workflows. They are not runtime skills merely because an agent uses them.

## Runtime skills

Use the term `skill` only for an executable or tool-backed package discovered by the agent runtime, normally stored in a repository's `.github/skills/<skill-name>/SKILL.md`. Do not describe ordinary Obsidian notes as skills. A project may keep a small number of executable skills when they bundle scripts or templates required by that project's workflow; PDFService currently keeps `ai-review`, `observability`, and `font-archive-builder` there. Their project facts and instructions remain in `AGENTS.md` and `docs/`.

## Development process

For a local, well-defined change, use a falsifiable hypothesis, identify the owning code path, make the smallest edit, and run the cheapest focused validation immediately. For cross-project, API, database, integration, deployment, security, concurrency, reliability, performance, observability, or unclear work, use the large-task process in [[03 Knowledge/Development Process]] and [[03 Knowledge/Task Analysis]].

## .NET work

For every .NET/C# implementation or review, read [[03 Knowledge/Dotnet Code Style]]. For structural or pattern decisions, read [[03 Knowledge/Dotnet Pattern Playbook]] and only the matching reference note.

## Jira work

Before creating or updating a Jira issue, read [[03 Knowledge/Jira Task Authoring]]. For ADOC issues, also read [[03 Knowledge/Jira Ticket Creator ADOC]]. If the user has not specified the assignee, ask who should receive the issue and wait for confirmation before creating it. Never infer the assignee.

## Validation

Do not claim a check passed without its result. Name focused tests, build checks, review findings, unresolved requirements, and residual risks in the final report.

## Navigation

- [[Индекс знаний]]
- [[03 Knowledge/Agent Knowledge Index]]
- [[03 Knowledge/Agent Knowledge Routing]]
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]

## Спецификации

При подготовке спецификации читай [[03 Knowledge/Specification Workflow]] и создавай пакет с помощью [[_Templates/Feature Specification]], [[_Templates/Feature Design]], [[_Templates/Feature Decisions]], [[_Templates/Feature Tasks]] и [[_Templates/Feature Tests]]. Все спецификации и связанные артефакты пиши на русском языке. На языке оригинала можно оставлять только идентификаторы, имена кода и API, команды, пути, конфигурационные значения, точные внешние сообщения и необходимые технические термины. `spec.md` должен описывать поведение и быть проверяемым; решения реализации и декомпозицию помещай в связанные артефакты.

## Feedback and learning loop

Treat repeated corrections, rejected assumptions, review findings, test discoveries, and explicit uncertainty as feedback artifacts rather than disposable chat history.

- State the key assumptions and the cheapest check that could disconfirm them before making a consequential change.
- If the user corrects the same direction twice, or the work enters a repair loop, pause and identify the missing assumption instead of applying another blind patch.
- When Obsidian MCP is available, create a raw note from [[_Templates/Agent Feedback]]. Preserve the original observation and evidence; do not silently rewrite it as a rule.
- Classify the artifact before routing it: current task, session context, user preference, repository documentation, reusable knowledge, issue, or no action.
- Never promote a raw observation to a global instruction or reusable knowledge without evidence and, when it changes user or team behavior, explicit human confirmation.
- Do not store secrets, credentials, raw document payloads, or confidential data in feedback artifacts.
- When vault access is unavailable, return the same fields as a structured handoff so a supervising agent can persist them later.

## Delegated work and agent-to-agent feedback

A sub-agent reports to its supervising agent; it does not redefine the user's requirements or bypass the supervising agent to make unresolved decisions with the human.

Every delegated result should contain:

1. status and completed scope;
2. assumptions and constraints;
3. observations and supporting evidence;
4. uncertainties, risks, and blockers;
5. recommendation or next action;
6. a narrowly scoped question only when the supervising agent cannot resolve the ambiguity from the task contract or source of truth.

The supervising agent validates the report against the user request, repository instructions, acceptance criteria, and executable evidence. It then either continues the workflow, creates a feedback artifact with source `sub-agent`, or asks the human one consolidated question. Do not forward a chain of speculative sub-agent questions unchanged.

The supervising agent owns promotion of feedback into process rules, documentation, preferences, or issues. Sub-agents may draft raw observations, but they must not silently change canonical knowledge or global agent behavior.

When feedback from the user conflicts with a sub-agent recommendation, the user's clarified intent wins; when it conflicts with verified repository behavior or an approved contract, surface the conflict explicitly and ask for a decision.
