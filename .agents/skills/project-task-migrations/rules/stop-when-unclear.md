# stop-when-unclear: stop when unclear

## Intent
Prevent incorrect assumptions when project context is insufficient.

## When this applies
- Context is missing, unclear, or outdated.
- Migration files contain ambiguous information.
- Dependencies or constraints are not well-defined.

## Prohibited
- Making assumptions about project state.
- Proceeding with ambiguous requirements.
- Guessing at missing information.

## Required
- If context is missing, unclear, or outdated, stop and ask for clarification.
- Do not make assumptions about project state.
- Require explicit guidance when ambiguous.

## Implementation recipe
1. Identify missing or unclear information.
2. Stop all planning and implementation.
3. Request specific clarification from user.
4. Wait for explicit guidance before proceeding.

## Verification
- Work has stopped due to unclear context.
- Specific clarification has been requested.
- No assumptions have been made.
- Waiting for user guidance.
