---
type: system
status: active
tags:
  - system
  - agents
  - knowledge
updated: 2026-09-18
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
