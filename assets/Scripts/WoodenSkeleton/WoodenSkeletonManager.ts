import { _decorator } from 'cc'
import { EntityManager } from '../../Base/EntityManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum'
import { IEntity } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine'
const { ccclass, property } = _decorator

/**
 * 木骷髅管理器类，继承自实体管理器(EntityManager)
 * 用于管理木骷髅实体的行为和属性
 */
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  /** 角色坐标 x */
  x: number = 0
  /** 角色坐标 y */
  y: number = 0

  async init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)

    this.onChangeDirection(true)
  }

  onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection)
  }

  /**
   * 改变方向的方法，根据玩家和当前对象的位置关系来调整方向
   * @param isInit - 是否为初始化调用，默认为false
   */
  onChangeDirection(isInit: boolean = false) {
    // 从DataManager中获取玩家实例
    const player = DataManager.Instance.player
    // 如果玩家不存在，则直接返回
    if (!player) return
    // 解构玩家的x和y坐标
    const { x: playerX, y: playerY } = player
    // 计算玩家和当前对象在x轴和y轴上的距离
    const disX = Math.abs(playerX - this.x)
    const disY = Math.abs(playerY - this.y)
    // 如果x和y方向的距离相等且不是初始化调用，则直接返回
    if (disX === disY && !isInit) return

    if (playerX >= this.x && playerY <= this.y) {
      // 第一象限
      this.direction = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP
    } else if (playerX >= this.x && playerY >= this.y) {
      // 第二象限
      this.direction = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM
    } else if (playerX < this.x && playerY >= this.y) {
      // 第三象限
      this.direction = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM
    } else if (playerX < this.x && playerY < this.y) {
      // 第四象限
      this.direction = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP
    }
  }

  onAttack() {
    const player = DataManager.Instance.player
    if (!player) return
    const { x: playerX, y: playerY, state } = player
    // 玩家已死
    const isPlayerDead = state === ENTITY_STATE_ENUM.DEATH || state === ENTITY_STATE_ENUM.AIRDEATH
    if (isPlayerDead) {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
    // 如果玩家在当前对象的上下左右一格内，则进入攻击状态
    else if (
      (playerX === this.x && (playerY === this.y - 1 || playerY === this.y + 1)) ||
      (playerY === this.y && (playerX === this.x - 1 || playerX === this.x + 1))
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      // 通知玩家去死，死法：地面死
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }
}
