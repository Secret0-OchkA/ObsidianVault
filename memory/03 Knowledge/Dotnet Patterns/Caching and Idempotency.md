---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - pattern
  - caching
  - idempotency
source: user-level .copilot skill reference
template_version: 2
confidence: medium
review_status: reviewed
---

# Caching & Idempotency

**Context:** avoiding repeated expensive work, or making an operation safe to run or retry more than once.

## Pattern

- For idempotency, key the operation on a stable identifier such as request id or document id plus version. Use check-before-act, or a unique constraint/upsert at the storage layer instead of read-then-write races.
- For caching, cache at the boundary (`IMemoryCache`/distributed cache) around the expensive or external call, not inside business logic.
- Make cache keys explicit and include everything that affects the result.
- Set an explicit expiration; do not cache indefinitely by default.

## Avoid

- Relying on an operation probably not being called twice for retries or queues; assume at-least-once delivery.
- Caching mutable state without a clear invalidation path.
