import { _decorator, Component, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TIleManager'
import { StateMachine } from '../../Base/StateMachine'
import {
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from '../../Enum'
import { AUDIO_CLIP_ENUM } from '../Audio/AudioConfig'
import { AudioManager } from '../Audio/AudioManager'
import { ISpikes } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import { SpikesStateMachine } from './SpikesStateMachine'
const { ccclass, property } = _decorator

/**
 * 地刺管理器
 * 因为和其他Entity不同，地刺不需要方向（有count），所以单独写一个管理器
 * count 为地刺的个数
 * currentCount 为当前地刺状态 （每个地刺实体有 count+2 个状态，空 -> 1个刺准备 ... n个刺准备 -> 刺出）
 */

@ccclass('SpikesManager')
export class SpikesManager extends Component {
  type: ENTITY_TYPE_ENUM
  /** 坐标 x */
  x: number = 0
  /** 坐标 y */
  y: number = 0

  /** 状态机 */
  fsm: StateMachine

  /** 总状态数 */
  _totalCount: number
  /** 当前状态数 */
  _count: number = 0

  get totalCount() {
    return this._totalCount
  }

  set totalCount(v: number) {
    this._totalCount = v
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, v)
  }

  get count() {
    return this._count
  }

  set count(v: number) {
    this._count = v
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, v)
  }

  async init(params: ISpikes) {
    const sprite = this.node.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.node.addComponent(SpikesStateMachine)
    await this.fsm.init()

    const { type, x, y, count } = params
    this.type = type
    // 设置初始状态
    this.x = x
    this.y = y
    this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[type]
    this.count = count
    // 初始化完成再绑定 - 防止人物操作时加载不到资源
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoopCount, this)
  }

  /**
   * 更新角色位置的方法
   * 该方法负责更新角色在游戏场景中的位置，通过计算瓦片坐标转换为屏幕坐标
   */
  protected update() {
    // 人物是瓦片4倍 需要做偏移
    this.node.setPosition(this.x * TILE_WIDTH - 1.5 * TILE_WIDTH, -this.y * TILE_HEIGHT + 1.5 * TILE_WIDTH)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoopCount)
  }

  /** 循环切换count */
  onLoopCount() {
    const player = DataManager.Instance.player
    if (!player) return
    const targetCount = this.count + 1
    if (targetCount > this.totalCount) {
      this.count = 0
    } else {
      this.count = targetCount
    }
    this.checkAttack()
    AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_SPIKES_TICK)
  }

  checkAttack() {
    const { x: playerX, y: playerY } = DataManager.Instance.player
    if (playerX === this.x && playerY === this.y && this.count === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    }
  }
}
