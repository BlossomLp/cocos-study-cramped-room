import { DIRECTIONS_LIST } from '../../Base/config'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'

const BASE_PATH = 'texture/door/death'
export default class DeathSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    DIRECTIONS_LIST.forEach(({ direction }) => {
      // 开门即门消失 不区分资源
      this.stateMachines.set(direction, new State(fsm, `${BASE_PATH}`))
    })
  }
}
