# docs-rationale-at-boundaries: document reasoning at boundaries

## Intent
Make decisions understandable without bloating code.

## When this applies
- Any architectural choice: state model, phase design, event design, effects boundary.
- Any policy choice: stale response guard, cancellation, navigation blocking.
- Any non-obvious selector or merge strategy.

## Prohibited
- Commenting every decision in code.
- Long explanatory comments in JSX.
- Repeating obvious statements in comments.

## Required
- Provide a Design rationale section in the agent output.
- Add short boundary comments only where needed:
  - state invariants and phase meanings
  - effect controller policies (requestId, cancellation)
  - navigation guard policies
  - non-obvious derived selectors

## Implementation recipe
1. In the agent output, include a section named "Design rationale".
2. Use this structure:
   - Why
   - What
   - Why not
   - Skipped
   - Trade-offs
3. In code, add comments only at boundaries and only for non-obvious policy.
4. Keep comments short. Prefer references to rule ids.

## Verification
- The output contains a Design rationale section.
- Code comments exist only at boundaries and are under 3 to 6 lines each.
- No JSX contains multi-line reasoning comments.
