# forward-only-writes: forward-only writes

## Intent
Ensure all project progress is recorded as immutable, chronological entries.

## When this applies
- Recording new work, tasks, or decisions.
- Updating project status or progress.
- Adding discoveries or corrections.

## Prohibited
- Modifying existing migration files.
- Editing historical content.
- Deleting or removing past entries.

## Required
- All new work is recorded via new /project/YYYY-MM-DD-topic.md files.
- Or append to current-day file only.
- Never modify historical content.

## Implementation recipe
1. Check if current date file exists.
2. If yes, append to current-day file.
3. If no, create new file with YYYY-MM-DD-topic.md format.
4. Add new content as chronological entries.

## Verification
- New work appears in appropriate file.
- No historical files were modified.
- Chronological order is maintained.
