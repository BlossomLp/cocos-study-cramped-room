import { _decorator, Component, Node } from 'cc'
import { ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum'
import Levels, { ILevel } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import { createUINode } from '../../Utils'
import { BurstManager } from '../Burst/BurstManager'
import { DoorManager } from '../Door/DoorManager'
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager'
import { PlayerManager } from '../Player/PlayerManager'
import { SpikesManager } from '../Spikes/SpikesManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TIleManager'
import { TileMapManager } from '../Tile/TileMapManager'
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager'
const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  /** 地图等级 */
  level: ILevel
  /** 舞台 */
  stage: Node

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }

  start() {
    this.generateStage()
    this.initLevel()
  }

  /**
   * * 初始化关卡
   */
  initLevel() {
    const level: ILevel = Levels[`level${DataManager.Instance.levelIndex}`]

    console.log('当前关卡', DataManager.Instance.levelIndex, level)

    if (level) {
      this.clearLevel()

      this.level = level

      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length

      this.generateTileMap()

      this.generateEnemies()

      this.generateDoor()

      this.generateBursts()

      this.generateSpikes()

      this.generatePlayer()
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
   * * 适配位置
   */
  adaptPosition() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = (mapRowCount * TILE_WIDTH) / 2
    const disY = (mapColumnCount * TILE_HEIGHT) / 2 + 80

    this.stage.setPosition(-disX, disY)
  }
}
