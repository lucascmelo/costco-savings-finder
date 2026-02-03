# Example: async validation with debounce

## Problem
User edits an input that requires server validation.
Validation is async.
Debounce must not change state meaning.
Debounce only delays when VALIDATION_REQUESTED is emitted.

## State model
Ownership:
- Workflow state: reducer state
- Server validation call: mutation

State shape (minimal):
- phase: idle | editing | validating | valid | invalid
- value: string
- validationMessage: string | null
- latestRequestId: string | null

## Events

User intent:
- START_EDIT
- CHANGE_VALUE(value)

System outcomes:
- VALIDATION_STARTED(requestId)
- VALIDATION_SUCCEEDED(requestId)
- VALIDATION_FAILED(requestId, message)

Optional:
- VALIDATION_SETTLED(requestId)

## Transition map (reducer rules)

Rules:
- START_EDIT -> phase editing
- CHANGE_VALUE(value)
  - set value
  - set phase editing
  - clear validationMessage
- VALIDATION_STARTED(requestId)
  - set latestRequestId
  - set phase validating
- VALIDATION_SUCCEEDED(requestId)
  - if stale, ignore
  - set phase valid
- VALIDATION_FAILED(requestId, message)
  - if stale, ignore
  - set phase invalid
  - set validationMessage

Stale handling:
- If requestId != latestRequestId, ignore outcome events.

Invalid transitions:
- VALIDATION_SUCCEEDED from editing
- VALIDATION_FAILED from editing

## Side effects plan (debounce + mutation)
Debounce scheduling:
- On CHANGE_VALUE, reset a timer in controller scope.
- When timer fires, emit a trigger to run validation.
- Do not store the timer in workflow state.

Trigger design options:
- Option A: controller directly calls mutation after debounce, then emits VALIDATION_STARTED
- Option B: controller dispatches an internal event VALIDATION_REQUESTED, and effect runner calls mutation

Use Option A for fewer moving parts:
- After debounce delay, controller creates requestId and dispatches VALIDATION_STARTED(requestId), then calls mutate.

Mutation:
- validateValueMutation.mutate({ value, requestId })

Callback to events:
- onMutate
  - do not set phase here if VALIDATION_STARTED already did it
  - return { requestId }
- onSuccess
  - dispatch VALIDATION_SUCCEEDED(requestId)
- onError
  - dispatch VALIDATION_FAILED(requestId, message)
- onSettled
  - optional dispatch VALIDATION_SETTLED(requestId)

## Selectors
- selectCanSubmit
  - phase is valid
- selectShowSpinner
  - phase is validating
- selectValidationText
  - validationMessage when phase is invalid

## Component boundaries
- View component
  - render value, spinner, validation message
  - emit intent: onChangeValue
- Container component
  - dispatch START_EDIT and CHANGE_VALUE
  - does not call mutation directly
- Controller/effects layer
  - owns debounce timer
  - dispatches VALIDATION_STARTED
  - calls mutation
  - dispatches outcome events from callbacks

## Edge cases
- Rapid typing
  - fewer requests due to debounce
  - phase remains editing until VALIDATION_STARTED is emitted
- Out-of-order responses
  - requestId guard ensures only latest applies
- Validation failure then value changes
  - CHANGE_VALUE clears validationMessage and returns to editing
