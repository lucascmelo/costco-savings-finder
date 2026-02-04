# context-read-latest: read latest context first

## Intent
Ensure all work starts with complete understanding of current project state.

## When this applies
- Every activation of this skill.
- Before any analysis or planning.
- Before proposing new work.

## Prohibited
- Proceeding without reading the most recent migration file.
- Making assumptions about project state without context.
- Starting work based on outdated information.

## Required
- Always read the most recent /project/*.md file first.
- If no files exist, stop and ask user to create the first migration.
- Never proceed without understanding current state.

## Implementation recipe
1. List all /project/*.md files sorted by date.
2. Select the most recent file by filename date.
3. Read and extract: epics, tasks, decisions, constraints.
4. Use this context for all subsequent planning.

## Verification
- Most recent migration file has been read.
- Context summary includes current epics, tasks, decisions.
- No work proceeds without this context.
