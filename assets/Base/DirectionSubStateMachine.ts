import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import { SubStateMachine } from './SubStateMachine'

export default class DirectionSubStateMachine extends SubStateMachine {
  run() {
    // 获取目标状态方向
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
    // 设置角色状态方向
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}
