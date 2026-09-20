# Obsidian Memory Policy

Use the three-level memory model consistently:

- **Hot**: the current chat and temporary working context.
- **Medium**: current project documentation and repository knowledge needed during development.
- **Cold**: long-term knowledge in Obsidian, including durable project history, reusable decisions, and rarely needed reference material.

Obsidian is not an automatic age-based archive. Do not move a note merely because it has not been edited recently.

## Before Any Obsidian Write

Before writing to the Obsidian vault, read this policy, then read `00 System/AI Instructions.md` and the smallest relevant set of linked notes. Search for an existing note before proposing or creating one.

## Write Permissions

- Reading relevant Obsidian notes is allowed when it helps with the task.
- Clarifying or correcting an existing note is allowed when the information is verified by the current task, repository, or an authoritative source. Preserve the note's structure and meaning; do not turn an assumption into a fact.
- If the knowledge is incomplete, make the uncertainty explicit with `Open questions`, `Assumptions`, or `Confidence` instead of silently inventing details.
- A new Obsidian note requires the user's approval first, unless the current user request or an explicit delegated instruction says that the agent may create notes without asking.
- Moving, archiving, renaming, or deleting a note always requires explicit user approval. Never automate these actions by note age.
- When a new note is not necessary, prefer improving the relevant existing note rather than creating another one.
- Keep project-specific knowledge in the appropriate project area and reusable knowledge in the shared knowledge area. Do not flatten unrelated notes into one archive.

## Documentation Boundaries

- Update repository or project documentation when the task explicitly includes documentation, or when the documentation change is a direct and verified part of the implementation.
- Do not copy temporary chat context into project documentation or Obsidian just because it exists.
- When an agent notices that a durable piece of knowledge is unclear, it may sharpen the wording of an existing relevant note if the facts are supported. If a new note would be needed, ask before creating it.
- Keep confidential source material out of notes unless the user explicitly authorizes its use and the destination policy permits it.

## Write Procedure

1. Read this policy and the relevant system/project notes.
2. Search for an existing note and identify the correct memory layer and location.
3. Prefer a small edit to an existing note over a new note.
4. Preserve links, headings, frontmatter, and local conventions.
5. State what was changed and distinguish verified facts from assumptions.
6. If permission to create a new note is missing, stop and ask one focused question before writing.
