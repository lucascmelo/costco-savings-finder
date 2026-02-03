# reducer-events-drive-state: events drive all workflow state changes

## Intent
Make workflow state transitions explicit and traceable.

## When this applies
- Any UI behavior that changes over time.

## Prohibited
- Updating workflow state outside the reducer.
- Mutating state from effects callbacks.
- Encoding meaning in ad hoc flags without events.

## Required
- Define events for every meaningful change.
- Update workflow state only via reducer transitions.
- Reducer must be pure and deterministic.

## Implementation recipe
1. List user intent events.
2. List system outcome events.
3. Implement reducer for all events.
4. Mark invalid transitions explicitly.

## Verification
- Every workflow state change has an event name.
- Reducer has no side effects and no async.
