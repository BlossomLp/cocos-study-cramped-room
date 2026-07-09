import State from './State'
import { StateMachine } from './StateMachine'

export abstract class SubStateMachine {
  /** 当前状态 */
  private _currentState: State = null
  stateMachines: Map<string, State> = new Map()

  constructor(public fsm: StateMachine) {}

  get currentState() {
    return this._currentState
  }

  set currentState(state: State) {
    if (!state) {
      debugger
      return
    }
    this._currentState = state
    this._currentState.run()
  }

  abstract run(): void
}
