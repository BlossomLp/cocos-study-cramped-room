import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
import { TileManager } from '../Scripts/Tile/TIleManager'

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

  reset() {
    this.tileMapInfo = []
    this.mapInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
  }
}
