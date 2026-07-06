import { _decorator, Component, Sprite, UITransform } from 'cc'
import {
  CONTROLLER_ENUM,
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
} from '../../Enum'
import { EventManager } from '../../RunTIme/EventManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TIleManager'
import { PlayerStateMachine } from './PlayerStateMachine'
const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends Component {
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

  /** 状态机 */
  fsm: PlayerStateMachine

  /** 当前动作 */
  private _state: ENTITY_STATE_ENUM

  get state() {
    return this._state
  }

  set state(value: ENTITY_STATE_ENUM) {
    this._state = value
    this.fsm.setParams(this._state, true)
  }

  /** 当前方向 */
  private _direction: DIRECTION_ENUM

  get direction() {
    return this._direction
  }

  set direction(value: DIRECTION_ENUM) {
    this._direction = value
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.move)
  }

  async init() {
    const sprite = this.node.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transfrom = this.getComponent(UITransform)
    transfrom.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    // 设置人物初始状态
    // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
    this.state = ENTITY_STATE_ENUM.IDLE
  }

  protected update() {
    this.updatePos()
    // 人物是瓦片4倍 需要做偏移
    this.node.setPosition(this.x * TILE_WIDTH - 1.5 * TILE_WIDTH, this.y * TILE_HEIGHT - 1.5 * TILE_WIDTH)
  }

  updatePos() {
    console.log('updatePos', this.targetX, this.targetY, this.x, this.y)

    // 防止鬼畜
    if (Math.abs(this.targetX - this.x) < 0.1 && Math.abs(this.targetY - this.y) < 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    } else {
      if (this.x < this.targetX) {
        this.x += this.speed
      } else if (this.x > this.targetX) {
        this.x -= this.speed
      }

      if (this.y < this.targetY) {
        this.y += this.speed
      } else if (this.y > this.targetY) {
        this.y -= this.speed
      }
    }
  }

  move(inputDirection: CONTROLLER_ENUM) {
    console.log('inputDirection', inputDirection)
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.targetY += 1
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.targetY -= 1
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.targetX -= 1
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.targetX += 1
    }
    // 左转
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
}
