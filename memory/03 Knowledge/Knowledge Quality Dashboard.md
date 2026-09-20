---
type: dashboard
status: active
created: 2026-09-14
updated: 2026-09-14
tags:
  - knowledge
  - dashboard
  - quality
  - metrics
---

# Knowledge Quality Dashboard

> Динамический дашборд здоровья базы знаний. Для расчета нужен плагин **Dataview** с включенным `DataviewJS`. Нажми кнопку снимка после настройки и затем раз в неделю или после крупных изменений, чтобы видеть тренд.

## Как читать результат

- **80-100** — база в хорошем состоянии.
- **60-79** — есть накопившийся долг, стоит разобрать очередь действий.
- **0-59** — качество просело, сначала восстановить metadata и связи.
- Счетчик считается только для рабочих заметок. Исключены `00 System`, `00 Inbox`, `04 Sources`, `05 Archive`, `06 Hubs` и `_Templates`.
- Архивные и служебные материалы не должны искажать качество рабочей базы.

## Текущий результат

```dataviewjs
const excludedPrefixes = [
  "00 System/",
  "00 Inbox/",
  "04 Sources/",
  "05 Archive/",
  "06 Hubs/",
  "_Templates/"
];
const currentPath = dv.current().file.path;
const historyPath = "03 Knowledge/Knowledge Quality History.md";
const staleAfterDays = 90;

const pages = dv.pages()
  .where(page => page.file.path.endsWith(".md"))
  .where(page => page.file.path !== currentPath)
  .where(page => !excludedPrefixes.some(prefix => page.file.path.startsWith(prefix)))
  .array();

const now = new Date();
const toDate = value => {
  if (!value) return null;
  const date = value.toJSDate ? value.toJSDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const toArray = value => Array.isArray(value) ? value : value?.array ? value.array() : [];
const linkPath = link => link?.path ?? (typeof link === "string" ? link : "");
const hasTags = page => {
  const tags = page.file.tags ?? page.tags ?? [];
  return Array.isArray(tags) ? tags.length > 0 : Boolean(tags);
};
const hasMetadata = page => Boolean(page.type && page.status && hasTags(page) && (page.updated || page.file.mtime));
const hasLinks = page => (page.file.inlinks?.length ?? 0) + (page.file.outlinks?.length ?? 0) > 0;
const hasInboundLinks = page => toArray(page.file.inlinks).length > 0;
const hasHubLink = page => [...toArray(page.file.inlinks), ...toArray(page.file.outlinks)]
  .some(link => linkPath(link).startsWith("06 Hubs/"));
const isStale = page => {
  const updated = toDate(page.updated) ?? toDate(page.file.mtime);
  return !updated || (now - updated) / 86400000 > staleAfterDays;
};
const unresolvedCount = page => Array.isArray(page.file.unresolvedLinks) ? page.file.unresolvedLinks.length : 0;
const unresolvedSupported = pages.some(page => Array.isArray(page.file.unresolvedLinks));
const ratio = predicate => pages.length === 0 ? 1 : pages.filter(predicate).length / pages.length;
const percent = value => Math.round(value * 100);
const hasValue = value => value !== undefined && value !== null && String(value).trim() !== "";
const validConfidenceValues = ["low", "medium", "high"];
const isTemplateV2 = page => Number(page.template_version) === 2;
const hasSource = page => hasValue(page.source);
const hasConfidence = page => validConfidenceValues.includes(String(page.confidence ?? "").toLowerCase());
const isReviewed = page => String(page.review_status ?? "").toLowerCase() === "reviewed";
const hasTemplateDebt = page => !isTemplateV2(page) || !hasSource(page) || !hasConfidence(page) || !isReviewed(page);

const metadataChecks = [
  ["type", page => Boolean(page.type)],
  ["status", page => Boolean(page.status)],
  ["tags", hasTags],
  ["updated или mtime", page => Boolean(page.updated || page.file.mtime)]
];
const metadataCoverage = metadataChecks.map(([label, predicate]) => [label, percent(ratio(predicate))]);
const governanceChecks = [
  ["template v2", isTemplateV2],
  ["source", hasSource],
  ["confidence", hasConfidence],
  ["review_status", page => ["pending", "reviewed"].includes(String(page.review_status ?? "").toLowerCase())]
];
const governanceCoverage = governanceChecks.map(([label, predicate]) => [label, percent(ratio(predicate))]);
const metadataRatio = ratio(hasMetadata);
const linkRatio = ratio(hasLinks);
const freshnessRatio = ratio(page => !isStale(page));
const cleanLinkRatio = unresolvedSupported ? ratio(page => unresolvedCount(page) === 0) : 1;
const score = Math.round(metadataRatio * 35 + linkRatio * 30 + freshnessRatio * 25 + cleanLinkRatio * 10);

const missingMetadata = pages.filter(page => !hasMetadata(page));
const orphans = pages.filter(page => !hasLinks(page));
const noInbound = pages.filter(page => !hasInboundLinks(page));
const hubLinked = pages.filter(hasHubLink);
const notHubLinked = pages.filter(page => !hasHubLink(page));
const stale = pages.filter(isStale);
const brokenLinks = pages.filter(page => unresolvedCount(page) > 0);
const notTemplateV2 = pages.filter(page => !isTemplateV2(page));
const missingSource = pages.filter(page => !hasSource(page));
const missingConfidence = pages.filter(page => !hasConfidence(page));
const unreviewed = pages.filter(page => !isReviewed(page));
const templateDebt = pages.filter(hasTemplateDebt);
const templateCoverage = percent(ratio(isTemplateV2));
const brokenLinkRate = pages.length === 0 ? 0 : Math.round(brokenLinks.length / pages.length * 100);
const noInboundRate = pages.length === 0 ? 0 : Math.round(noInbound.length / pages.length * 100);
const hubCoverage = pages.length === 0 ? 0 : Math.round(hubLinked.length / pages.length * 100);
const status = score >= 80 ? { label: "Здоровая", color: "#2e7d32" } : score >= 60 ? { label: "Требует внимания", color: "#b26a00" } : { label: "Просадка", color: "#b42318" };

const root = dv.container;
root.innerHTML = "";
root.classList.add("kb-dashboard");
const style = root.createEl("style");
style.textContent = `
  .kb-dashboard { --ink: var(--text-normal); --muted: var(--text-muted); --line: var(--background-modifier-border); --panel: var(--background-secondary); color: var(--ink); }
  .kb-dashboard .kb-layout { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); grid-template-areas: "hero hero hero hero hero hero" "cards cards cards cards cards cards" "quality quality quality actions actions actions" "metadataQuality metadataQuality templates templates metrics metrics" "distribution distribution distribution snapshot snapshot snapshot" "distribution distribution distribution history history history" "metadata metadata orphans orphans stale stale"; gap: 14px; align-items: stretch; }
  .kb-dashboard .kb-hero { grid-area: hero; display: flex; align-items: center; gap: 18px; padding: 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
  .kb-dashboard .kb-score { font-size: 42px; font-weight: 700; line-height: 1; color: ${status.color}; min-width: 100px; }
  .kb-dashboard .kb-status { font-size: 1.15em; font-weight: 600; }
  .kb-dashboard .kb-muted { color: var(--muted); }
  .kb-dashboard .kb-cards { grid-area: cards; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
  .kb-dashboard .kb-card { min-width: 0; padding: 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); }
  .kb-dashboard .kb-card-value { font-size: 1.5em; font-weight: 650; }
  .kb-dashboard .kb-card-label { color: var(--muted); font-size: .9em; }
  .kb-dashboard .kb-panel { min-width: 0; padding: 16px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); box-shadow: 0 2px 8px rgba(0, 0, 0, .12); }
  .kb-dashboard .kb-panel h3 { margin-top: 0; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
  .kb-dashboard .kb-panel--quality { grid-area: quality; }
  .kb-dashboard .kb-panel--actions { grid-area: actions; max-height: 420px; overflow-y: auto; scrollbar-gutter: stable; }
  .kb-dashboard .kb-panel--metadataQuality { grid-area: metadataQuality; }
  .kb-dashboard .kb-panel--templates { grid-area: templates; }
  .kb-dashboard .kb-panel--metrics { grid-area: metrics; }
  .kb-dashboard .kb-panel--distribution { grid-area: distribution; }
  .kb-dashboard .kb-panel--snapshot { grid-area: snapshot; }
  .kb-dashboard .kb-panel--history { grid-area: history; }
  .kb-dashboard .kb-panel--metadata { grid-area: metadata; }
  .kb-dashboard .kb-panel--orphans { grid-area: orphans; }
  .kb-dashboard .kb-panel--stale { grid-area: stale; }
  .kb-dashboard .kb-bars { display: grid; gap: 10px; }
  .kb-dashboard .kb-bar-row { display: grid; grid-template-columns: minmax(120px, 210px) 1fr 48px; gap: 10px; align-items: center; }
  .kb-dashboard .kb-bar-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .kb-dashboard .kb-bar-track { height: 10px; overflow: hidden; border-radius: 999px; background: var(--background-modifier-border); }
  .kb-dashboard .kb-bar-fill { height: 100%; border-radius: inherit; }
  .kb-dashboard .kb-bar-value { text-align: right; color: var(--muted); font-variant-numeric: tabular-nums; }
  .kb-dashboard .kb-button { margin: 8px 0; padding: 7px 12px; border: 1px solid var(--interactive-accent); border-radius: 7px; background: var(--interactive-accent); color: var(--text-on-accent); cursor: pointer; }
  .kb-dashboard .kb-button:hover { filter: brightness(1.1); }
  .kb-dashboard .kb-note { padding: 10px 12px; border-left: 3px solid var(--interactive-accent); background: var(--background-primary); }
  .kb-dashboard table { width: 100%; }
  .kb-dashboard th, .kb-dashboard td { vertical-align: top; }
  @media (max-width: 900px) { .kb-dashboard .kb-layout { grid-template-columns: 1fr; grid-template-areas: "hero" "cards" "quality" "actions" "metadataQuality" "templates" "metrics" "distribution" "snapshot" "history" "metadata" "orphans" "stale"; } .kb-dashboard .kb-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 520px) { .kb-dashboard .kb-cards { grid-template-columns: 1fr; } .kb-dashboard .kb-bar-row { grid-template-columns: 1fr 1fr 42px; gap: 6px; font-size: .9em; } }
`;

const layout = root.createEl("div", { cls: "kb-layout" });
const createPanel = (title, area) => {
  const panel = layout.createEl("section", { cls: `kb-panel kb-panel--${area}` });
  panel.createEl("h3", { text: title });
  return panel;
};
const addBar = (parent, label, value, color, suffix = "%") => {
  const row = parent.createEl("div", { cls: "kb-bar-row" });
  row.createEl("div", { cls: "kb-bar-label", text: label });
  const track = row.createEl("div", { cls: "kb-bar-track" });
  const fill = track.createEl("div", { cls: "kb-bar-fill" });
  fill.style.width = `${Math.max(0, Math.min(100, value))}%`;
  fill.style.background = color;
  row.createEl("div", { cls: "kb-bar-value", text: `${value}${suffix}` });
};
const renderTable = (parent, headers, rows) => {
  const table = parent.createEl("table");
  const thead = table.createEl("thead");
  const headerRow = thead.createEl("tr");
  headers.forEach(header => headerRow.createEl("th", { text: header }));
  const tbody = table.createEl("tbody");
  rows.forEach(row => {
    const tableRow = tbody.createEl("tr");
    row.forEach(value => {
      const cell = tableRow.createEl("td");
      if (value?.path) {
        const display = value.display ?? value.path.split("/").pop().replace(".md", "");
        const link = cell.createEl("a", { text: display, href: "#" });
        link.addEventListener("click", event => {
          event.preventDefault();
          app.workspace.openLinkText(value.path, currentPath, false);
        });
      } else {
        cell.setText(String(value ?? ""));
      }
    });
  });
};

const hero = layout.createEl("div", { cls: "kb-hero" });
hero.createEl("div", { cls: "kb-score", text: `${score}/100` });
const heroText = hero.createEl("div");
heroText.createEl("div", { cls: "kb-status", text: status.label });
heroText.createEl("div", { cls: "kb-muted", text: `${pages.length} рабочих заметок в расчете. Просрочка свежести: ${staleAfterDays} дней.` });

const cards = layout.createEl("div", { cls: "kb-cards" });
[
  ["Рабочие заметки", pages.length],
  ["Без metadata", missingMetadata.length],
  ["Сироты графа", orphans.length],
  ["Устарели", stale.length]
].forEach(([label, value]) => {
  const card = cards.createEl("div", { cls: "kb-card" });
  card.createEl("div", { cls: "kb-card-value", text: String(value) });
  card.createEl("div", { cls: "kb-card-label", text: label });
});

const qualityPanel = createPanel("Компоненты качества", "quality");
const qualityBars = qualityPanel.createEl("div", { cls: "kb-bars" });
addBar(qualityBars, "Metadata", percent(metadataRatio), "#3b82f6");
addBar(qualityBars, "Связность графа", percent(linkRatio), "#7c3aed");
addBar(qualityBars, "Свежесть", percent(freshnessRatio), "#0f766e");
addBar(qualityBars, unresolvedSupported ? "Ссылки без ошибок" : "Ссылки без ошибок*", percent(cleanLinkRatio), "#b26a00");
addBar(qualityBars, "Шаблон v2 (диагностика)", templateCoverage, "#0f766e");
qualityPanel.createEl("p", { cls: "kb-muted", text: `${unresolvedSupported ? "Все компоненты считаются напрямую по данным vault." : "* Dataview не отдал unresolvedLinks; компонент временно считается равным 100%."} Полоса шаблона v2 справочная и не входит в score.` });

const baseActionRows = [
  ["Высокий", "Заполнить metadata", missingMetadata.length, "Добавить type, status, tags и updated."],
  ["Высокий", "Разобрать сироты графа", orphans.length, "Добавить входящую или исходящую ссылку либо явно пометить заметку как самостоятельную."],
  ["Средний", "Обновить устаревшие заметки", stale.length, `Пересмотреть заметки старше ${staleAfterDays} дней и обновить только если содержание еще актуально.`],
  ["Высокий", "Исправить битые ссылки", brokenLinks.length, "Проверить unresolved links и заменить переименованные или удаленные цели."]
];
const metricActionRows = [
  ["Средний", "Перевести заметки на template v2", notTemplateV2.length, "Добавить template_version: 2 и заполнить обязательные поля шаблона."],
  ["Средний", "Добавить источник", missingSource.length, "Указать source: ссылку, документ или другой проверяемый источник."],
  ["Средний", "Уточнить confidence", missingConfidence.length, "Указать одно из значений confidence: low, medium или high."],
  ["Средний", "Закрыть review", unreviewed.length, "Проверить заметку и установить review_status: reviewed."],
  ["Средний", "Добавить входящие ссылки", noInbound.length, "Связать заметку с другой рабочей заметкой или hub, чтобы ее можно было найти через граф."],
  ["Низкий", "Связать заметки с hubs", notHubLinked.length, "Добавить ссылку на подходящий hub из папки 06 Hubs."]
];
const actionRows = [...baseActionRows, ...metricActionRows]
  .filter(([, , count]) => count > 0);
const actionsPanel = createPanel("Очередь действий", "actions");
renderTable(actionsPanel, ["Приоритет", "Проблема", "Количество", "Что сделать"], actionRows);

const historyPage = dv.page(historyPath);
const snapshots = (historyPage?.file?.lists ?? [])
  .where(item => item.date && item.score)
  .sort(item => item.date)
  .array();
const lastSnapshot = snapshots.length > 0 ? Number(snapshots[snapshots.length - 1].score) : null;
const scoreDelta = lastSnapshot === null ? null : score - lastSnapshot;

const metadataPanel = createPanel("Metadata", "metadataQuality");
const metadataBars = metadataPanel.createEl("div", { cls: "kb-bars" });
metadataCoverage.forEach(([label, value]) => addBar(metadataBars, label, value, "#3b82f6"));

const templatesPanel = createPanel("Шаблоны", "templates");
const governanceBars = templatesPanel.createEl("div", { cls: "kb-bars" });
governanceCoverage.forEach(([label, value]) => addBar(governanceBars, label, value, "#0f766e"));

const metricsPanel = createPanel("Метрики", "metrics");
renderTable(metricsPanel, ["Метрика", "Значение"], [
  ["Битые ссылки", unresolvedSupported ? `${brokenLinks.length} заметок (${brokenLinkRate}%)` : "Недоступно в Dataview"],
  ["Без входящих ссылок", `${noInbound.length} заметок (${noInboundRate}%)`],
  ["Связаны с hubs", `${hubLinked.length} заметок (${hubCoverage}%)`],
  ["Изменение score", scoreDelta === null ? "Нет предыдущего снимка" : `${scoreDelta >= 0 ? "+" : ""}${scoreDelta} к последнему снимку`]
]);

const distributionPanel = createPanel("Граф распределения проблем", "distribution");
const issueBars = distributionPanel.createEl("div", { cls: "kb-bars" });
const distributionRows = [
  ...baseActionRows.map(([priority, problem, count]) => ({ problem, count, color: priority === "Высокий" ? "#b42318" : "#b26a00" })),
  { problem: "Долг шаблона", count: templateDebt.length, color: "#b42318" }
];
const maxIssues = Math.max(1, ...distributionRows.map(row => row.count));
distributionRows.forEach(({ problem, count, color }) => addBar(issueBars, problem, Math.round(count / maxIssues * 100), color, String(count)));
distributionPanel.createEl("p", { cls: "kb-muted", text: "Долг шаблона: заметка не на v2, без source или confidence, либо еще не review_status: reviewed. Одна заметка считается один раз." });

const snapshotPanel = createPanel("Зафиксировать снимок", "snapshot");
const snapshotText = snapshotPanel.createEl("p", { cls: "kb-muted", text: "Снимок нужен для истории. Фиксируй его после крупных изменений или один раз в неделю." });
const snapshotButton = snapshotPanel.createEl("button", { cls: "kb-button", text: "Зафиксировать текущий score" });
snapshotButton.onclick = async () => {
  try {
    const file = app.vault.getAbstractFileByPath(historyPath);
    if (!file) throw new Error(`Не найден файл ${historyPath}`);
    const date = new Date().toISOString().slice(0, 10);
    const existing = await app.vault.read(file);
    if (existing.includes(`- date:: ${date}`)) {
      snapshotText.setText(`Снимок за ${date} уже существует.`);
      return;
    }
    await app.vault.append(file, `\n- date:: ${date}\n  score:: ${score}\n  metadata:: ${percent(metadataRatio)}\n  links:: ${percent(linkRatio)}\n  freshness:: ${percent(freshnessRatio)}\n  cleanLinks:: ${percent(cleanLinkRatio)}\n`);
    snapshotText.setText(`Снимок за ${date} сохранен. Перезапусти заметку, чтобы обновить историю.`);
  } catch (error) {
    snapshotText.setText(`Не удалось сохранить снимок: ${error.message}`);
  }
};

const historyPanel = createPanel("История score", "history");
if (snapshots.length === 0) {
  historyPanel.createEl("p", { cls: "kb-note", text: "История пока пуста. Зафиксируй первый снимок кнопкой выше." });
} else {
  const historyBars = historyPanel.createEl("div", { cls: "kb-bars" });
  snapshots.slice(-12).forEach(item => addBar(historyBars, String(item.date), Number(item.score), Number(item.score) >= 80 ? "#2e7d32" : Number(item.score) >= 60 ? "#b26a00" : "#b42318"));
  renderTable(historyPanel, ["Дата", "Score", "Metadata", "Связи", "Свежесть"], snapshots.slice(-12).reverse().map(item => [item.date, item.score, item.metadata, item.links, item.freshness]));
}

const issuePanels = [
  ["Без metadata", "metadata", missingMetadata],
  ["Сироты графа", "orphans", orphans],
  ["Устарели", "stale", stale]
];
issuePanels.forEach(([title, area, issuePages]) => {
  const panel = createPanel(title, area);
  renderTable(panel, ["Заметки"], issuePages.slice(0, 15).map(page => [page.file.link]));
});
```

## Что предпринимать при просадке

1. Если score ниже 80 — открыть очередь действий и разобрать сначала проблемы с приоритетом `Высокий`.
2. Если много заметок без metadata — привести их к стандарту `type`, `status`, `tags`, `created`, `updated`.
3. Если растет число сирот — добавить ссылки на индекс, проектный hub или связанную идею.
4. Если растет устаревший слой — провести короткий review: обновить, объединить или отправить в архив.
5. Если score падает два снимка подряд — остановить добавление новых заметок и сначала уменьшить накопившийся долг.

## Связанные заметки

- [[03 Knowledge/README|Правила заметок знаний]]
- [[06 Hubs/Hub - Knowledge|Индекс knowledge-записей]]
- [[03 Knowledge/Knowledge Quality History|История снимков качества]]

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]
