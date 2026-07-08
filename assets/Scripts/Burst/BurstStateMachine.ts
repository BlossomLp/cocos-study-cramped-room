import { _decorator, Animation } from 'cc'
import State from '../../Base/State'
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine'
import { PARAMS_NAME_ENUM } from '../../Enum'
import { INIT_FSM_LIST } from './config'
const { ccclass, property } = _decorator

const BASE_PATH = 'texture/burst'

/****
 * * 有限状态机 - 木骷髅
 */
@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {
  private readonly transitons = INIT_FSM_LIST.map(({ param }) => ({
    state: param,
    check: () => this.params.get(param).value,
  }))
  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachines()

    await Promise.all(this.waitingList)
  }

  /**
   * 初始化参数
   */
  initParams() {
    // 状态
    INIT_FSM_LIST.forEach(({ param }) => {
      this.params.set(param, getInitParamsTrigger())
    })
    // 方向
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  /** 注册玩家状态机 */
  initStateMachines() {
    INIT_FSM_LIST.forEach(({ param, path }) => {
      this.stateMachines.set(param, new State(this, `${BASE_PATH}/${path}`))
    })
    console.log(`【注册木骷髅状态机】注册完成`, this.stateMachines)
  }

  run() {
    const next = this.transitons.find(({ check }) => check())
    if (next) {
      this.currentState = this.stateMachines.get(next.state)
    } else {
      this.currentState = this.currentState
    }
  }
}
