---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - pattern
  - discriminated-union
source: user-level .copilot skill reference
template_version: 2
confidence: medium
review_status: reviewed
---

# C# Discriminated Union

Model a small fixed or framework-constrained family of alternative C# values with a shared union contract and type-safe pattern matching.

## Core Pattern

Keep the union contract and variants together when that improves discoverability:

```csharp
internal interface DocumentResult
{
    sealed record Success(Document Document) : DocumentResult;
    sealed record NotFound(Guid DocumentId) : DocumentResult;
    sealed record Failure(string Reason) : DocumentResult;
}
```

Use concise variant names because the qualified form provides context: `DocumentResult.Success`, `DocumentResult.NotFound`, and `DocumentResult.Failure`.

The union pattern does not require one specific base declaration:

- use an `interface` when serializers, Orleans, ORM, or another framework require it, or implementations must remain extensible;
- use an `abstract class` when variants need shared behavior, reference identity, or a common mutable base;
- use an `abstract record` or records when value semantics and immutable data are appropriate;
- use ordinary classes when framework construction, mutability, or lifecycle requirements make them correct.

Do not select `abstract record` merely to imitate F#. Select the base abstraction from the actual contract and infrastructure constraints.

## Design Rules

- Each variant contains only data meaningful for that alternative.
- Prefer immutable variants for results, commands, messages, and decisions when the framework supports that shape.
- Keep variants sealed when the family is intended to be closed at that level.
- Treat an interface hierarchy as open unless the repository or framework constrains implementations.
- For open hierarchies, keep a defensive default branch and decide whether an unknown variant is ignored, rejected, or fails fast.
- Do not add a discriminator enum when runtime type is already the discriminator. Keep required external enum/string conversion at the serialization/API boundary.
- Add shared fields to the base type only when genuinely valid for every variant.
- Keep pure local behavior near the union; keep I/O, logging, persistence, and other side effects outside the value model.

```csharp
return result switch
{
    DocumentResult.Success success => Handle(success.Document),
    DocumentResult.NotFound notFound => HandleMissing(notFound.DocumentId),
    DocumentResult.Failure failure => HandleFailure(failure.Reason),
    _ => throw new InvalidOperationException($"Unsupported result type: {result.GetType().Name}")
};
```

## Framework and Compatibility Checks

Before changing an existing model, inspect construction, serialization, persistence, and consumers. Confirm serializer support for interfaces, nested types, records, private constructors, and polymorphism. Follow repository conventions for derived-type registration, preserve public contracts and wire-format discriminators, consider versioning and old persisted values, and avoid adding a custom union framework when a small local hierarchy is sufficient.

If a framework requires a non-ideal shape, keep the union concept but adapt the representation and explain the tradeoff.

## When Not To Use It

Keep a simple class, record, enum, or tuple when there is one meaningful shape, alternatives do not have different invariants or behavior, the hierarchy adds ceremony, or an existing framework contract already defines the alternatives clearly.

## Required Process

1. Identify alternatives and the invariant distinguishing them.
2. Inspect construction, serialization, persistence, and call-site conventions.
3. Choose base abstraction and mutability for those constraints.
4. Co-locate variants when useful and use concise context-aware names.
5. Update consumers with type patterns and deliberate unknown-variant handling.
6. Add focused tests for every variant and relevant matching branch.
7. Run the narrowest available build or test validation.
