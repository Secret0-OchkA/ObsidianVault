---
type: knowledge
status: developed
created: 2026-09-15
updated: 2026-09-15
tags:
  - knowledge
  - topic/agents
  - topic/writing
template_version: 2
source: Obsidian agent knowledge documentation
confidence: medium
review_status: reviewed
---

# Markdown Compression

Используй, когда нужно уменьшить markdown в token-efficient формате без потери технического смысла.

## Правила

- Сжимай только естественный язык.
- Сохраняй verbatim fenced code blocks, inline code, URL, markdown links, headings, file paths, commands, environment variables, версии, даты, числа и структуру таблиц.
- Сохраняй исходную иерархию headings, списков и нумерации.
- Убирай вводные слова, повторы, вежливые формулы и лишние пояснения.
- Не удаляй уникальные требования и ограничения.
- Если текст может быть кодом, конфигурацией или literal value, оставляй его без изменений.

## Формат результата

Возвращай только сжатое markdown-содержимое без внешнего code fence, summary или пояснений. Вложенные code fences сохраняй как есть.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]
