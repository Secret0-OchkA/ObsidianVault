---
type: knowledge
status: developed
created: 2026-09-15
updated: 2026-09-15
tags:
  - knowledge
  - topic/agents
  - topic/testing
template_version: 2
source: .github/skills/project-quality/SKILL.md
confidence: medium
review_status: reconstructed
---

# Project Quality

Use this workflow for coverage, mutation testing, build warnings, and test-quality reports. Keep generated artifacts under the project's `TestsReport/` directory.

## Ask first

Offer `Coverage`, `Mutation`, `Warnings`, or `All`. For mutation, ask whether the user wants one project or the supported full set. Do not silently broaden a narrowed request.

## Coverage

The project script uses `dotnet-coverage`, not coverlet, and emits Cobertura XML, HTML, and JSON with line, branch, and method percentages. Confirm the .NET SDK and required tools before running. Diagnose missing reports by checking the coverage process, settings root, include patterns, and test build.

## Mutation

Use the repository's Stryker script and configuration. Record killed, survived, timeout, and no-coverage mutations. Treat survived mutations as test gaps. Respect project exclusions and runner requirements, especially xUnit v3/Microsoft Testing Platform configurations.

## Warnings

Run the repository warning collector, which should preserve project, code, file, line, column, message, timestamp, and build command in JSON. Review excluded noise separately from actionable compiler and analyzer warnings. Update the project's warning documentation after review.

## All

Run sequentially: coverage, mutation, warnings. Print every report path and preserve command exit codes. Do not claim a quality check passed without reading the generated result.

## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Agent Knowledge]]
- [[06 Hubs/Hub - Knowledge]]

## Test run logs

For every test run, write the complete output to a timestamped log file. The log must make it possible to see which tests passed, when they completed, which tests failed, and which warnings were emitted. Preserve the process exit code in the same log and report the log path with the result.

Use the repository's native test command and redirect both standard output and standard error to the log. Add an explicit exit-code marker after the command completes, for example `FULL_TEST_EXIT_CODE=<code>`. Do not claim that tests passed from compilation or discovery alone; verify the final test summary and exit code in the log.

For long-running full suites, start the command asynchronously after telling the user that the run has started and where the log will be written. Inspect the log only after the process has completed; if no final summary or exit-code marker exists, report the run as incomplete.
