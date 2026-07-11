import { _decorator, Component, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TIleManager'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import { IEntity } from '../Levels'
import { genRandomStrByLen } from '../Utils'
import { StateMachine } from './StateMachine'
const { ccclass, property } = _decorator

@ccclass('EntityManager')
export class EntityManager extends Component {
  id: string = genRandomStrByLen(10)
  type: ENTITY_TYPE_ENUM
  /** 角色坐标 x */
  x: number = 0
  /** 角色坐标 y */
  y: number = 0

  /** 状态机 */
  fsm: StateMachine

  /** 当前动作 */
  private _state: ENTITY_STATE_ENUM

  /**
   * 获取状态的getter方法
   * 这是一个访问器属性，用于获取对象内部的_state值
   * @returns {ENTITY_STATE_ENUM} 返回内部状态_state的值
   */
  get state() {
    return this._state
  }

  /**
   * 设置状态的访问器方法
   * @param value - 要设置的实体状态值，类型为 ENTITY_STATE_ENUM 枚举
   * 当状态被设置时，会更新内部状态值，并通知有限状态机(FSM)更新参数
   */
  set state(value: ENTITY_STATE_ENUM) {
    // 更新内部状态变量
    this._state = value
    // 通知有限状态机更新参数，第二个参数 true 表示强制更新
    this.fsm.setParams(this._state, true)
  }

  /** 当前方向 */
  private _direction: DIRECTION_ENUM

  /**
   * 获取方向属性的getter方法
   * @returns {DIRECTION_ENUM} 返回内部_direction属性的值
   */
  get direction() {
    return this._direction
  }

  /**
   * 设置方向属性的方法
   * @param value - 方向枚举值，类型为DIRECTION_ENUM
   */
  set direction(value: DIRECTION_ENUM) {
    // 将传入的方向值赋给私有属性_direction
    this._direction = value
    if (!this.fsm) {
      debugger
    }
    // 在有限状态机中设置方向参数，使用DIRECTION_ORDER_ENUM映射对应的顺序值
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }

  init(params: IEntity) {
    console.log('EntityManager init', params)
    const sprite = this.node.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
    // this.fsm = this.addComponent(PlayerStateMachine)
    // await this.fsm.init()
    const { type, x, y, state, direction } = params
    this.type = type
    // 设置人物初始状态
    // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
    this.x = x
    this.y = y
    this.state = state
    // 设置人物初始方向
    this.direction = direction
  }
  onDestroy() {}

  updatePosition() {
    // 人物是瓦片4倍 需要做偏移
    this.node.setPosition(this.x * TILE_WIDTH - 1.5 * TILE_WIDTH, -this.y * TILE_HEIGHT + 1.5 * TILE_WIDTH)
  }
  /**
   * 更新角色位置的方法
   * 该方法负责更新角色在游戏场景中的位置，通过计算瓦片坐标转换为屏幕坐标
   */
  protected update() {
    this.updatePosition()
  }
}
