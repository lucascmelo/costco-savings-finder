# effects-no-effects-in-components: isolate side effects

## Intent
Prevent component lifecycle from becoming the orchestration engine.

## When this applies
- Any network call, persistence, routing, timers, debounced work.

## Prohibited
- useEffect coordinating workflow decisions.
- Conditional side effects inside view components.
- Effects triggered by render timing.

## Required
- Run effects in a controller layer.
- Bind effects to events.
- Emit system outcome events from effects callbacks.

## Implementation recipe
1. Identify all effects.
2. Create an effects/controller layer for the feature.
3. Trigger effects on specific events.
4. Emit outcome events, update state via reducer.

## Verification
- View components have no orchestration effects.
- Effects are started by explicit triggers, not lifecycle guesses.
