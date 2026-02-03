// Template for reducer implementation
// Copy and modify for your specific workflow

interface WorkflowState {
  phase: 'idle' | 'editing' | 'saving' | 'error'
  latestRequestId?: string
  error?: string
  // Add other state fields here
}

type Event = 
  | { type: 'START_EDIT' }
  | { type: 'CHANGE_FIELD'; field: string; value: any }
  | { type: 'SAVE_REQUESTED' }
  | { type: 'SAVE_STARTED'; requestId: string }
  | { type: 'SAVE_SUCCEEDED'; requestId: string }
  | { type: 'SAVE_FAILED'; requestId: string; error: string }
  // Add other events here

export const initialState: WorkflowState = {
  phase: 'idle',
  // Initialize other fields
}

export function reducer(state: WorkflowState, event: Event): WorkflowState {
  switch (event.type) {
    case 'START_EDIT':
      return {
        ...state,
        phase: 'editing'
      }
    
    case 'CHANGE_FIELD':
      return {
        ...state,
        phase: 'editing'
        // Update field state
      }
    
    case 'SAVE_STARTED':
      return {
        ...state,
        phase: 'saving'
      }
    
    case 'SAVE_SUCCEEDED':
      if (event.requestId !== state.latestRequestId) {
        return state // Ignore stale response
      }
      return {
        ...state,
        phase: 'idle'
      }
    
    case 'SAVE_FAILED':
      if (event.requestId !== state.latestRequestId) {
        return state // Ignore stale response
      }
      return {
        ...state,
        phase: 'error',
        error: event.error
      }
    
    default:
      return state
  }
}
