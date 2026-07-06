import { AnimationClip } from 'cc'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { SubStateMachine } from '../../Base/SubStateMachine'
import { PARAMS_NAME_ENUM } from '../../Enum'

const BASE_PATH = 'texture/player/turnleft'

export default class TurnLeftSubStateMachine extends SubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    const directions = ['top', 'bottom', 'left', 'right']

    directions.forEach(direction => {
      this.stateMachines.set(
        PARAMS_NAME_ENUM.IDLE,
        new State(fsm, `${BASE_PATH}/${direction}`, AnimationClip.WrapMode.Loop),
      )
    })
  }

  run() {}
}
