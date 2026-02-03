# query-stale-response-guard: guard against stale async outcomes

## Intent
Prevent out-of-order callbacks from corrupting workflow state.

## When this applies
- Any mutation that can be triggered multiple times.
- Any debounced or retried async operation.

## Prohibited
- Assuming callbacks arrive in the same order as requests.
- Applying stale results to current state.

## Required
Use one strategy:
- requestId in workflow state, ignore mismatched outcomes
- abort previous requests where possible, still guard with requestId

## Implementation recipe
1. Generate requestId per attempt.
2. Store latestRequestId on STARTED event.
3. Include requestId in outcome events.
4. Reducer ignores outcomes with non-latest requestId.

## Verification
- Rapid repeat actions do not apply stale outcomes.
- Latest attempt controls state.
