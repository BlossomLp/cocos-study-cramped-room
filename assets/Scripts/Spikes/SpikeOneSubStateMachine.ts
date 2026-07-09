import { SPIKES_LIST } from '../../Base/config'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { SubStateMachine } from '../../Base/SubStateMachine'
import { PARAMS_NAME_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from '../../Enum'

const BASE_PATH = 'texture/spikes/spikesone'
const COUNT = 1

/**
 * 一刺状态机
 */
export default class SpikeOneSubStateMachine extends SubStateMachine {
  /**
   * @param fsm 状态机实例，用于控制状态转换
   */
  constructor(fsm: StateMachine) {
    super(fsm)

    // 遍历step列表，为每个step创建对应的状态机
    for (let i = 0; i < COUNT + 2; i++) {
      const { path, step } = SPIKES_LIST[i]
      this.stateMachines.set(step, new State(fsm, `${BASE_PATH}/${path}`))
    }
  }

  run() {
    // 获取当前step
    const curCount = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    // 设置step状态
    this.currentState = this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[curCount as number])
  }
}
