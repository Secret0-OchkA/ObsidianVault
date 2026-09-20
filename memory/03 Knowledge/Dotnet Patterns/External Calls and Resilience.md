---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - pattern
  - resilience
source: user-level .copilot skill reference
template_version: 2
confidence: medium
review_status: reviewed
---

# External Calls & Resilience

**Context:** calling an external HTTP API, gRPC service, queue, or storage that can fail transiently.

## Pattern

- Wrap the call at its boundary with a Polly policy: retry with exponential backoff and a circuit breaker for repeated failures. Register it via `IHttpClientFactory`/`AddResilienceHandler`, not ad-hoc loops in business code.
- Keep retry and circuit-breaker configuration in one DI registration location.
- Log a warning on each retry with the attempt count; log an error once retries are exhausted.
- Propagate `CancellationToken` so retries respect cancellation.

## Avoid

- Manual retry loops with `Thread.Sleep` or scattered `Task.Delay` in business logic.
- Retrying non-idempotent operations without considering duplicate side effects; see [[Dotnet Patterns/Caching and Idempotency]].

```csharp
services.AddHttpClient<IPdfExportClient, PdfExportClient>()
    .AddResilienceHandler("pdf-export-retry", builder =>
        builder.AddRetry(new() { MaxRetryAttempts = 3, BackoffType = DelayBackoffType.Exponential }));
```
