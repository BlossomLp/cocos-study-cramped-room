import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
import { PlayerManager } from '../Scripts/Player/PlayerManager'
import { TileManager } from '../Scripts/Tile/TIleManager'
import { WoodenSkeletonManager } from '../Scripts/WoodenSkeleton/WoodenSkeletonManager'

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
  levelIndex: number = 1
  /** Player */
  player: PlayerManager
  /** Enemies */
  enemies: WoodenSkeletonManager[] = []

  reset() {
    this.tileMapInfo = []
    this.mapInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.player = null
    this.enemies = []
  }
}
