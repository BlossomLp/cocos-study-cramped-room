import { SubStateMachine } from '../../Base/SubStateMachine'
import { PARAMS_NAME_ENUM } from '../../Enum'
import DeathSubStateMachine from './DeathSubStateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'

export interface IIintStateItem {
  param: PARAMS_NAME_ENUM
  cls: new (...args: any[]) => SubStateMachine
}

/** 注册/初始化状态机参数 */
export const INIT_FSM_LIST: IIintStateItem[] = [
  { param: PARAMS_NAME_ENUM.IDLE, cls: IdleSubStateMachine },
  { param: PARAMS_NAME_ENUM.DEATH, cls: DeathSubStateMachine },
]
