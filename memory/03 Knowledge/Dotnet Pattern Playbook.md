---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - patterns
  - knowledge
source: user-level .copilot skill dotnet-pattern-playbook
template_version: 2
confidence: medium
review_status: reviewed
---

# .NET Pattern Playbook

Индекс common implementation situations для .NET/C#. Читай только одну reference-заметку, которая соответствует текущему шагу; не загружай весь каталог для одной задачи.

| Situation | Reference |
|---|---|
| Modeling alternative values with different data or invariants as one type family | [[Dotnet Patterns/CSharp Discriminated Union]] |
| Grouping cohesive stateless functions, constants, types, or transformations around one concept | [[Dotnet Patterns/CSharp Module Pattern]] |
| Modeling a workflow, Saga, or Orleans Flow Grain with stage-specific data and explicit transitions | [[Dotnet Patterns/Typed Flow State Machine]] |
| Validating input/business rules before a state change | [[Dotnet Patterns/Validation]] |
| Multi-step operation with branching success/failure outcomes | [[Dotnet Patterns/Result Chaining]] |
| Calling an external HTTP/gRPC/queue dependency that can fail transiently | [[Dotnet Patterns/External Calls and Resilience]] |
| Mapping between DTO / domain / persistence models | [[Dotnet Patterns/Mapping Between Models]] |
| Long-running or background processing | [[Dotnet Patterns/Background Processing]] |
| Caching a value, or making an operation safe to run more than once | [[Dotnet Patterns/Caching and Idempotency]] |

## How to Use This

1. Match the current step to at most one row above. A step may match none; fall back to [[Dotnet Code Style]].
2. Read only that one reference note.
3. Apply the pattern it describes.
4. If it conflicts with conventions established in the repository, follow the repository convention instead of introducing a competing style for one feature.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]
