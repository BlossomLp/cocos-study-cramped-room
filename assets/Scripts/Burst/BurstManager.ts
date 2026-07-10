import { _decorator, UITransform } from 'cc'
import { EntityManager } from '../../Base/EntityManager'
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum'
import { IEntity } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TIleManager'
import { BurstStateMachine } from './BurstStateMachine'
const { ccclass, property } = _decorator

/**
 * 地裂管理器类，继承自敌人管理器(EntityManager)
 * 用于管理地裂实体的行为和属性
 * ps: 地裂素材不是4倍图，不需要【缩放】和【偏移】
 */
@ccclass('BurstManager')
export class BurstManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(BurstStateMachine)
    await this.fsm.init()
    super.init(params)
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
  }

  onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
  }

  onBurst() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) return
    const player = DataManager.Instance.player
    if (!player) return
    const { x: playerX, y: playerY } = player
    // 人物踩到地裂
    const isCollision = playerX === this.x && playerY === this.y
    // 人物踩到地裂
    if (isCollision && this.state === ENTITY_STATE_ENUM.IDLE) {
      // 刚踩到 -> 攻击
      this.state = ENTITY_STATE_ENUM.ATTACK
    } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
      // 如果已经是攻击状态 则 -> 死亡
      this.state = ENTITY_STATE_ENUM.DEATH
      if (isCollision) {
        // 地裂消失时 人物踩上则 -> 人物死亡，死法：空中死
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH)
      }
    }
  }
}
