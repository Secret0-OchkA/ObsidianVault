---
type: knowledge
status: developed
created: 2026-09-15
updated: 2026-09-15
tags:
  - knowledge
  - topic/agents
  - topic/observability
template_version: 2
source: .github/skills/observability/SKILL.md
confidence: medium
review_status: reconstructed
---

# Observability

Project-neutral workflow for Grafana, Loki, Prometheus, Tempo, dashboards, and metrics catalogs. Project-specific datasource UIDs, selectors, jobs, dashboard UIDs, and metric facts belong in the project's observability documentation, commonly `docs/observability.md`.

## Discovery

Never assume a datasource, label, job, metric, or dashboard. Discover top-down:

`list_datasources -> label names/metric names -> label values -> logs/PromQL queries`

A default datasource may not contain the service data. Probe known labels before concluding that data is absent.

For Loki, enumerate label names, find a selective value, then run a small LogQL query. For Prometheus, find the scrape job, enumerate `__name__` by job, verify `up`, then query the exact metric. Loki and Prometheus label services differently; never copy selectors between them.

## Query reminders

Loki uses RFC3339 time and may enforce a maximum range, often 24 hours. Prometheus accepts relative times and range queries need an end time and step. Confirm emitted OpenTelemetry names because counters and histograms are transformed during export.

Dashboards can contain stale metric queries, and collapsed rows can hide panel queries. Verify panel queries against current metrics rather than treating a dashboard's existence as proof.

## Metrics catalog

Code is ground truth. Record exact instrument name, type, unit, labels, trigger, service, meter registration, exporter, and dashboard status. Update the catalog in the same change as instrumentation. Mark dashboard status only after verifying the exact panel query.

## Dashboard work

Search folders and dashboards, confirm folder and panel queries, fetch the full model before broad edits, and use targeted operations for small changes. Verify dev and prod independently. There is no general delete-dashboard MCP operation; deletion requires the Grafana UI.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]
