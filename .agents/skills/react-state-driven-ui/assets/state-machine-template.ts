// Template for state machine implementation
// Copy and modify for your specific workflow

type Phase = 'idle' | 'editing' | 'saving' | 'error'

interface WorkflowState {
  phase: Phase
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

// Phase transition matrix
const allowedTransitions: Record<Phase, Phase[]> = {
  idle: ['editing'],
  editing: ['saving'],
  saving: ['idle', 'error'],
  error: ['editing']
}

function canTransition(from: Phase, to: Phase): boolean {
  return allowedTransitions[from]?.includes(to) ?? false
}

export const initialState: WorkflowState = {
  phase: 'idle'
}

export function reducer(state: WorkflowState, event: Event): WorkflowState {
  switch (event.type) {
    case 'START_EDIT':
      if (!canTransition(state.phase, 'editing')) {
        return state // Invalid transition
      }
      return {
        ...state,
        phase: 'editing'
      }
    
    case 'CHANGE_FIELD':
      if (!canTransition(state.phase, 'editing')) {
        return state // Invalid transition
      }
      return {
        ...state,
        phase: 'editing'
        // Update field state
      }
    
    case 'SAVE_STARTED':
      if (!canTransition(state.phase, 'saving')) {
        return state // Invalid transition
      }
      return {
        ...state,
        phase: 'saving',
        latestRequestId: event.requestId
      }
    
    case 'SAVE_SUCCEEDED':
      if (!canTransition(state.phase, 'idle')) {
        return state // Invalid transition
      }
      if (event.requestId !== state.latestRequestId) {
        return state // Ignore stale response
      }
      return {
        ...state,
        phase: 'idle',
        error: undefined
      }
    
    case 'SAVE_FAILED':
      if (!canTransition(state.phase, 'error')) {
        return state // Invalid transition
      }
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
