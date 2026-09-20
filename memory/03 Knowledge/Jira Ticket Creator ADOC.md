---
type: knowledge
status: active
tags:
  - jira
  - adoc
  - task-authoring
source: .copilot/skills/jira-ticket-creator-adoc/SKILL.md
template_version: 2
confidence: medium
review_status: reviewed
---

# Jira Ticket Creator - ADOC

## Board / Project Info

| Property | Value |
|---|---|
| Cloud ID | `admortgage.atlassian.net` |
| Project Key | `ADOC` |
| Default Issue Type | Task (`id: 10002`) |
| Content Format for Rich-Text Fields | **ADF** (`contentFormat: "adf"`) |

> Все rich-text поля (`description`, `AS IS`, `TO BE`, `Steps to test`, `QA Section`, `Flow / Process`, `Figma prototype / Mockup`) требуют ADF document objects, а не plain strings. При вызове `editJiraIssue` всегда передавать `contentFormat: "adf"`.

## ADF-шаблон

Использовать эту оболочку для каждого rich-text поля:

```json
{
  "type": "doc",
  "version": 1,
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Your content here" }
      ]
    }
  ]
}
```

Для нескольких абзацев добавлять несколько узлов `paragraph` в `content`.

## Стандартные поля

| Field | Key | Type | Notes |
|---|---|---|---|
| Summary / Title | `summary` | string | Обязательное. Всегда формат `[B] One line description`; префикс `[B]` обязателен. |
| Description | `description` | ADF | Что нужно сделать и зачем. |
| Issue Type | `issuetype` | `{"id": "10002"}` | Task. Для Bug использовать `10003`. |
| Assignee | `assignee` | `{"accountId": "..."}` | Исполнитель должен быть подтвержден пользователем до создания. Если не указан, спросить пользователя; не угадывать и не оставлять задачу без assignee без явного подтверждения. |
| Priority | `priority` | `{"name": "Medium"}` | Low / Medium / High / Highest. |
| Labels | `labels` | `["label1"]` | Необязательное. |
| Due Date | `duedate` | `"YYYY-MM-DD"` | Необязательное. |

## Custom fields

| Field | Key | Type | Purpose |
|---|---|---|---|
| **AS IS** | `customfield_12840` | ADF | Current state / problem description. |
| **TO BE** | `customfield_12841` | ADF | Desired state after the change. |
| **Steps to test** | `customfield_10464` | ADF | Numbered test steps with expected results. |
| **DoR** | `customfield_13120` | array of option | Для готовой к разработке задачи: `[{'id': '13774'}]` в JSON-формате. |
| **QA Section** | `customfield_10457` | ADF | QA notes or test scope. |
| **Flow / Process** | `customfield_10463` | ADF | Business process or flow description. |
| **Figma prototype / Mockup** | `customfield_10462` | ADF | Link or description of design assets. |
| **Story Points** | `customfield_10026` | number | Effort estimate. |
| **Sprint** | `customfield_10020` | `[{'id': '...'}]` | Active sprint ID. |
| **Board** | `customfield_11676` | `{'id': '...'}` | См. значения Board ниже. |
| **Developed By** | `customfield_10149` | `{'accountId': '...'}` | Developer assigned. |
| **Tested By** | `customfield_10136` | `{'accountId': '...'}` | QA engineer. |
| **Analyzed By** | `customfield_10151` | `{'accountId': '...'}` | Analyst who scoped the ticket. |
| **Reviewed By** | `customfield_10152` | `[{'accountId': '...'}]` | Multi-user reviewer list. |
| **Designed By** | `customfield_12724` | `{'accountId': '...'}` | UX/UI designer. |
| **CAB Decision** | `customfield_10206` | `{'id': '...'}` | См. значения CAB Decision ниже. |
| **CAB Date** | `customfield_10207` | `"YYYY-MM-DD"` | Change Advisory Board date. |
| **Add to regression?** | `customfield_12807` | `{'id': '...'}` | См. значения Add to Regression ниже. |
| **Department** | `customfield_10461` | `[{'id': '...'}]` | Multi-select; см. значения ниже. |
| **Completeness of Information** | `customfield_13286` | `[{'id': '...'}]` | Multi-checkbox; см. значения ниже. |
| **Start date** | `customfield_10015` | `"YYYY-MM-DD"` | Planned start. |
| **End date** | `customfield_10035` | `"YYYY-MM-DD"` | Planned end. |
| **Business-Defined Date** | `customfield_11544` | `"YYYY-MM-DD"` | Business deadline. |
| **Business report date** | `customfield_10173` | `"YYYY-MM-DD"` | Date of business report. |
| **Department reporter** | `customfield_10172` | string | Free-text reporter department. |

## Значения опций

### Board (`customfield_11676`)

