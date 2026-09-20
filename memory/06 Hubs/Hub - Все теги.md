---
type: hub
status: active
created: 2026-09-14
updated: 2026-09-14
hub_tag: system/tags
parent_hub: "[[Hub - Все хабы]]"
tags:
  - hub
  - index
---

# Hub - Все теги

Центральный каталог тегов и заметок, в которых они используются.

## Статистика по тегам

Для автоматического обновления этой таблицы нужен плагин Dataview.

```dataview
TABLE WITHOUT ID
  tag AS "Тег",
  length(rows) AS "Заметок",
  rows.file.link AS "Заметки"
FROM ""
FLATTEN file.tags AS tag
WHERE !contains(file.path, "_Templates/")
  AND !contains(file.path, "_Scripts/")
GROUP BY tag
SORT tag ASC
```

## Основная таксономия

- `#hub` — хабы и индексные заметки
- `#index` — индексные заметки
- `#knowledge` — знания и собственные материалы
- `#topic/...` — тематическая классификация
- `#project` — проекты
- `#source` — внешние источники
- `#meeting` — встречи
- `#daily` — ежедневные заметки

## Правила

- Используй строчные теги без пробелов.
- Для иерархии используй формат `topic/подтема`.
- Перед созданием нового тега проверь его в таблице выше.
- Не удаляй тег из списка вручную: список строится по тегам заметок.
