import { EnemyManager } from '../Base/EnemyManager'
import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
import { BurstManager } from '../Scripts/Burst/BurstManager'
import { PlayerManager } from '../Scripts/Player/PlayerManager'
import { SpikesManager } from '../Scripts/Spikes/SpikesManager'
import { TileManager } from '../Scripts/Tile/TIleManager'
import { DoorManager } from './../Scripts/Door/DoorManager'

export class DataManager extends Singleton {
  static get Instance() {
    return super.getInstance<DataManager>()
  }
  /** 地图瓦片信息 */
  tileMapInfo: Array<Array<TileManager>>
  /** 地图信息 */
  mapInfo: Array<Array<ITile>>
  /** 地图行数 */
  mapRowCount: number
  /** 地图列数 */
  mapColumnCount: number
  levelIndex: number = 2
  /** Player */
  player: PlayerManager
  /** Enemies */
  enemies: EnemyManager[] = []
  /** Door */
  door: DoorManager
  /** 地裂(陷阱) */
  bursts: BurstManager[] = []
  /** 尖刺(陷阱) */
  spikes: SpikesManager[] = []

  reset() {
    this.tileMapInfo = []
    this.mapInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.player = null
    this.enemies = []
    this.door = null
    this.bursts = []
    this.spikes = []
  }
}
