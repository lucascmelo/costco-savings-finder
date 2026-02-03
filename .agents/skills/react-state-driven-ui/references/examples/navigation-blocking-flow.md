# Example: navigation blocking (explicit decision phase)

## Problem
User has unsaved draft changes.
User attempts to navigate away.
System must require an explicit decision.
Do not rely on component lifecycle to block navigation.

## State model
Ownership:
- Server data: React Query cache
- Workflow state: reducer state

State shape (minimal):
- phase: idle | editing | confirm_navigation
- draftById: Record<RowId, Partial<Row>>
- pendingNavigation: { to: string } | null

## Events

User intent:
- START_EDIT(id)
- CHANGE_FIELD(id, patch)
- NAVIGATION_REQUESTED(to)
- NAVIGATION_CONFIRMED
- NAVIGATION_CANCELLED
- DISCARD_ALL_DRAFTS

System outcomes:
- NAVIGATION_PERFORMED(to) (optional)

## Transition map (reducer rules)

Rules:
- START_EDIT -> phase editing
- CHANGE_FIELD -> keep phase editing, update draft
- NAVIGATION_REQUESTED(to)
  - if no drafts, do not enter confirm_navigation
  - if drafts exist, set pendingNavigation and phase confirm_navigation
- NAVIGATION_CANCELLED
  - clear pendingNavigation, return to editing
- NAVIGATION_CONFIRMED
  - clear drafts, clear pendingNavigation, set phase idle
  - navigation effect must run outside view components

Invalid transitions:
- NAVIGATION_CONFIRMED from editing
- NAVIGATION_REQUESTED from confirm_navigation without cancelling first

## Side effects plan (navigation effect)
Trigger:
- On NAVIGATION_CONFIRMED, perform navigation to pendingNavigation.to

Placement rules:
- Perform navigation in a boundary layer, not in a view component.
- The boundary layer can be:
  - controller hook used by a container
  - router middleware or guard layer

Effect execution:
- Read pendingNavigation from state at the time of confirmation.
- Navigate once.
- Optionally dispatch NAVIGATION_PERFORMED(to) for logging or cleanup.

Rules:
- The decision is stateful (confirm_navigation).
- Navigation happens only after NAVIGATION_CONFIRMED.
- Components do not call router navigation directly.

## Selectors
- selectHasDrafts
  - draftById has any keys
- selectShouldConfirmNavigation
  - phase is editing and selectHasDrafts is true
- selectPendingDestination
  - pendingNavigation?.to

## Component boundaries
- View component
  - render confirmation dialog when phase confirm_navigation
  - emit intents: onConfirm, onCancel
- Container component
  - dispatch NAVIGATION_REQUESTED when user attempts navigation
  - dispatch NAVIGATION_CONFIRMED or NAVIGATION_CANCELLED from dialog intents
- Boundary navigation effect
  - performs the actual navigation after confirmation

## Edge cases
- Navigation request while saving
  - model saving phase explicitly if needed
  - define policy: block, queue, or disallow
  - express policy as phases and transitions
- Draft cleared before confirmation
  - if drafts become empty, container can dispatch NAVIGATION_CANCELLED and proceed
