import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { DIRECTIONS_LIST } from './config'

const BASE_PATH = 'texture/player/idle'

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    DIRECTIONS_LIST.forEach(({ path, direction }) => {
      this.stateMachines.set(direction, new State(fsm, `${BASE_PATH}/${path}`, AnimationClip.WrapMode.Loop))
    })
  }
}
