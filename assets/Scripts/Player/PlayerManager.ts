import { _decorator } from 'cc'
import { EntityManager } from '../../Base/EntityManager'
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum'
import { IEntity } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import { TileManager } from '../Tile/TIleManager'
const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  /** 角色坐标 x */
  x: number = 0
  /** 角色坐标 y */
  y: number = 0
  /** 角色移动目标坐标 x */
  targetX: number = 0
  /** 角色移动目标坐标 y */
  targetY: number = 0
  /** 角色移动速度 */
  private readonly speed: number = 0.1
  private _moveLock: boolean = false

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandle)
  }

  async init(params: IEntity) {
    // this.targetX = params.x
    // this.targetY = params.y
    // super.init(params)

    const player: IEntity = {
      x: 2,
      y: 8,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.PLAYER,
    }
    this.targetX = player.x
    this.targetY = player.y
    super.init(player)
  }

  /**
   * 更新角色位置的方法
   * 该方法负责更新角色在游戏场景中的位置，通过计算瓦片坐标转换为屏幕坐标
   */
  protected update() {
    // 首先更新角色的位置信息
    this.updatePos()
    super.update()
  }

  /**
   * 更新对象位置的方法
   * 用于平滑地移动对象到目标位置(targetX, targetY)
   */
  updatePos() {
    // console.log('updatePos', this.targetX, this.targetY, this.x, this.y) // 调试信息，用于打印当前位置和目标位置

    // 防止鬼畜：当当前位置与目标位置非常接近时，直接设置为目标位置，避免微小抖动
    if (Math.abs(this.targetX - this.x) < 0.1 && Math.abs(this.targetY - this.y) < 0.1) {
      this.x = this.targetX // 直接设置X坐标为目标值
      this.y = this.targetY // 直接设置Y坐标为目标值
    } else {
      // X轴方向移动逻辑
      if (this.x < this.targetX) {
        this.x += this.speed // 如果目标X在右侧，则向右移动
      } else if (this.x > this.targetX) {
        this.x -= this.speed // 如果目标X在左侧，则向左移动
      }

      // Y轴方向移动逻辑
      if (this.y < this.targetY) {
        this.y += this.speed // 如果目标Y在下方，则向下移动
      } else if (this.y > this.targetY) {
        this.y -= this.speed // 如果目标Y在上方，则向上移动
      }
    }
  }

  inputHandle(inputDirection: CONTROLLER_ENUM) {
    // 撞墙
    if (this.willBlock(inputDirection)) return
    this.move(inputDirection)
  }

  /**
   * 移动方法，根据输入方向控制目标位置或转向
   * @param inputDirection - 控制器输入的方向枚举值
   */
  move(inputDirection: CONTROLLER_ENUM) {
    // 根据输入方向更新目标位置
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.targetY -= 1 // 向上移动，Y坐标增加
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.targetY += 1 // 向下移动，Y坐标减少
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.targetX -= 1 // 向左移动，X坐标减少
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.targetX += 1 // 向右移动，X坐标增加
    }
    // 左转处理
    else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      // this.fsm.setParams(PARAMS_NAME_ENUM.TURNLEFT, true)
      this.state = ENTITY_STATE_ENUM.TURNLEFT
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }
    }
  }

  willBlock(inputDirection: CONTROLLER_ENUM) {
    const { tileMapInfo } = DataManager.Instance
    console.log('willBlock', inputDirection)
    const { direction, targetX, targetY } = this
    let x = Math.round(targetX)
    let y = Math.round(targetY)
    // ----- 移动 -----
    if (
      inputDirection === CONTROLLER_ENUM.TOP ||
      inputDirection === CONTROLLER_ENUM.BOTTOM ||
      inputDirection === CONTROLLER_ENUM.LEFT ||
      inputDirection === CONTROLLER_ENUM.RIGHT
    ) {
      // 要判断人物（moveable）和枪头（null || turnable）的目标位置
      // 根据输入方向 计算 【人物目标位置】
      if (inputDirection === CONTROLLER_ENUM.TOP) {
        y -= 1 // 向上移动，Y坐标增加
      } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
        y += 1 // 向下移动，Y坐标减少
      } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
        x -= 1 // 向左移动，X坐标减少
      } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
        x += 1 // 向右移动，X坐标增加
      }
      // 判断人物是否走到 【地图边界】
      if (x < 0 || y < 0 || x >= tileMapInfo.length || y >= tileMapInfo[0].length) return false
      let weaponX = x
      let weaponY = y
      // 根据人物朝向 计算 【枪头目标位置】
      if (direction === DIRECTION_ENUM.TOP) {
        weaponY = y - 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        weaponY = y + 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        weaponX = x - 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        weaponX = x + 1
      }
      const playerTile = tileMapInfo[x][y]
      const weaponTile = tileMapInfo[weaponX][weaponY]
      if (playerTile?.moveable && (!weaponTile || weaponTile.turnable)) return false

      return true
    }
    // ----- 转向 -----
    else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      // 转向要判断枪头到目标位置的途经位置2个(没有瓦片 || 瓦片可转向)
      let tile1: TileManager | null
      let tile2: TileManager | null
      if (direction === DIRECTION_ENUM.TOP) {
        tile1 = tileMapInfo[x - 1][y - 1]
        tile2 = tileMapInfo[x - 1][y]
      } else if (direction === DIRECTION_ENUM.LEFT) {
        tile1 = tileMapInfo[x - 1][y + 1]
        tile2 = tileMapInfo[x][y + 1]
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        tile1 = tileMapInfo[x + 1][y + 1]
        tile2 = tileMapInfo[x + 1][y]
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        tile1 = tileMapInfo[x + 1][y - 1]
        tile2 = tileMapInfo[x][y - 1]
      }
      console.log('tile1', tile1, tile1?.turnable)
      console.log('tile2', tile2, tile2?.turnable)
      if ((!tile1 || tile1.turnable) && (!tile2 || tile2.turnable)) {
        return false
      }

      return true
    }
  }
}
