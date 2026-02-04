---
name: project-task-migrations
description: Agent guidance for applying the project-task-migrations creation skill.
---

# Project Task Migrations - Agent Rules

This file is canonical.
Follow it when using this skill.
Do not guess around these rules.

## Re-sync requirement
On activation:
- Re-read these sections:
  - Construction workflow
  - Output contract
  - Failure conditions
- Use rules/ for detail when needed.
- Use references/ for examples when needed.

Before final output:
- Check failure conditions.
- If any failure condition applies, stop and redesign.

## Table of contents
1. Construction workflow (mandatory)
2. Output contract (mandatory)
3. Rules (compiled)
4. Failure conditions (mandatory)
5. Reference index

---

## 1. Construction workflow (mandatory)

Follow this order. Do not skip steps.
Never implement before step 5 is complete.

1. Load most recent /project/*.md file
   - Read the latest migration file by date.
   - If no files exist, stop and ask user to create the first migration.

2. Summarize current state
   - Extract active epics and their status.
   - List open tasks and any blockers.
   - Identify recent decisions and constraints.

3. Propose migration file name
   - Use format YYYY-MM-DD-topic.md.
   - Ensure topic reflects the primary work scope.
   - Check for conflicts with existing files.

4. Draft migration content
   - Include context section referencing previous work.
   - Define epics, tasks, and subtasks with checkboxes.
   - Include decisions and notes sections.

5. Request explicit confirmation
   - Present context summary.
   - Show proposed file name and content.
   - Wait for explicit user approval.

6. Implement only after confirmation
   - Create the migration file.
   - Execute the planned work.
   - Update checkboxes as tasks complete.

**Confirmation requirement**: Always present context summary and request explicit approval before implementation. Never proceed without user confirmation.

---

## 2. Output contract (mandatory)

When using this skill, output in this order:

1. Context summary
   - Current epics and status
   - Open tasks and blockers
   - Recent decisions and constraints

2. Proposed migration file
   - File name (YYYY-MM-DD-topic.md)
   - Draft content with context, epics, tasks, decisions

3. Implementation plan
   - Sequence of work to be performed
   - Dependencies and blockers

4. Confirmation request
   - Explicit user approval required before proceeding

Do not proceed to implementation before step 4 is confirmed.

---

## 3. Rules (compiled)

Read the corresponding files in rules/ for the source.

### Core workflow rules

#### Rule: Read latest context first
Source: rules/context-read-latest.md

- Always read the most recent /project/*.md file first.
- If no files exist, stop and ask user to create the first migration.
- Never proceed without understanding current state.

#### Rule: History is immutable
Source: rules/history-immutable.md

- Never edit past migration files.
- Never delete lines, tasks, or decisions from history.
- Preserve complete chronological record.

#### Rule: Forward-only writes
Source: rules/forward-only-writes.md

- All new work is recorded via new /project/YYYY-MM-DD-topic.md files.
- Or append to current-day file only.
- Never modify historical content.

### Quality assurance rules

#### Rule: Close-out updates only
Source: rules/close-out-updates.md

- On completion, only update checkboxes.
- Append discoveries/decisions as new lines.
- Do not rewrite existing text.

#### Rule: Stop when unclear
Source: rules/stop-when-unclear.md

- If context is missing, unclear, or outdated, stop and ask for clarification.
- Do not make assumptions about project state.
- Require explicit guidance when ambiguous.

---

## 4. Failure conditions (mandatory)

Stop and redesign if any condition is true:

- No /project/*.md files exist and user has not created initial migration.
- Attempting to edit or delete historical migration files.
- Proceeding with implementation without explicit user confirmation.
- Context is missing, unclear, or outdated and clarification was not sought.
- Proposed file name conflicts with existing migration files.

When refusing:
- Name the violated rule.
- Explain what information or action is missing.
- Propose the minimal next step to proceed.

---

## 5. Reference index
- rules/: modular rule sources
- references/template.md
- references/example-migration.md
- references/checklist.md

See references/ directory for templates and examples.
