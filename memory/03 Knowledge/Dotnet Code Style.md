---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - code-style
  - knowledge
source: user-level .copilot skill dotnet-code-style
template_version: 2
confidence: medium
review_status: reviewed
---

# .NET Code Style

Good/bad examples per situation, for `Balanced Functional Coder .NET` and anyone reviewing its output. This is about naming/formatting/idiom choices; for which pattern to implement a situation with (validation, resilience, mapping, etc.), see [[Dotnet Pattern Playbook]].

## General Philosophy

- Code should read close to declarative: express intent, not a sequence of technical steps.
- Prefer explicit dependencies; minimize hidden/shared state (no mutable statics, no globals, no hidden dependencies).
- Default to immutable data; introduce mutation only when it earns its keep.
- Don't create an abstraction without a real, current need for it.
- Prefer simple, readable solutions over premature optimization.
- Use modern C# features to make code more expressive, not just to look current.

## Models = `record` by Default

```csharp
public record CreateUserRequest(string Name, string Email, string PhoneNumber);
public record UserResponseModel(int Id, string Name, string Email, DateTime CreatedAt);
```

- Always use `record` for data models, DTOs, request/response objects, domain models, and view models.
- Use positional constructor syntax.
- Use `class` for a model only when it has complex behavior, needs inheritance, or needs mutable state.
- Collections in records: use `ICollection<T>` when mutable collections are needed.
- Choose the shape by what the type is: `record` for DTOs/messages/contracts/immutable models; `class` for lifecycle, mutable state, or entities; `struct`/`record struct` only when value semantics, memory optimization, or no heap allocation are specifically needed.

## Services = Primary Constructors by Default

```csharp
public class UserCommandService(
    IUserRepository userRepository,
    IEmailService emailService,
    ILogger<UserCommandService> logger) : IUserCommandService
{
    public async Task<int> CreateUserAsync(CreateUserRequest request)
    {
        logger.LogInformation("Creating user: {Email}", request.Email);
        var user = new User(request.Name, request.Email);

        var result = await userRepository.CreateAsync(user);
        await emailService.SendWelcomeAsync(request.Email);

        return result;
    }
}
```

- Use primary constructors for DI-driven classes.
- Access dependencies directly by parameter name; do not add `_field` prefixes.
- Use one parameter per line when the declaration is longer than 80 characters.

## Meaningful Return Values

- Prefer returning a meaningful result from operations with an observable outcome.
- For database mutations, return affected row count, the created/updated entity, or a status/result.
- `Task`/`void` is acceptable for inherently fire-and-forget operations.

```csharp
public Task<int> DeleteExpiredSessionsAsync(CancellationToken cancellationToken) =>
    dbContext.Sessions
        .Where(session => session.ExpiresAt < clock.UtcNow)
        .ExecuteDeleteAsync(cancellationToken);
```

## No Abbreviations or Shortening

- Use full descriptive names.
- `Id` and `Dto` are acceptable; do not shorten other names.

```csharp
public record DocumentTypePoliciesAndApplicationsResponse(...);
public class DocumentTypePoliciesCommandService(...) { }
public interface IDocumentTypePermissionValidator { }
```

## Comments

- Do not write comments or XML docs by default; express intent through names, types, and focused methods.
- Add a short comment only when the code cannot express a non-obvious constraint.
- Never describe the change itself or restate the next line.
- Do not add comments/docs to code that was not changed.

## `var` vs Explicit Type

- Use `var` by default.
- Use an explicit type when it materially improves readability or communicates a contract.

```csharp
var user = new User(request.Name, request.Email);
var users = await userRepository.GetActiveUsersAsync();
IReadOnlyList<UserResponse> responses = users.Select(user => user.ToResponse()).ToList();
decimal totalPrice = CalculateTotal(items);
```

## Null Checks: Exceptions vs `Result`

- Prefer explicit `if (x is null)` checks.
- Do not add null checks for non-nullable values whose contract guarantees presence.
- Use exceptions for violations of implicit invariants and infrastructure contracts.
- Use `Result` for expected business outcomes.
- Use early `return` for normal control flow.
- Follow an existing project-wide `Result` pattern instead of throwing for normal business outcomes.

```csharp
if (configuration.ConnectionString is null)
    throw new InvalidOperationException("ConnectionString must be configured.");

public Result<Discount> CalculateDiscount(Customer customer)
{
    if (customer.Age < 18)
        return Result.Failure<Discount>("Customer must be 18 or older to receive this discount.");

    return Result.Success(new Discount(...));
}
```

## LINQ vs `foreach`

- Prefer LINQ for simple declarative transformation, filtering, and grouping.
- Tuples are fine for a few related values.
- Prefer `foreach` when there is significant branching, sequential action, early `continue`/`break`, state accumulation, or external mutation.
- Do not force a complex algorithm into nested LINQ.
- Do not extract logic only to preserve a LINQ chain when it depends tightly on local state.

```csharp
var activeUserEmails = users
    .Where(user => user.IsActive)
    .Select(user => user.Email)
    .ToList();

static (int Count, decimal Total) Summarize(IEnumerable<Order> orders) =>
    (orders.Count(), orders.Sum(order => order.Total));
```

