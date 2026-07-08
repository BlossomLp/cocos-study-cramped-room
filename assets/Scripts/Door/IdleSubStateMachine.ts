import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { IDirectionsConf } from '../../Base/config'
import { DIRECTION_ENUM } from '../../Enum'

// 门的资源只有 上下 / 左右 两种
const DIRECTIONS_LIST: IDirectionsConf[] = [
  { path: 'top', direction: DIRECTION_ENUM.TOP },
  { path: 'top', direction: DIRECTION_ENUM.BOTTOM },
  { path: 'left', direction: DIRECTION_ENUM.LEFT },
  { path: 'left', direction: DIRECTION_ENUM.RIGHT },
]

const BASE_PATH = 'texture/door/idle'

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    DIRECTIONS_LIST.forEach(({ path, direction }) => {
      this.stateMachines.set(direction, new State(fsm, `${BASE_PATH}/${path}`, AnimationClip.WrapMode.Loop))
    })
  }
}
