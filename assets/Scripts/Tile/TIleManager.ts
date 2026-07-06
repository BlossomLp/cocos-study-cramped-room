import { _decorator, Component, Sprite, SpriteFrame, UITransform } from 'cc'
import { TILE_TYPE_ENUM } from '../../Enum'
const { ccclass, property } = _decorator

/** 瓦片宽度 */
export const TILE_WIDTH = 55
/** 瓦片高度 */
export const TILE_HEIGHT = 55

/** 瓦片配置 */
const TILE_CONFIG = {
  // 墙体：不可移动，不可转向
  [TILE_TYPE_ENUM.WALL_ROW]: { moveable: false, turnable: false },
  [TILE_TYPE_ENUM.WALL_COLUMN]: { moveable: false, turnable: false },
  [TILE_TYPE_ENUM.WALL_LEFT_TOP]: { moveable: false, turnable: false },
  [TILE_TYPE_ENUM.WALL_RIGHT_TOP]: { moveable: false, turnable: false },
  [TILE_TYPE_ENUM.WALL_LEFT_BOTTOM]: { moveable: false, turnable: false },
  [TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM]: { moveable: false, turnable: false },
  // 悬崖：不可移动，可转向
  [TILE_TYPE_ENUM.CLIFF_LEFT]: { moveable: false, turnable: true },
  [TILE_TYPE_ENUM.CLIFF_CENTER]: { moveable: false, turnable: true },
  [TILE_TYPE_ENUM.CLIFF_RIGHT]: { moveable: false, turnable: true },
  // 地板：可移动，可转向
  [TILE_TYPE_ENUM.FLOOR]: { moveable: true, turnable: true },
}

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM
  moveable: boolean
  turnable: boolean

  init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
    this.type = type
    // 根据类型判断是否 可移动 & 可转向
    if (TILE_CONFIG[type]) {
      this.moveable = TILE_CONFIG[type].moveable
      this.turnable = TILE_CONFIG[type].turnable
    }

    const sprite = this.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)

    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}
