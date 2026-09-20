---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - pattern
  - validation
source: user-level .copilot skill reference
template_version: 2
confidence: medium
review_status: reviewed
---

# Validation

**Context:** input needs checking before a state change or side effect.

## Pattern

- Extract validation into a pure function or method returning `Result`/`Result<T>` from `CSharpFunctionalExtensions`.
- The orchestration method validates first, short-circuits on failure, and only then performs side effects.
- Combine multiple independent rules with `Result.Combine` or a small validation type instead of nested `if` chains.

## Avoid

- Throwing exceptions for expected or user-facing validation failures.
- Mixing validation checks with side effects in the same method body.

```csharp
static Result Validate(CreateUserRequest request) =>
    Result.FailureIf(string.IsNullOrWhiteSpace(request.Email), "Email is required");

public async Task<Result<int>> CreateUserAsync(CreateUserRequest request)
{
    var validation = Validate(request);
    if (validation.IsFailure) return Result.Failure<int>(validation.Error);

    return await userRepository.CreateAsync(new User(request.Name, request.Email));
}
```
