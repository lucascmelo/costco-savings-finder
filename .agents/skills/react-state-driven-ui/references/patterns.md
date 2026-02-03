# Patterns

Use these patterns as defaults.
Deviate only with an explicit reason.

## Pattern 1: Single phase field
Represent process meaning with one field: `phase`.
Do not infer phase from multiple booleans.

Rules:
- Phase values are mutually exclusive.
- Phase changes happen only through reducer transitions.
- Phase is the only source of truth for "where the workflow is".

Example phase sets:
- idle | editing | saving | error
- idle | editing | confirm_navigation
- idle | editing | validating | valid | invalid

## Pattern 2: Reducer + events (explicit transitions)
Model behavior as:
- events describe what happened
- reducer computes next state

Rules:
- Every state change is caused by an event.
- Reducer is pure. No side effects inside reducer.
- Do not mutate state outside the reducer.
- Mark invalid transitions explicitly.

Event categories:
- User intent events (from UI)
- System outcome events (from effects callbacks)

## Pattern 3: Event naming convention
Use UPPER_SNAKE_CASE imperative verbs.

Rules:
- Use one event per intent or outcome.
- Do not encode meaning in boolean flags.
- Prefer explicit outcomes over inferred states.

Examples:
- START_EDIT
- CHANGE_FIELD
- COMMIT_REQUESTED
- COMMIT_SUCCEEDED
- COMMIT_FAILED
- NAVIGATION_REQUESTED
- NAVIGATION_CONFIRMED
- NAVIGATION_CANCELLED
- VALIDATION_REQUESTED
- VALIDATION_SUCCEEDED
- VALIDATION_FAILED

## Pattern 4: Draft overlay keyed by stable ids
Do not mirror server cache in workflow state.
Store only client edits as an overlay keyed by stable ids.

State shape:
- draftById: Record<RowId, Partial<Row>>

Rules:
- Stable ids come from the server.
- Overlay is merged in selectors.
- Overlay is cleared only on expli
