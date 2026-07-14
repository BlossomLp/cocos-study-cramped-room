import { _decorator } from 'cc'
import { EntityManager } from '../../Base/EntityManager'
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum'
import { IEntity } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import { AUDIO_CLIP_ENUM } from '../Audio/AudioConfig'
import { AudioManager } from '../Audio/AudioManager'
import { DoorStateMachine } from './DoorStateMachine'
const { ccclass, property } = _decorator

/**
 * 门管理器类，继承自实体管理器(EntityManager)
 * 用于管理门的开/关
 */
@ccclass('DoorManager')
export class DoorManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(DoorStateMachine)
    await this.fsm.init()
    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
  }

  onDestroy(): void {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen)
  }
  /**
   * 开门（怪物死完了 && 人没死）
   */
  onOpen() {
    const { enemies, player } = DataManager.Instance
    if (enemies.every(item => item.state === ENTITY_STATE_ENUM.DEATH) && player.state != ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.DEATH
      AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_DOOR_OPEN)
    }
  }
}
