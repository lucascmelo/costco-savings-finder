# fsm-no-boolean-soup: replace boolean soup with explicit phases

## Intent
Make state representable as a finite set of phases and transitions.

## When this applies
- When behavior is expressed as combined flags.
- When there are impossible combinations to defend against.

## Prohibited
- Conditions like isDirty && !isSaving && hasFocus deciding meaning.
- UI guessing the current phase from multiple flags.

## Required
- Use explicit phases.
- Use explicit transitions.
- Mark invalid transitions.

## Implementation recipe
1. Identify boolean combinations used to decide meaning.
2. Replace them with phase values.
3. Move decision logic into reducer and selectors.

## Verification
- Process meaning is phase-based.
- Conditionals in JSX are display-only, not business meaning.
