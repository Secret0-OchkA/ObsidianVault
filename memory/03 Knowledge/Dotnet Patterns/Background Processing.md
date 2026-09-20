---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - pattern
  - background-processing
source: user-level .copilot skill reference
template_version: 2
confidence: medium
review_status: reviewed
---

# Background / Long-Running Processing

**Context:** work outside a request/response cycle: queue consumers, scheduled jobs, and workers.

## Pattern

- Use `BackgroundService`/`IHostedService` with a cancellation-aware loop; always honor the injected `CancellationToken` in `ExecuteAsync`.
- Keep the loop body thin: fetch work, delegate to a pure/orchestration method, then handle and log failures without crashing the whole service.
- Make each unit of work idempotent where possible; see [[Dotnet Patterns/Caching and Idempotency]].
- Surface failures via `ILogger` with enough context to correlate with the failed item, including id and correlation id.

## Avoid

- Unhandled exceptions escaping the main loop and killing the whole background service.
- Blocking synchronous calls inside the async loop.
