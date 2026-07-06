import { _decorator, Component, Node } from 'cc'
import { EVENT_ENUM } from '../../Enum'
import Levels, { ILevel } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import { createUINode } from '../../Utils'
import { PlayerManager } from '../Player/PlayerManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TIleManager'
import { TileMapManager } from '../Tile/TileMapManager'
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
    this.genatrateStage()
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
  genatrateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
  }

  /**
   * * 生成瓦片地图
   */
  generateTileMap() {
    const tileMap: Node = createUINode()
    tileMap.setParent(this.stage)

    const tileMapManager = tileMap.addComponent(TileMapManager)

    tileMapManager.init()

    this.adaptPosition()
  }

  /**
   * * 生成瓦片地图
   */
  generatePlayer() {
    const player: Node = createUINode()
    player.setParent(this.stage)

    const playerManager = player.addComponent(PlayerManager)
    console.log(`this.level.player --->`, this.level.player)
    playerManager.init(this.level.player)
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
