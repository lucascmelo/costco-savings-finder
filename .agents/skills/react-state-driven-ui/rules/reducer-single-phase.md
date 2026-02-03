# reducer-single-phase: one phase field controls process meaning

## Intent
Prevent implicit phases and illegal state combinations.

## When this applies
- Any feature with async, multi-step flow, confirmation, or retries.

## Prohibited
- Inferring phase from multiple booleans.
- Encoding process meaning in scattered flags.

## Required
- Use one phase field to represent process meaning.
- Make phases mutually exclusive.
- Use explicit transitions to move between phases.

## Implementation recipe
1. Enumerate phases.
2. Define allowed transitions between phases.
3. Remove boolean soup that encodes phase.
4. Compute derived flags from phase via selectors.

## Verification
- There is exactly one process phase field.
- UI and effects read phase, not ad hoc combinations.
