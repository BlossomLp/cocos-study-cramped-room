import { DIRECTION_ENUM, SPIKES_COUNT_ENUM } from '../Enum'

export interface IDirectionsConf {
  path: string
  direction: DIRECTION_ENUM
}
/** 方向资源路径映射 */
export const DIRECTIONS_LIST: IDirectionsConf[] = [
  { path: 'top', direction: DIRECTION_ENUM.TOP },
  { path: 'bottom', direction: DIRECTION_ENUM.BOTTOM },
  { path: 'left', direction: DIRECTION_ENUM.LEFT },
  { path: 'right', direction: DIRECTION_ENUM.RIGHT },
]

/** 尖刺状态资源路径映射 */
export const SPIKES_LIST = [
  { path: 'zero', step: SPIKES_COUNT_ENUM.ZERO },
  { path: 'one', step: SPIKES_COUNT_ENUM.ONE },
  { path: 'two', step: SPIKES_COUNT_ENUM.TWO },
  { path: 'three', step: SPIKES_COUNT_ENUM.THREE },
  { path: 'four', step: SPIKES_COUNT_ENUM.FOUR },
  { path: 'five', step: SPIKES_COUNT_ENUM.FIVE },
]
