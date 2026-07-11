import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State, { ANIMATION_SPEED } from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { DIRECTIONS_LIST } from '../../Base/config'

const BASE_PATH = 'texture/player/attack'

export default class AttackSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    DIRECTIONS_LIST.forEach(({ direction, path, shakeType }) => {
      this.stateMachines.set(
        direction,
        new State(fsm, `${BASE_PATH}/${path}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
          {
            frame: ANIMATION_SPEED * 4, // 攻击动画的第4帧开始振动
            func: 'onAttackShake', // 振动回调函数的 方法名
            params: [shakeType],
          },
        ]),
      )
    })
  }
}
