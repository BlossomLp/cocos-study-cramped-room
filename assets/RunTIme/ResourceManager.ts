import { resources, SpriteFrame } from 'cc'
import Singleton from '../Base/Singleton'

export default class ResourceManager extends Singleton {
  static get Instance() {
    return super.getInstance<ResourceManager>()
  }

  /**
   * 加载瓦片地图精灵资源
   * @param path 资源路径
   * @param type 资源类型
   * @returns
   */
  loadResources(path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(path, type, function (err, assets) {
        if (err) {
          reject(err)
          return
        }
        resolve(assets)
      })
    })
  }
}
