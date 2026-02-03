# flow-intents-only: components emit intent only

## Intent
Remove business rules and orchestration from components.

## When this applies
- Any feature with decisions, validation, saving, navigation blocking, retries.

## Prohibited
View components must not:
- decide dirtiness, validity, permissions, blocking
- coordinate save flows
- call mutations based on business conditionals
- perform navigation decisions

## Required
View components must:
- render selector output
- emit intent callbacks (semantic intent, not implementation detail)

Containers must:
- connect selectors to views
- dispatch user intent events
- invoke effect layer triggers when required

## Implementation recipe
1. Move decision logic into selectors and reducer state.
2. Replace inline conditionals with phase-based rendering.
3. Replace direct side effect calls with intent events.

## Verification
- View components contain no business logic.
- View components do not define mutation callbacks.
- Side effects are not started from view hooks.
