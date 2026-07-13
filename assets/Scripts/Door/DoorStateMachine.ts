import { _decorator, Animation } from 'cc'
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine'
import { PARAMS_NAME_ENUM } from '../../Enum'
import { INIT_FSM_LIST } from './config'
const { ccclass, property } = _decorator

/****
 * * 有限状态机 - 木骷髅
 */
@ccclass('DoorStateMachine')
export class DoorStateMachine extends StateMachine {
  private readonly transitions = INIT_FSM_LIST.map(({ param }) => ({
    state: param,
    check: () => this.params.get(param).value,
  }))
  async init() {
    this.animationComponent = this.node.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }
  initAnimationEvent() {}

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

  /** 注册状态机 */
  initStateMachines() {
    INIT_FSM_LIST.forEach(({ param, cls }) => {
      this.stateMachines.set(param, new cls(this))
    })
    console.log(`【注册门状态机】注册完成`, this.stateMachines)
  }

  run() {
    const next = this.transitions.find(({ check }) => check())
    if (next) {
      this.currentState = this.stateMachines.get(next.state)
    } else {
      this.currentState = this.currentState
    }
  }
}
