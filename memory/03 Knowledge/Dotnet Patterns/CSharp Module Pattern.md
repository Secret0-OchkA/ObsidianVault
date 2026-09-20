---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - pattern
  - module
source: user-level .copilot skill reference
template_version: 2
confidence: medium
review_status: reviewed
---

# C# Module Pattern

A C# module is a design concept, not one mandatory language construct. It groups related declarations and gives them a discoverable qualified name without creating an object merely to hold stateless behavior.

## Core Pattern

```csharp
internal static class DocumentResult
{
    internal interface Value;

    internal sealed record Success(Document Document) : Value;
    internal sealed record NotFound(Guid DocumentId) : Value;
    internal sealed record Failure(string Reason) : Value;

    internal static bool IsSuccess(Value result) => result is Success;

    internal static string ToMessage(Value result) => result switch
    {
        Success => "Document found",
        NotFound notFound => $"Document {notFound.DocumentId} not found",
        Failure failure => failure.Reason,
        _ => throw new InvalidOperationException($"Unsupported result type: {result.GetType().Name}")
    };
}
```

Use the qualified name at call sites: `DocumentResult.IsSuccess(result)` and `DocumentResult.Success`.

## Choosing the Representation

- use an `internal static class` for related pure functions, constants, nested types, or small stateless transformations;
- use a namespace plus focused types when the module needs several files or independent declarations;
- use extension methods when behavior naturally reads as behavior of the receiver;
- use a private/internal helper type for implementation details;
- use a normal service when operations need dependencies, lifecycle, configuration, I/O, or mutable state;
- use a nested union hierarchy when keeping alternatives and local operations together improves discoverability.

Do not use a static class to hide dependency-driven behavior. Repositories, clocks, network clients, configuration, and logging normally belong to an injected service or explicit function parameters.

## Module Rules

- Keep the module cohesive around one concept; do not create generic `Helpers`, `Utils`, or `Common` buckets.
- Prefer stateless deterministic functions with explicit inputs and outputs.
- Keep side effects at the boundary; pure transformations may live in the module.
- Keep visibility minimal: prefer `private`, then `internal`, then `public` only for a real API.
- Use concise names because the module name provides context.
- Keep related constants, parsers, constructors, predicates, mapping, and formatting together when they form one vocabulary.
- Avoid mutable static state; if state is required, make ownership and concurrency explicit.
- Do not create an instance only to call a stateless method.
- Do not use extension methods only to make unrelated functions shorter.
- Do not force all operations into one file; use a namespace when the module grows beyond one cohesive unit.
- Do not introduce a module abstraction when a normal private function is clearer.

## Dependency Boundary

Before extracting a static module, inspect DI services, repositories, current time, random values, ambient context, configuration, logging, persistence, external APIs, and mutable shared state. Pass stable data as explicit parameters. Keep dependency access outside pure functions; use a service when a dependency is intrinsic.

## Required Process

1. Identify the concept and declarations that genuinely belong together.
2. Separate pure operations from dependency-driven side effects.
3. Choose `static class`, namespace, extension methods, helper type, or service based on the boundary.
4. Keep names concise and qualified by the module concept.
5. Preserve public contracts and framework requirements.
6. Add focused tests for pure functions; test orchestration at its boundary.
7. Run the narrowest build or test validation.
