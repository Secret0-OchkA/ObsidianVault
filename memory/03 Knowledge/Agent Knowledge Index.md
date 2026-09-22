---
type: index
status: active
tags:
  - knowledge
  - index
  - agents
updated: 2026-09-21
source: Obsidian agent knowledge index
confidence: high
review_status: reviewed
---
# Agent Knowledge Index

Карта reusable knowledge для агентов. Эти заметки дают контекст, правила и workflows; они не являются runtime skills.

## Routing

- [[03 Knowledge/Agent Knowledge Routing]] — какие заметки читать по типу задачи.
- [[03 Knowledge/Development Process]] — выбор малого или расширенного процесса.
- [[03 Knowledge/Task Analysis]] — анализ требований и делегирование.

## Workflows

- [[03 Knowledge/AI Review]] — AI code review и проверка diff.
- [[03 Knowledge/Markdown Compression]] — сжатие markdown без изменения literal-данных.
- [[03 Knowledge/Project Quality]] — coverage, mutation testing и warnings.
- [[03 Knowledge/Observability]] — Grafana, Loki, Prometheus и metrics catalog.

- [[03 Knowledge/Specification Workflow]] — SDD-пакет: spec, design, decisions, tasks и tests.

- [[_Templates/Agent Feedback]] - шаблон фиксации и формализации обратной связи от человека, sub-agent, review и тестов.
- [[03 Knowledge/Development Process]] - протокол обработки обратной связи и межагентной передачи.

- [[03 Knowledge/Bitbucket Pull Request Workflow]] — подготовка и оформление Pull Request в Bitbucket Cloud.

## Agent customization

- [[03 Knowledge/Agent Skill Authoring]] — создание настоящих runtime skills.

## Technical knowledge

- [[03 Knowledge/Dotnet Code Style]] — соглашения C#/.NET.
- [[03 Knowledge/Dotnet Pattern Playbook]] — выбор .NET-паттернов.
- [[03 Knowledge/Jira Task Authoring]] — подготовка Jira-задач.
- [[03 Knowledge/Jira Ticket Creator ADOC]] — поля и workflow проекта ADOC.

## Taxonomy

- Knowledge notes находятся в `03 Knowledge`.
- Project-specific facts and documentation находятся в соответствующем репозитории, обычно в `docs/` и project instructions.
- Obsidian does not duplicate project architecture, runtime, configuration, queues, commands, or operational facts.
- A repository may maintain executable skills under `.github/skills/` when they bundle required scripts or templates; these are not a substitute for project documentation.
- Исторический архив пользовательских исходников находится в `C:\Users\matvey.kuvin\.copilot\knowledge-archive`.
- Не называй обычные Obsidian notes skills.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]
