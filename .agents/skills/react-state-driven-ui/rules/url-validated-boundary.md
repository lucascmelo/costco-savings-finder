# url-validated-boundary: URL is a validated boundary input

## Intent
Prevent invalid URL state from corrupting workflow state.

## When this applies
- Any deep link, shareable state, or route param affecting behavior.

## Prohibited
- Using raw URL params directly as workflow state.
- Implicit coercions without validation.

## Required
- Parse URL state at a boundary.
- Validate and coerce.
- Store validated output in workflow state.
- Version schema when evolving.

## Implementation recipe
1. Define URL schema.
2. Parse URL input.
3. Validate and coerce.
4. Dispatch event to store validated output.

## Verification
- Workflow state contains only validated values derived from URL.
