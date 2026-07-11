import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { DIRECTIONS_LIST } from '../../Base/config'
// 因为烟雾死亡状态 也是空图  这里借用 door 的死亡空图
const BASE_PATH = 'texture/door/death'

export default class DeathSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    DIRECTIONS_LIST.forEach(({ direction }) => {
      this.stateMachines.set(direction, new State(fsm, `${BASE_PATH}`))
    })
  }
}
