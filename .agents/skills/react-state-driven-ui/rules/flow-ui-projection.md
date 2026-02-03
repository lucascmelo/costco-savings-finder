# flow-ui-projection: UI is a projection of state

## Intent
Make UI behavior a deterministic projection of state.

## When this applies
- Any React UI with workflow behavior.
- Any feature with phases or side effects.

## Prohibited
- Behavior changes caused by rendering.
- Transitions triggered from render.
- Meaning encoded in mount/unmount timing.

## Required
- Behavior changes only via events and reducer transitions.
- Rendering reads state and renders output only.

## Implementation recipe
1. Define state model and phase.
2. Define events.
3. Define reducer transitions.
4. Define effects that emit outcome events.
5. Render based on selectors.

## Verification
- Re-render does not change behavior without an event.
- Reducer is the only place that changes workflow state.
