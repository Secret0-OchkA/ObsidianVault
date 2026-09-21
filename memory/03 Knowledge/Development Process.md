---
type: knowledge
status: developed
created: 2026-09-15
updated: 2026-09-21
tags:
  - knowledge
  - topic/agents
  - topic/planning
template_version: 2
source: Obsidian agent knowledge documentation
confidence: medium
review_status: reconstructed
---

# Development Process

Use the smallest process that still gives reliable evidence.

## Small task

For a local, well-defined change:

1. Identify the concrete file, symbol, failing behavior, or test.
2. Read only enough nearby code to form one falsifiable hypothesis.
3. Make the smallest reversible edit.
4. Run the cheapest focused validation immediately.
5. Repair the same slice and rerun the check if it fails.
6. Finish with an executable validation and report residual risk.

## Large or unclear task

Use the expanded process for cross-module changes, API or database contracts, integrations, deployment, security, concurrency, reliability, performance, observability, or unclear requirements:

1. Read project instructions and relevant documentation.
2. Analyze requirements and affected layers.
3. Propose exact files, edits, tests, and documentation changes.
4. Wait for explicit approval before delegation when the task requires a plan.
5. Delegate to the owning specialist with build and test requirements.
6. Review the result, run tests, and validate the live integration when applicable.
7. Report completed checks, failures, open questions, and residual risk.

## Standard loop

`Coder -> Review -> Tests -> Done`

Do not claim completion without the result of the relevant build, test, lint, review, or runtime check. Never commit or create a branch without explicit user approval.

#### Long-running validation

Full relevant test suites are completion gates for development tasks unless the user explicitly narrows the scope.

1. Run the full relevant suite after focused checks. A build or focused test run is evidence for that slice only, not evidence that all tests pass.
2. Distinguish `passed`, `failed`, `timed out`, `stopped`, and `not run` in the final report. Never summarize a stopped or incomplete run as passing.
3. For suites that may outlive the current turn, tell the user that the run is still in progress and ask them to ping the agent when it finishes so the existing terminal result can be inspected. Do not restart the suite without checking the existing run.
4. When the suite completes, report exact totals and the failing test names. When it hangs or fails, leave the task open, record the blocker and next action, and only close after the relevant failure is investigated or explicitly accepted by the user.
5. Keep focused checks as fast feedback, but do not substitute them for the full suite without an explicit scope decision.

6. When a long-running test is delegated to a terminal or background process and the user is asked to ping the agent later, redirect stdout/stderr to a durable workspace log or test-results file before starting. Record the exact command, start time, process identifier when available, and output path. On resume, inspect that log and process state first; report the recorded result or failure and do not rerun merely because the conversation resumed.

When the user asks for a commit message and description but explicitly says not to commit, provide the text in the chat only. Do not write it to `COMMITMESSAGE`, `COMMIT_EDITMSG`, Git metadata, or any other file.
## Hubs

<!-- Auto-managed by Auto Hub Links -->
- [[06 Hubs/Hub - Планирование]]
- [[06 Hubs/Hub - Knowledge]]

## Feedback loop

Feedback is part of the development process, not only a final chat message.

1. Before a consequential edit, the active agent states the working assumption and one focused check that could disconfirm it.
2. After the first correction, the agent updates the local task context. After the second correction in the same direction, it pauses and names the missing assumption.
3. When Obsidian is available, record the observation with [[_Templates/Agent Feedback]] using the original wording and evidence. Mark it `raw` or `proposed` until reviewed.
4. Classify the result as task context, session context, user preference, repository documentation, reusable knowledge, issue, or no action.
5. Only the supervising agent promotes a sub-agent observation into canonical process knowledge, documentation, or a global preference.

### Delegated feedback contract

The chain `sub-agent -> supervising agent -> human` follows this order:

- The sub-agent returns status, scope, assumptions, evidence, uncertainties, risks, and a recommendation.
- The supervising agent checks the report against the task contract and executable evidence. It may reject unsupported conclusions, continue the work, or combine several observations into one question.
- The human is asked only when the supervising agent cannot resolve a material ambiguity from the available sources.
- Review and test agents report findings to the supervising agent in the same format. Their findings are evidence, not automatic requirement changes.
- A sub-agent must not silently edit global instructions or promote its own observation to reusable knowledge.

This keeps delegation efficient while preserving one accountable decision point and a traceable path from correction to documented knowledge.
