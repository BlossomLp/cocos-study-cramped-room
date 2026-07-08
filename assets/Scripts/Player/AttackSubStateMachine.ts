import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { DIRECTIONS_LIST } from '../../Base/config'

const BASE_PATH = 'texture/player/attack'

export default class AttackSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    DIRECTIONS_LIST.forEach(({ direction, path }) => {
      this.stateMachines.set(direction, new State(fsm, `${BASE_PATH}/${path}`))
    })
  }
}
