# determinism-no-lifecycle-dependence: no lifecycle-dependent behavior

## Intent
Make behavior deterministic under re-rendering.

## When this applies
- Any feature with workflow state or side effects.

## Prohibited
- Behavior that depends on mount/unmount.
- useEffect used to infer meaning from timing.
- Transitions triggered by rendering.

## Required
- Only events cause transitions.
- Effects run outside view components and emit outcome events.
- Debounce affects scheduling only, not meaning.

## Implementation recipe
1. Identify lifecycle-driven behavior.
2. Replace it with explicit events and reducer transitions.
3. Move effects to controller layer.

## Verification
- Re-render does not change behavior without an event.
- Tests can drive behavior by dispatching events.
