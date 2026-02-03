# identity-stable-ids-and-keys: stable identity is mandatory

## Intent
Prevent remount cascades and state loss due to unstable identity.

## When this applies
- Lists, grids, dynamic forms, multi-row editing.

## Prohibited
- Keys derived from mutable values.
- Keys derived from computed view state.
- Random keys.

## Required
- Use stable ids from the domain.
- Store overlays keyed by stable ids.
- Avoid remounting unrelated subtrees on state changes.

## Implementation recipe
1. Identify list identity.
2. Replace unstable keys with stable ids.
3. Ensure state overlays and selections use the same ids.

## Verification
- Keys remain stable across edits.
- Editing does not remount unrelated rows/components.
