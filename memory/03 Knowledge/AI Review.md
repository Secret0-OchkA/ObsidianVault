---
type: knowledge
status: developed
created: 2026-09-15
updated: 2026-09-15
tags:
  - knowledge
  - topic/agents
  - topic/code-review
template_version: 2
source: Obsidian agent knowledge documentation
confidence: medium
review_status: reviewed
---

# AI Review

Используй для AI code review, аудита изменений, поиска регрессий и проверки качества.

## Выбор reviewer

Запускай runtime-адаптер skill, если он есть в репозитории. По умолчанию пробуй `codex`, затем `copilot`. Неработающий, отсутствующий или неавторизованный кандидат пропускай и переходи к следующему. Зафиксированную модель не заменяй без разрешения пользователя.

## Процесс

1. Проверь доступность reviewer через штатный скрипт.
2. Запусти review на diff текущего workspace, включая untracked-файлы.
3. Сохрани exit code и прочитай файл результата, а не только stdout.
4. Раздели findings на critical, significant и minor.
5. Исправь critical/significant findings и повтори review.
6. После завершения удали временные отчёты review и проверь `git status`.
7. Убедись, что reviewer не изменил посторонние файлы.

## Ограничения

- Не сообщай, что review выполнен, если reviewer не оставил итоговый marker или результат пуст.
- Не подменяй выбранную пользователем модель другой моделью.
- Не помещай project-specific сведения в эту заметку; они относятся к проекту и хранятся в `01 Projects/<project>/`.
- При отсутствии CLI сообщи точную команду входа, но не проходи интерактивную авторизацию за пользователя.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]
