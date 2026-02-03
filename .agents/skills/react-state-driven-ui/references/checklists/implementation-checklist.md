# Implementation checklist

## Before coding
- Define the workflow phases as a single phase field.
- Define state ownership categories for each field.
- Define user intent events and system outcome events.
- Define reducer transitions for every event.
- Define invalid transitions.
- Define effects plan:
  - which event triggers which mutation
  - which callbacks emit which outcome events
  - stale response handling strategy (requestId)
- Define selectors for all derived values.
- Define component boundaries:
  - view renders only
  - container dispatches intents
  - controller runs effects

## Before merging
- Confirm no business rules in view components.
- Confirm no workflow orchestration in useEffect.
- Confirm phase is not inferred from multiple flags.
- Confirm reducer is pure and is the only place that changes workflow state.
- Confirm React Query cache is not mirrored into workflow state.
- Confirm draft overlay is keyed by stable ids and merged in selectors.
- Confirm async outcomes ignore stale responses.
- Confirm navigation blocking uses explicit decision phase.
- Confirm re-render does not change behavior without an event and transition.
