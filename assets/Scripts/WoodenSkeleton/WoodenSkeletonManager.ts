import { _decorator } from 'cc'
import { EnemyManager } from '../../Base/EnemyManager'
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum'
import { IEntity } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import { AUDIO_CLIP_ENUM } from '../Audio/AudioConfig'
import { AudioManager } from '../Audio/AudioManager'
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine'
const { ccclass, property } = _decorator

/**
 * 木骷髅管理器类，继承自敌人管理器(EnemyManager)
 * 用于管理木骷髅实体的行为和属性
 */
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  onDestroy(): void {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
  }

  onAttack() {
    const player = DataManager.Instance.player
    if (!player) return
    if (this.state === ENTITY_STATE_ENUM.DEATH) return
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

  onAttackSound() {
    AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_ATTACK)
  }
}