## `switch` Expressions / Pattern Matching vs `if`

- Use a `switch` expression for selecting a value/result from input data, especially routing.
- Use pattern matching when branching depends on type, shape, or properties.
- Use `if`/`else` for sequential, dependent business rules.
- Avoid classic `switch` statements unless imperative control flow makes them necessary.
- Do not turn a simple `if` into a `switch` expression just to look modern.

```csharp
string DescribeStatus(OrderStatus status) => status switch
{
    OrderStatus.Pending => "Waiting for confirmation",
    OrderStatus.Shipped => "On its way",
    OrderStatus.Delivered => "Completed",
    _ => throw new ArgumentOutOfRangeException(nameof(status))
};

Task HandleAsync(ICommand command) => command switch
{
    CreateOrderCommand create => HandleCreateAsync(create),
    CancelOrderCommand cancel => HandleCancelAsync(cancel),
    _ => throw new NotSupportedException($"Unsupported command: {command.GetType().Name}")
};
```

## String Building

- Default to string interpolation for a small number of parts.
- Use `StringBuilder` for repeated appends, large generated text, or a measured hot path.
- Concatenation is acceptable only when a very simple expression reads better.
- Do not reach for `StringBuilder` prematurely.

```csharp
var message = $"User {user.Name} ({user.Email}) created at {user.CreatedAt:u}";

var builder = new StringBuilder();
foreach (var line in lines)
    builder.AppendLine(line);
var report = builder.ToString();
```

## Reducing Nested Conditionals

- Flatten deep conditionals with early exits when semantics are preserved.
- Do not flatten when side-effect order or required execution would change.

```csharp
public Result ProcessOrder(Order order)
{
    if (order is null) return Result.Failure("Order is required.");
    if (!order.IsPaid) return Result.Failure("Order must be paid.");
    if (order.Items.Count == 0) return Result.Failure("Order has no items.");

    return Ship(order);
}
```

## Nullable Reference Types

- Use NRTs to describe the real contract: `string?` means genuinely absent; `string` means required.
- Prefer non-nullable types, defaults, or `required` properties when absence has no valid meaning.
- Do not use `?` only to silence a warning.
- Avoid propagating nullable values across layers when null is not part of the contract.
- Use `!` sparingly and only for a genuine compiler inference gap.
- Prefer built-in nullable references over introducing an `Option<T>` unless the project already uses it pervasively.

```csharp
public record UserProfile(string Name, string? MiddleName);

public record CreateUserRequest
{
    public required string Email { get; init; }
}
```

## Make Invalid States Unrepresentable

- Prefer designs where invalid states cannot be constructed.
- Use `required`, non-nullable types, constructors enforcing invariants, and specialized value types instead of repeating checks at every call site.

```csharp
public record ShippingAddress(string Street, string City, string PostalCode);
```

## Immutability

- Default to immutable data.
- Mutation is acceptable for a simpler algorithm, a required EF Core tracked entity, or a measured hot-path benefit.
- Never allow an object to exist in a partially invalid state.

## File Organization

- Do not apply one-type-per-file mechanically.
- Group small, closely related models, DTOs, interfaces, or helpers when it improves navigation.
- Do not create a separate file for a one-line model used by one service.
- Optimize file structure for navigation, not file count.

## Code Order Within a File

Organize dependencies top to bottom:

1. Constants and data types
2. Contracts
3. Public API
4. Main logic
5. Implementation details
6. Helper methods

## Method Decomposition

- Do not extract only to reduce line count.
- Extract when a standalone concept emerges, logic deserves its own name, reuse is needed, or the main algorithm becomes easier to follow.
- Avoid wrapper methods that add no meaning.

## Local Functions vs Private Methods

- Use a local function for small logic belonging to one method and relying on local context.
- Use a private/internal method for self-contained logic with meaning outside the current algorithm.

## Static Functions

- If a function does not depend on instance state, prefer `static`.
- For internal helper functions tested directly, prefer `internal static` with `InternalsVisibleTo` over making them public only for tests.

## Interfaces

- Do not create an interface ahead of time.
- Introduce one for multiple real implementations, a genuine architectural boundary, an external contract, or a dependency that must be substituted in tests.
- Do not create an interface only for a theoretical future swap.

## Async / CancellationToken

- Never block on async code with `.Result` or `.Wait()`.
- Do not use `Task.Run` for I/O-bound operations.
- Propagate `CancellationToken` through the entire async call chain.
- Long-running operations must support cancellation.

## Exception Handling

- Catch only when the exception can be handled, enriched with meaningful context, or translated at this layer.
- Never use a bare catch/rethrow with no added logic.

## Dependency Injection

- Use DI for infrastructure dependencies, external services, lifecycle objects, and configuration.
- Construct small stateless objects, value objects, and simple data structures directly.
- Do not use DI as a substitute for plain object construction.

## Avoid Catch-All Classes

- Avoid classes named `Utils`, `Helpers`, `Common`, or `GeneralExtensions`.
- Keep code next to its area of responsibility instead of creating shared dumping grounds.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]
