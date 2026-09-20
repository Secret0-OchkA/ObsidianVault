---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - pattern
  - result
source: user-level .copilot skill reference
template_version: 2
confidence: medium
review_status: reviewed
---

# Result Chaining (Railway-Oriented Programming)

**Context:** an operation has sequential steps where any step can fail and nested conditionals become difficult to follow.

## Pattern

- Use `CSharpFunctionalExtensions` `Result`/`Result<T>` with `.Bind()`, `.Map()`, `.Tap()`, and `.Ensure()`.
- Keep each step small with one responsibility; the orchestration method should read as a top-to-bottom pipeline.
- Reserve exceptions for exceptional or unexpected failures, not expected business outcomes.

## Avoid

- Deep nested `if (result.IsSuccess)` chains; use `.Bind()` and `.Map()`.
- Swallowing failure reasons; propagate `Result.Error` to the caller or response.

```csharp
public async Task<Result<OrderResponse>> PlaceOrderAsync(PlaceOrderRequest request) =>
    await Validate(request)
        .Bind(_ => LoadCustomer(request.CustomerId))
        .Bind(customer => ReserveStock(customer, request.Items))
        .Map(reservation => new OrderResponse(reservation.OrderId));
```
