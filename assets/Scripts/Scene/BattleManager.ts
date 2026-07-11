import { _decorator, Component, Node } from 'cc'
import FaderManager from '../../Base/FaderManager'
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum'
import Levels, { ILevel } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import { createUINode } from '../../Utils'
import { BurstManager } from '../Burst/BurstManager'
import { DoorManager } from '../Door/DoorManager'
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager'
import { PlayerManager } from '../Player/PlayerManager'
import { ShakeManager } from '../Shake/ShakeManager'
import { SmokeManager } from '../Smoke/SmokeManager'
import { SpikesManager } from '../Spikes/SpikesManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TIleManager'
import { TileMapManager } from '../Tile/TileMapManager'
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager'
const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  /** 地图等级 */
  private level: ILevel
  /** 舞台 */
  private stage: Node = null
  /** 烟雾层 */
  private smokeLayer: Node = null

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke)
  }

  start() {
    this.generateStage()
    this.initLevel()
  }

  /**
   * * 初始化关卡
   */
  async initLevel() {
    const level: ILevel = Levels[`level${DataManager.Instance.levelIndex}`]

    console.log('当前关卡', DataManager.Instance.levelIndex, level)

    if (level) {
      this.clearLevel()

      this.level = level

      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length
      FaderManager.Instance.fader.fadeIn()
      await Promise.all([
        this.generateTileMap(),
        this.generateEnemies(),
        this.generateDoor(),
        this.generateBursts(),
        this.generateSpikes(),
        this.generateSmokeLayer(),
        this.generatePlayer(),
      ])
      FaderManager.Instance.fader.fadeOut()
    }
  }

  /**
   * * 下一关
   */
  nextLevel() {
    DataManager.Instance.levelIndex++
    this.initLevel()
  }

  /**
   * * 清空关卡
   */
  clearLevel() {
    this.stage.destroyAllChildren()
    DataManager.Instance.reset()
  }

  /**
   * * 生成舞台
   */
  generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
    this.stage.addComponent(ShakeManager)
  }

  /**
   * * 生成瓦片地图
   */
  async generateTileMap() {
    const tileMap: Node = createUINode()
    tileMap.setParent(this.stage)

    const tileMapManager = tileMap.addComponent(TileMapManager)

    await tileMapManager.init()

    this.adaptPosition()
  }

  /**
   * * 生成角色
   */
  async generatePlayer() {
    const player: Node = createUINode()
    player.setParent(this.stage)

    const playerManager = player.addComponent(PlayerManager)
    await playerManager.init(this.level.player)
    DataManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  /**
   * * 生成敌人
   */
  async generateEnemies() {
    const promises = []
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemyNode: Node = createUINode()
      enemyNode.setParent(this.stage)
      const enemy = this.level.enemies[i]
      if (enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN) {
        const enemyManager = enemyNode.addComponent(WoodenSkeletonManager)
        // console.log(`【生成敌人】木骷髅 --->`, enemy)
        promises.push(enemyManager.init(this.level.enemies[i]))
        DataManager.Instance.enemies.push(enemyManager)
      } else if (enemy.type === ENTITY_TYPE_ENUM.SKELETON_IRON) {
        const enemyManager = enemyNode.addComponent(IronSkeletonManager)
        // console.log(`【生成敌人】铁骷髅 --->`, enemy)
        promises.push(enemyManager.init(this.level.enemies[i]))
        DataManager.Instance.enemies.push(enemyManager)
      }
    }

    await Promise.all(promises)
  }

  /**
   * * 生成门
   */
  async generateDoor() {
    const door: Node = createUINode()
    door.setParent(this.stage)

    const doorManager = door.addComponent(DoorManager)
    await doorManager.init(this.level.door)
    DataManager.Instance.door = doorManager
  }

  /**
   * * 生成地裂
   */
  async generateBursts() {
    const promises = []
    for (let i = 0; i < this.level.bursts.length; i++) {
      const burstNode: Node = createUINode()
      burstNode.setParent(this.stage)
      const burstManager = burstNode.addComponent(BurstManager)

      const burst = this.level.bursts[i]
      promises.push(burstManager.init(this.level.bursts[i]))
      DataManager.Instance.bursts.push(burstManager)
    }

    await Promise.all(promises)
  }

  /**
   * * 生成尖刺
   */
  async generateSpikes() {
    const promises = []
    for (let i = 0; i < this.level.spikes.length; i++) {
      const spikesNode: Node = createUINode()
      spikesNode.setParent(this.stage)
      const spikesManager = spikesNode.addComponent(SpikesManager)

      const spike = this.level.spikes[i]
      promises.push(spikesManager.init(spike))
      DataManager.Instance.spikes.push(spikesManager)
    }

    await Promise.all(promises)
  }

  /**
   * * 生成烟雾层
   * 提前生成 防止出现后生成遮盖人物
   */
  generateSmokeLayer() {
    this.smokeLayer = createUINode()
    this.smokeLayer.setParent(this.stage)
  }
  /**
   * * 生成烟雾
   */
  async generateSmoke(x, y, direction) {
    // 加入缓存池 循环利用烟雾实例
    const deadSmoke = DataManager.Instance.smokes.find(smoke => smoke.state === ENTITY_STATE_ENUM.DEATH)
    if (deadSmoke) {
      deadSmoke.x = x
      deadSmoke.y = y
      deadSmoke.direction = direction
      deadSmoke.state = ENTITY_STATE_ENUM.IDLE
      deadSmoke.updatePosition()
    } else {
      const smokeNode: Node = createUINode()
      smokeNode.setParent(this.smokeLayer)
      const smokeManager = smokeNode.addComponent(SmokeManager)
      await smokeManager.init({
        type: ENTITY_TYPE_ENUM.SMOKE,
        x,
        y,
        state: ENTITY_STATE_ENUM.IDLE,
        direction,
      })
      DataManager.Instance.smokes.push(smokeManager)
    }
    // console.log(`【生成烟雾】当前烟雾列表 --->`, DataManager.Instance.smokes)
  }

  /**
   * * 适配位置
   */
  adaptPosition() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = (mapRowCount * TILE_WIDTH) / 2
    const disY = (mapColumnCount * TILE_HEIGHT) / 2 + 80
    // 防止振动导致计算错误
    this.stage.getComponent(ShakeManager).stop()
    this.stage.setPosition(-disX, disY)
  }

  /**
   * * 检查玩家是否过关
   */
  checkArrived() {
    const player = DataManager.Instance.player
    const door = DataManager.Instance.door
    if (!player || !door) return

    const { x: playerX, y: playerY, state: playerState } = player
    const { x: doorX, y: doorY, state: doorState } = door

    if (
      playerState !== ENTITY_STATE_ENUM.DEATH &&
      doorState === ENTITY_STATE_ENUM.DEATH &&
      playerX === doorX &&
      playerY === doorY
    ) {
      EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
  }
}
