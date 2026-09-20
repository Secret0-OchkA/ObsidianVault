---
type: knowledge
status: developed
template_version: 2
updated: 2026-09-15
tags:
  - knowledge
  - dotnet
  - build
source: "Engineering note: building .NET projects without Aspire"
confidence: high
review_status: reviewed
---
# Build .NET Projects Without Aspire

When group policy errors block `Aspire.RuntimeIdentifier.Tool` during a build, build the .NET solution while excluding Aspire-dependent projects.

## Problem

```text
error Failed to run Aspire.RuntimeIdentifier.Tool. Exit code: 1.
Output: This program is blocked by group policy.
```

## Quick Solution: Build Individual Projects

```bash
dotnet build "EDMS.DataAccess/EDMS.DataAccess.csproj"
dotnet build "EDMS.DomainModel/EDMS.DomainModel.csproj"
dotnet build "EDMS.Caching/EDMS.Caching.csproj"
dotnet build "EDMS.ApplicationServices/EDMS.ApplicationServices.csproj"
dotnet build "EDMS.InfrastructureServices/EDMS.InfrastructureServices.csproj"
```

## Build Application and Service Projects

```powershell
dotnet build "EDMS.API/EDMS.API.csproj"
dotnet build "EDMS.ApplicationServices/EDMS.ApplicationServices.csproj"
dotnet build "EDMS.Outbox.Service/EDMS.Outbox.Service.csproj"
dotnet build "EDMS.Service/EDMS.Service.csproj"
dotnet build "EDMS.UnitTests/EDMS.UnitTests.csproj"
```

## Run Tests Without Building

```bash
dotnet test "EDMS.UnitTests/EDMS.UnitTests.csproj" --no-build
```

## Known Issues

- `EDMS.AppHost` has a hard Aspire dependency and must be excluded from CLI builds without Aspire.
- `EDMS.ServiceDefaults` has Aspire dependencies and must be excluded from regular builds.
- `EDMS.DB` SQL projects require Visual Studio or SSDT tools because `Microsoft.Data.Tools.Schema.SqlTasks.targets` may be unavailable.
- Missing analyzer DLLs can often be fixed with `dotnet nuget locals all --clear` followed by `dotnet restore --force-evaluate`.
- If `IConfiguration.GetValue` is missing in `EDMS.InfrastructureServices`, add `using Microsoft.Extensions.Configuration;`.

## Verification

A successful build reports `Build succeeded`.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]
