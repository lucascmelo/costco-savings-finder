# query-mutation-callbacks: React Query mutation callbacks emit outcome events

## Intent
Use React Query as the effects mechanism while keeping workflow state in the reducer.

## When this applies
- Any server write: save, update, delete, generate, validate.

## Prohibited
- Defining mutation callbacks inside view components.
- Mutating workflow state directly inside callbacks.
- Treating cache updates as workflow state.

## Required
- Create mutations in a controller layer.
- Use callbacks to emit system outcome events.
- Reducer applies state updates based on those events.
- React Query cache remains the source of truth for server resources.

## Implementation recipe
1. Define COMMIT_REQUESTED intent event.
2. In controller, call mutate for COMMIT_REQUESTED.
3. In onMutate, emit STARTED event with requestId.
4. In onSuccess, emit SUCCEEDED event with payload.
5. In onError, emit FAILED event with error.
6. Optionally invalidate or update queries in callbacks.

## Verification
- Callbacks emit events, reducer updates workflow state.
- No workflow meaning is stored in cache updates.
