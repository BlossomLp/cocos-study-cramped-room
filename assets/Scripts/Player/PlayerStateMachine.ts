import { _decorator, Animation, AnimationClip } from 'cc'
import State from '../../Base/State'
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine'
import { PARAMS_NAME_ENUM } from '../../Enum'
const { ccclass, property } = _decorator

/****
 * * 有限状态机
 */
@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
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
    const initParams = [PARAMS_NAME_ENUM.IDLE, PARAMS_NAME_ENUM.TURNLEFT]
    initParams.forEach(key => {
      this.params.set(key, getInitParamsTrigger())
    })
    // 方向
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  initStateMachines() {
    const self = this
    const initParams = [
      { key: PARAMS_NAME_ENUM.IDLE, path: 'texture/player/idle/top', wrapMode: AnimationClip.WrapMode.Loop },
      { key: PARAMS_NAME_ENUM.TURNLEFT, path: 'texture/player/turnleft/top' },
    ]
    initParams.forEach(({ key, path, wrapMode }) => {
      self.stateMachines.set(key, new State(self, path, wrapMode))
    })
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      console.log('Animation.EventType.FINISHED', name)

      const whiteList = ['turn']
      if (whiteList.some(item => name.includes(item))) {
        this.setParams(PARAMS_NAME_ENUM.IDLE, true)
      }
    })
  }

  run() {
    // 当前状态
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
        if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
