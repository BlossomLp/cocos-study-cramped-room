import { _decorator, Component, Node } from 'cc'
import { DataManager } from '../../RunTIme/DataManager'
import ResourceManager from '../../RunTIme/ResourceManager'
import { createUINode, randomByRange } from '../../Utils'
import { TileManager } from './TIleManager'
const { ccclass, property } = _decorator

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const { mapInfo } = DataManager.Instance

    // 加载瓦片资源
    const spriteFrames = await ResourceManager.Instance.loadResources('texture/tile/tile')
    // 绘制瓦片资源
    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      for (let j = 0; j < column.length; j++) {
        const { src, type } = column[j]
        if (src == null || type == null) continue

        const node: Node = createUINode()
        let num = src
        if ((num === 1 || num === 5 || num === 9) && i % 2 === 0 && j % 2 === 0) {
          num += randomByRange(0, 4)
        }

        const imgSrc = `tile (${num})`
        const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0]
        const tileManager: TileManager = node.addComponent(TileManager)
        tileManager.init(spriteFrame, i, j)

        node.setParent(this.node)
      }
    }
  }
}
