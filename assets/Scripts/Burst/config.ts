import { PARAMS_NAME_ENUM } from '../../Enum'

export interface IIintStateItem {
  param: PARAMS_NAME_ENUM
  path: string
}

/** 注册/初始化状态机参数 */
export const INIT_FSM_LIST: IIintStateItem[] = [
  { param: PARAMS_NAME_ENUM.IDLE, path: 'idle' },
  { param: PARAMS_NAME_ENUM.ATTACK, path: 'attack' },
  { param: PARAMS_NAME_ENUM.DEATH, path: 'death' },
]
