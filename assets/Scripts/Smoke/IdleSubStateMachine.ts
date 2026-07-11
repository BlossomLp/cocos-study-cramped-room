import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State, { ANIMATION_SPEED } from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { DIRECTIONS_LIST } from '../../Base/config'

const BASE_PATH = 'texture/smoke/idle'

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    DIRECTIONS_LIST.forEach(({ path, direction }) => {
      this.stateMachines.set(
        direction,
        new State(fsm, `${BASE_PATH}/${path}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED / 1.5),
      )
    })
  }
}
