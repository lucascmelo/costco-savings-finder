# Example: draft save flow (server-backed row)

## Problem
User edits a server-backed row.
User can save or discard.
Save is async and can fail.
UI must remain correct under re-rendering and rapid actions.

## State model
Ownership:
- Server row: React Query cache
- Workflow state: reducer state
- Draft overlay: reducer state

State shape (minimal):
- phase: idle | editing | saving | error
- activeId: RowId | null
- draftById: Record<RowId, Partial<Row>>
- latestRequestId: string | null
- lastError: string | null

## Events

User intent:
- START_EDIT(id)
- CHANGE_FIELD(id, patch)
- DISCARD_DRAFT(id)
- COMMIT_REQUESTED(id)
- RETRY_COMMIT(id)

System outcomes:
- COMMIT_STARTED(requestId, id)
- COMMIT_SUCCEEDED(requestId, id, payload)
- COMMIT_FAILED(requestId, id, error)

Optional:
- COMMIT_SETTLED(requestId, id)

## Transition map (reducer rules)

Rules:
- START_EDIT sets activeId and phase editing
- CHANGE_FIELD updates draftById[id] and keeps phase editing
- DISCARD_DRAFT clears draftById[id], clears error, sets phase idle if no active edits
- COMMIT_REQUESTED sets phase saving only after COMMIT_STARTED
- COMMIT_STARTED sets latestRequestId and phase saving
- COMMIT_SUCCEEDED clears draftById[id], clears error, sets phase idle
- COMMIT_FAILED sets lastError and phase error, keeps draftById[id]
- Ignore stale outcomes:
  - If event.requestId != state.latestRequestId, return state unchanged

Invalid transitions (reject design if needed):
- CHANGE_FIELD when phase is saving
- COMMIT_REQUESTED when phase is idle and no draft exists

## Side effects plan (React Query mutation)
Trigger:
- On COMMIT_REQUESTED(id), run mutation in effects layer

Mutation:
- updateRowMutation.mutate({ id, patch })

Callback to events:
- onMutate
  - create requestId
  - dispatch COMMIT_STARTED(requestId, id)
  - return { requestId } for callback access
- onSuccess(data, variables, context)
  - dispatch COMMIT_SUCCEEDED(context.requestId, variables.id, data)
  - update or invalidate queries as needed
- onError(error, variables, context)
  - dispatch COMMIT_FAILED(context.requestId, variables.id, error)
- onSettled
  - optional dispatch COMMIT_SETTLED(context.requestId, variables.id)

Stale response handling:
- Store latestRequestId in workflow state on COMMIT_STARTED.
- In reducer, ignore COMMIT_SUCCEEDED and COMMIT_FAILED if requestId is not latest.

## Selectors
- selectMergedRow(id)
  - merge(serverRow(id), draftById[id])
- selectIsDirty(id)
  - draftById[id] exists and has keys
- selectCanSave
  - phase is editing and activeId is not null and selectIsDirty(activeId)
- selectErrorMessage
  - lastError when phase is error

## Component boundaries
- View component
  - render mergedRow, phase, canSave, error
  - emit intents: onStartEdit, onChangeField, onSave, onDiscard, onRetry
- Container component
  - read selectors
  - dispatch user intent events
  - call effects layer for COMMIT_REQUESTED only
- Effects/controller layer
  - owns mutation setup and callbacks
  - emits system outcome events only
  - does not render UI

## Edge cases
- Rapid double save
  - requestId ensures only latest outcome applies
- Server row changes during edit
  - merged selector overlays draft on top of latest server row
- Save fails
  - keep draft overlay, expose error state, allow retry