| Label | ID |
|---|---|
| Development | `12264` |
| Operations | `12265` |

### CAB Decision (`customfield_10206`)

| Label | ID |
|---|---|
| Not required | `10537` |
| Required | `10538` |

### Add to Regression? (`customfield_12807`)

| Label | ID |
|---|---|
| Yes | `13392` |
| No | `13393` |

### Department (`customfield_10461`) - multi-select

| Label | ID |
|---|---|
| Servicing | `10750` |
| BI | `10751` |
| Integra | `10752` |
| IF | `10753` |

### DoR (`customfield_13120`) - checkbox

| Label | ID |
|---|---|
| True | `13774` |

### Completeness of Information (`customfield_13286`) - multi-checkbox

| Label | ID |
|---|---|
| Yes | `13844` |
| No - AS IS | `13845` |
| No - TO BE | `13846` |
| No - Figma Prototype / Mockup | `14307` |
| No - Flow / Process | `14269` |
| No - Steps to Test | `14308` |

## Workflow Transitions

| Transition Name | Transition ID | Target Status | Notes |
|---|---|---|---|
| Ready To Do | `10` | To Do | Помечает задачу готовой к разработке после заполнения полей. |
| To Analyze | `3` | Analysis | Только из DRAFT; переводит в analysis phase. |
| Analysis | `26` | Analysis | Global transition. |
| ON HOLD | `8` | ON HOLD | Global. |
| Blocked | `25` | Blocked | Global. |
| Done | `31` | Done | Global. |
| Cancelled | `24` | Cancelled | Global. |
| DRAFT | `30` | DRAFT | Возврат в DRAFT. |

Стандартный переход готовой к разработке задачи: `DRAFT` -> `Ready To Do` (`id: 10`) -> `To Do`.

## Пошаговое создание полной задачи

### Шаг 1 - Подготовить содержание

До вызова инструментов подготовить:

- **Assignee** - если пользователь не указал исполнителя, спросить, на кого назначить задачу, и не создавать задачу до подтверждения.
- **Summary** - короткое действие или результат.
- **Description** - что нужно сделать и зачем, со ссылкой на требования при необходимости.
- **AS IS** - текущее поведение или проблема.
- **TO BE** - ожидаемое поведение после изменения.
- **Steps to Test** - нумерованные шаги с ожидаемым результатом.

Description должен быть высокоуровневым и ориентированным на бизнес:

- описывать что и зачем, а не внутренний способ реализации;
- не содержать сигнатуры, названия классов, интерфейсов и методов;
- не описывать техническую архитектуру, слои, DI и репозитории без строгой необходимости;
- для API-контрактов использовать JSON-примеры request/response;
- для database-задач использовать таблицу с колонками или representative row / SQL snippet;
- писать для product owner или QA, а не для разработчика.

### Шаг 2 - Создать задачу

После подтверждения assignee использовать `createJiraIssue` минимум с `summary`, `issuetype` и `assignee`:

```json
{
  "cloudId": "admortgage.atlassian.net",
  "spaceId": "ADOC",
  "fields": {
    "summary": "[B] Your title",
    "issuetype": { "id": "10002" },
    "assignee": { "accountId": "..." }
  }
}
```

### Шаг 3 - Заполнить поля

Использовать `editJiraIssue` с `contentFormat: "adf"` и заполнить rich-text поля ADF-документами, а DoR - массивом `[{'id': '13774'}]` в JSON-формате.

Пример минимального набора:

```json
{
  "cloudId": "admortgage.atlassian.net",
  "issueIdOrKey": "ADOC-XXX",
  "contentFormat": "adf",
  "fields": {
    "description": { "type": "doc", "version": 1, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "..." }] }] },
    "customfield_12840": { "type": "doc", "version": 1, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "AS IS content..." }] }] },
    "customfield_12841": { "type": "doc", "version": 1, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "TO BE content..." }] }] },
    "customfield_10464": { "type": "doc", "version": 1, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "1. Step one\\n2. Step two" }] }] },
    "customfield_13120": [{ "id": "13774" }]
  }
}
```

### Шаг 4 - Перевести в Analysis

После заполнения всех полей вывести задачу из DRAFT переходом `id: 26` через `transitionJiraIssue`.

## Минимальный checklist перед выходом из DRAFT

Перед переводом из DRAFT проверить:

- [ ] `summary` установлен.
- [ ] `assignee` подтвержден пользователем и установлен, либо есть явное подтверждение оставить задачу без исполнителя.
- [ ] `description` установлен в формате ADF.
- [ ] `customfield_12840` заполнен (AS IS, ADF).
- [ ] `customfield_12841` заполнен (TO BE, ADF).
- [ ] `customfield_10464` заполнен (Steps to test, ADF).
- [ ] `customfield_13120` установлен как `[{'id': '13774'}]` в JSON-формате.
