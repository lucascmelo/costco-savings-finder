# Glossary

## Terms

**Phase**: Single field representing process meaning (e.g., idle, editing, saving).

**Event**: Named occurrence that triggers state transitions.

**Reducer**: Pure function that computes next state from current state and event.

**Intent**: User action expressed as semantic event (e.g., START_EDIT, SAVE_REQUESTED).

**Outcome**: System result expressed as event (e.g., SAVE_STARTED, SAVE_SUCCEEDED).

**Selector**: Pure function that computes derived values from source state.

**Overlay**: Client-side edits keyed by stable IDs, merged with server data.

**RequestId**: Unique identifier per async attempt to guard against stale responses.

**Boundary Layer**: Code that handles external concerns (routing, persistence, validation).

**Boolean Soup**: Anti-pattern of inferring meaning from multiple boolean flags.

## Component Types

**View Component**: Renders state and emits intents only. No business logic.

**Container Component**: Connects selectors to views, dispatches intent events.

**Controller/Effects Layer**: Runs side effects, emits outcome events.

## State Categories

**Server Cache State**: Authoritative data from server (React Query).

**Client Workflow State**: Feature state managed by reducer.

**URL State**: Serialized view of key workflow state, validated at boundary.

**Ephemeral UI State**: Local component state (focus, hover, dropdown state).
