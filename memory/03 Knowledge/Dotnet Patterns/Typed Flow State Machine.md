---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - pattern
  - state-machine
source: user-level .copilot skill reference
template_version: 2
confidence: medium
review_status: reviewed
---

# Typed Flow State Machine

Refactor a C# orchestration flow, Saga, workflow, or Orleans Flow Grain toward typed state with state-specific data and explicit transitions.

## Core Pattern

```csharp
internal interface BulkDownloadState;

internal sealed record Init(...) : BulkDownloadState;
internal sealed record BuildingZip(...) : BulkDownloadState;
internal sealed record Completed(...) : BulkDownloadState;
internal sealed record Failed(string Reason) : BulkDownloadState;
```

Keep related variants together when useful. Prefer concise names because the qualified form provides context.

## Goals

- Make invalid stage/data combinations unrepresentable where practical.
- Remove an independent mutable stage enum when runtime type can be the source of truth.
- Make the transition graph visible and reviewable.
- Keep workflow entry points thin: receive an event, delegate state-specific transition logic, persist the result, and perform required external effects.
- Keep pure transition decisions separate from I/O, logging, messaging, and persistence.
- Define duplicate, delayed, unsupported, and out-of-order event behavior explicitly.

## Required Process

1. Read current state, events, entry points, persistence configuration, serializer conventions, and nearby tests.
2. List meaningful states and their data; remove invalid fields from each state.
3. Describe the transition map, including self-transitions, terminal states, failures, retries, duplicates, and restart/resume behavior.
4. Choose base abstraction and mutability for actual framework constraints; preserve Orleans serialization and rehydration requirements.
5. Implement the smallest coherent refactor and preserve public contracts and observable behavior.
6. Add focused tests for construction, transitions, rejected/ignored events, terminal behavior, and persistence compatibility.
7. Run the narrowest relevant tests or build validation.

## Design Rules

- Do not keep both a stage enum and a state-variant type as independent sources of truth unless a framework boundary requires it.
- Do not put every possible field on a universal state object.
- Keep the transition graph in a focused transition function, state-specific methods, or a small state-machine component.
- Do not put dependency calls inside pure transition logic.
- Handle unsupported variants and impossible transitions deliberately according to contract and retry semantics.
- Preserve idempotency and Orleans concurrency assumptions; consider ordering of external effects and state persistence.
- Consider persisted-state versioning and migration before changing serialized shape.
- Keep the abstraction local; do not introduce a generic framework unless already used or genuinely needed.
