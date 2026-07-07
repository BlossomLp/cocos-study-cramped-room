import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { DIRECTIONS_LIST } from '../../Base/config'

const BASE_PATH = 'texture/player/death'

/**
 * 死亡子状态机类，继承自方向子状态机
 * 用于处理角色死亡时的不同方向状态
 */
export default class DeathSubStateMachine extends DirectionSubStateMachine {
  /**
   * 构造函数，初始化死亡状态机
   * @param fsm 状态机实例
   */
  constructor(fsm: StateMachine) {
    super(fsm) // 调用父类构造函数

    // 遍历方向列表，为每个方向创建对应的状态
    DIRECTIONS_LIST.forEach(({ path, direction }) => {
      // 将每个方向的状态机设置到Map中，使用方向作为键
      this.stateMachines.set(direction, new State(fsm, `${BASE_PATH}/${path}`))
    })
  }
}
