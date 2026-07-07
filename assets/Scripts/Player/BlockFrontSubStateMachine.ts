import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { DIRECTIONS_LIST } from './config'

const BASE_PATH = 'texture/player/blockfront'

/**
 * 向前撞墙动画
 */
export default class BlockFrontSubStateMachine extends DirectionSubStateMachine {
  /**
   * @param fsm 状态机实例，用于控制状态转换
   */
  constructor(fsm: StateMachine) {
    super(fsm)

    // 遍历方向列表，为每个方向创建对应的状态机
    DIRECTIONS_LIST.forEach(({ path, direction }) => {
      // 将每个方向的状态机存储到 Map 中，方向为键，状态为值
      this.stateMachines.set(direction, new State(fsm, `${BASE_PATH}/${path}`))
    })
  }
}
