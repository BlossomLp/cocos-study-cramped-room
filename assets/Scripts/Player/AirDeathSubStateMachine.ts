import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State, { ANIMATION_SPEED } from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { DIRECTIONS_LIST } from '../../Base/config'
import { AUDIO_CLIP_ENUM } from '../Audio/AudioConfig'

const BASE_PATH = 'texture/player/airdeath'

/**
 * 死亡子状态机类，继承自方向子状态机
 * 用于处理角色死亡时的不同方向状态
 */
export default class AirDeathSubStateMachine extends DirectionSubStateMachine {
  /**
   * 构造函数，初始化死亡状态机
   * @param fsm 状态机实例
   */
  constructor(fsm: StateMachine) {
    super(fsm) // 调用父类构造函数

    // 遍历方向列表，为每个方向创建对应的状态
    DIRECTIONS_LIST.forEach(({ path, direction }) => {
      // 将每个方向的状态机设置到Map中，使用方向作为键
      this.stateMachines.set(
        direction,
        new State(fsm, `${BASE_PATH}/${path}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
          {
            frame: ANIMATION_SPEED * 4, // 攻击动画的第4帧时 人物才死亡声音
            func: 'onDeathSound', // 振动回调函数的 方法名
            params: [AUDIO_CLIP_ENUM.SFX_PLAYER_AIRDEATH],
          },
        ]),
      )
    })
  }
}
