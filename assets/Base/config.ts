import { DIRECTION_ENUM } from '../Enum'

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
