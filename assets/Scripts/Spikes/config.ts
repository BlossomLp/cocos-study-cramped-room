import { SubStateMachine } from '../../Base/SubStateMachine'
import { ENTITY_TYPE_ENUM } from '../../Enum'
import SpikeFourSubStateMachine from './SpikeFourSubStateMachine'
import SpikeOneSubStateMachine from './SpikeOneSubStateMachine'
import SpikeThreeSubStateMachine from './SpikeThreeSubStateMachine'
import SpikeTwoSubStateMachine from './SpikeTwoSubStateMachine'

export interface IIintStateItem {
  param: ENTITY_TYPE_ENUM
  cls: new (...args: any[]) => SubStateMachine
}
/** 注册/初始化状态机参数 */
export const INIT_FSM_LIST: IIintStateItem[] = [
  {
    param: ENTITY_TYPE_ENUM.SPIKES_ONE,
    cls: SpikeOneSubStateMachine,
  },
  {
    param: ENTITY_TYPE_ENUM.SPIKES_TWO,
    cls: SpikeTwoSubStateMachine,
  },
  {
    param: ENTITY_TYPE_ENUM.SPIKES_THREE,
    cls: SpikeThreeSubStateMachine,
  },
  {
    param: ENTITY_TYPE_ENUM.SPIKES_FOUR,
    cls: SpikeFourSubStateMachine,
  },
]
