# routing-explicit-decision-state: navigation blocking requires explicit decision phase

## Intent
Make navigation decisions explicit and testable.

## When this applies
- Unsaved changes prompts.
- Cross-route workflows.
- Any blocking or confirmation UI.

## Prohibited
- Blocking navigation via lifecycle hacks.
- Navigating directly from view components.
- Skipping a decision state.

## Required
- Add a confirm_navigation phase.
- Store pending destination in workflow state.
- Navigate only after explicit confirm event.
- Execute navigation in a boundary layer.

## Implementation recipe
1. Add phase confirm_navigation.
2. Add pendingNavigation in state.
3. On NAVIGATION_REQUESTED, enter confirm_navigation and store destination.
4. On NAVIGATION_CONFIRMED, clear drafts and proceed to navigation effect.
5. On NAVIGATION_CANCELLED, return to editing.

## Verification
- Navigation cannot proceed without an explicit confirm event when drafts exist.
- Navigation logic does not live in view components.
