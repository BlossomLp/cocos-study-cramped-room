import { _decorator, Animation } from 'cc'
import { EntityManager } from '../../Base/EntityManager'
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine'
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enum'
import { INIT_FSM_LIST } from './config'
const { ccclass, property } = _decorator

/****
 * * 有限状态机 - 木骷髅
 */
@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {
  private readonly transitons = INIT_FSM_LIST.map(({ param }) => ({
    state: param,
    check: () => this.params.get(param).value,
  }))
  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

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
    INIT_FSM_LIST.forEach(({ param, cls }) => {
      this.stateMachines.set(param, new cls(this))
    })
    console.log(`【注册木骷髅状态机】注册完成`, this.stateMachines)
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      console.log('Animation.EventType.FINISHED', name)
      // 白名单: 这些动作完成后恢复到 idle 状态
      const whiteList = ['attack']
      if (whiteList.some(item => name.includes(item))) {
        // this.setParams(PARAMS_NAME_ENUM.IDLE, true)
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
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
