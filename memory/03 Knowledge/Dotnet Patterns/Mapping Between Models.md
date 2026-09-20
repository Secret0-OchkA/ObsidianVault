---
type: knowledge
status: active
tags:
  - dotnet
  - csharp
  - pattern
  - mapping
source: user-level .copilot skill reference
template_version: 2
confidence: medium
review_status: reviewed
---

# Mapping Between Models

**Context:** converting between DTO, domain, and persistence representations of the same data.

## Pattern

- Prefer explicit pure mapping functions or extension methods over reflection-based mappers, unless the project already has AutoMapper/Mapster wired in.
- Keep mapping functions free of side effects and easy to unit test in isolation.
- Use one mapping direction per method; do not overload a method for multiple source/target shapes.

## Avoid

- Introducing a mapping library for a single feature when the project does not already use one.
- Putting mapping logic inline inside orchestration methods; extract it for independent testing.
