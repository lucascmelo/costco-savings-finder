---
name: project-task-migrations
description: Manage project state using append-only, time-based Markdown files under /project/. Use when managing multi-epic projects, tracking decisions over time, maintaining audit trails, coordinating distributed teams, or requiring rollback visibility. Forces context loading, explicit confirmation gates, and immutable history preservation.
---

# Project Task Migrations

Transform chaotic project management into a disciplined, auditable system. This skill forces teams to maintain complete project history through time-stamped migrations, eliminating lost decisions and providing rollback visibility for complex initiatives.

## What this solves
- **Decision amnesia**: Never lose track of why choices were made or who made them
- **Project drift**: Maintain clear progression from initial requirements to current state
- **Team coordination**: Distributed teams work from shared, immutable context
- **Audit requirements**: Complete change history for compliance and governance
- **Rollback safety**: Always know what changed and how to revert if needed

## When to apply
Use this skill when managing:

- **Multi-epic initiatives**: Complex projects with interdependent workstreams
- **Cross-functional teams**: Groups requiring shared decision tracking
- **Regulated environments**: Projects needing audit trails and change documentation
- **Distributed collaboration**: Teams across time zones needing asynchronous coordination
- **Critical systems**: Projects where rollback visibility and change history are essential

## What you get
- **Immutable history**: Complete chronological record of all project decisions
- **Context-first workflow**: Forces understanding of current state before changes
- **Explicit confirmation gates**: Prevents accidental or uninformed changes
- **Rollback visibility**: Clear path to understand and reverse any change
- **Team alignment**: Single source of truth for project state and decisions

## Scope
Use this skill to manage project state through immutable, append-only Markdown files. All work is recorded as time-stamped migrations that preserve complete history and enable forward-only progress tracking.

## Required workflow
1. Load most recent /project/*.md file
2. Summarize current epics, tasks, and decisions
3. Propose new migration file name
4. Draft migration content
5. Request explicit confirmation
6. Implement only after confirmation

## Output expectations
When using this skill, output in this structure:

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

## Canonical documents
- Full compiled guidance for agents: AGENTS.md
- Source rules (modular): rules/
- Templates and examples: references/

## Rule catalog
Read the relevant rule files from rules/ as needed.
Treat AGENTS.md as canonical when uncertain.

### Core workflow rules
- rules/context-read-latest.md
- rules/history-immutable.md
- rules/forward-only-writes.md

### Quality assurance
- rules/close-out-updates.md
- rules/stop-when-unclear.md
