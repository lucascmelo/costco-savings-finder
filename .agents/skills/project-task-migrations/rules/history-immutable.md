# history-immutable: history is immutable

## Intent
Preserve complete chronological record of all project decisions and work.

## When this applies
- Any interaction with existing migration files.
- When tempted to correct or clarify past entries.
- When updating task status.

## Prohibited
- Never edit past migration files.
- Never delete lines, tasks, or decisions from history.
- Never modify timestamps or historical context.

## Required
- Preserve complete chronological record.
- Treat all migration files as append-only logs.
- Create new entries for corrections or updates.

## Implementation recipe
1. Never open past migration files for editing.
2. If corrections are needed, create new migration file.
3. Reference the incorrect information and provide correction.
4. Use checkboxes only in current or new migration files.

## Verification
- No historical migration files have been modified.
- All corrections are recorded as new entries.
- Complete timeline is preserved.
