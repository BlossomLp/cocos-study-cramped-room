import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../Enum'
import { IEntity } from '../Levels'
import { DataManager } from '../RunTIme/DataManager'
import { EventManager } from '../RunTIme/EventManager'
import { EntityManager } from './EntityManager'
const { ccclass, property } = _decorator

/**
 * 怪物管理器类，继承自实体管理器(EntityManager)
 * 木骷髅 铁骷髅（区别：铁骷髅不会攻击）
 */
@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {
  async init(params: IEntity) {
    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)

    this.onChangeDirection(true)
  }

  onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
    super.onDestroy()
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
    if (this.state === ENTITY_STATE_ENUM.DEATH) return
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

  onDead(id: string) {
    if (id === this.id && this.state !== ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}
