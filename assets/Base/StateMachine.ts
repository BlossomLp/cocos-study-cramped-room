import { _decorator, Animation, Component, SpriteFrame } from 'cc'
import { FSM_PARAM_TYPE_ENUM } from '../Enum'
import State from './State'
const { ccclass, property } = _decorator

export type ParamsValueType = boolean | number
export interface IParamsValue {
  type: FSM_PARAM_TYPE_ENUM
  value: ParamsValueType
}

export const getInitParamsTrigger = () => ({
  type: FSM_PARAM_TYPE_ENUM.TRIGGER,
  value: false,
})

export const getInitParamsNumber = () => ({
  type: FSM_PARAM_TYPE_ENUM.NUMBER,
  value: 0,
})
/****
 * * 有限状态机
 */
@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  params: Map<string, IParamsValue> = new Map()
  stateMachines: Map<string, State> = new Map()
  animationComponent: Animation

  waitingList: Array<Promise<SpriteFrame[]>> = []

  getParams(paramsName: string) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }

  /**
   * 修改状态参数
   * 触发trigger
   */
  setParams(paramsName: string, value: ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      this.run()
      this.resetTrigger()
    }
  }

  /** 当前状态 */
  private _currentState: State = null

  get currentState() {
    return this._currentState
  }

  set currentState(state: State) {
    this._currentState = state
    this._currentState.run()
  }

  /** 清空Trigger状态 */
  resetTrigger() {
    // 动画播放完毕后将所有状态参数重置为false
    for (const [_, paramValue] of this.params) {
      if (paramValue.type === FSM_PARAM_TYPE_ENUM.TRIGGER) {
        paramValue.value = false
      }
    }
  }

  abstract init(): void
  abstract run(): void
}
