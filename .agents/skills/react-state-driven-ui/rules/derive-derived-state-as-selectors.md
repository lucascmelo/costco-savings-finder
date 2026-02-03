# derive-derived-state-as-selectors: derived state is computed

## Intent
Avoid duplication and drift between source facts and derived flags.

## When this applies
- Flags like isDirty, canSave, totals, counts, visibility.

## Prohibited
- Storing derived values in workflow state.
- Updating derived values in reducers as separate facts.

## Required
- Compute derived values from source state via selectors.
- Memoize selectors when needed.
- Keep reducer state minimal and authoritative.

## Implementation recipe
1. Identify derived fields.
2. Remove derived fields from state.
3. Implement selectors using source fields only.

## Verification
- No derived fields are stored.
- Selectors provide consistent derived output.
