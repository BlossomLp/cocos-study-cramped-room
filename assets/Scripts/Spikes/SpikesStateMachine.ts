import { _decorator, Animation } from 'cc'
import { getInitParamsNumber, StateMachine } from '../../Base/StateMachine'
import { PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../Enum'
import { INIT_FSM_LIST } from './config'
const { ccclass, property } = _decorator

/****
 * * 有限状态机
 */
@ccclass('SpikesStateMachine')
export class SpikesStateMachine extends StateMachine {
  private readonly transitons = INIT_FSM_LIST.map(({ param }) => ({
    state: param,
    check: () => {
      const { value } = this.params.get(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
      return value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[param]
    },
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
    // n个刺
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber())
    // n+2个步骤
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber())
  }

  /** 注册玩家状态机 */
  initStateMachines() {
    INIT_FSM_LIST.forEach(({ param, cls }) => {
      this.stateMachines.set(param, new cls(this))
    })
  }

  initAnimationEvent() {
    // this.animationComponent.on(Animation.EventType.FINISHED, () => {
    //   const name = this.animationComponent.defaultClip.name
    //   console.log('Animation.EventType.FINISHED', name)
    //   // 白名单: 这些动作完成后恢复到 idle 状态
    //   const whiteList = ['turn', 'block', 'attack']
    //   if (whiteList.some(item => name.includes(item))) {
    //     // this.setParams(PARAMS_NAME_ENUM.IDLE, true)
    //     this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
    //   }
    // })
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
