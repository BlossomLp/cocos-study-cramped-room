import { Layers, Node, UITransform } from 'cc'

/** 创建带有UITransform的节点 */
export const createUINode = (name: string = ''): Node => {
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0, 1)
  node.layer = 1 << Layers.nameToLayer('UI_2D')
  return node
}

/** 生成 min ~ max 之间的随机数 */
export const randomByRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min)
}

const sortFrameReg: RegExp = /\((\d+)\)/
const getFrameIndex = (frameName: string): number => {
  const match = frameName.match(sortFrameReg)
  if (match) {
    return parseInt(match[1])
  }
  return 0
}
/** 帧动画排序 */
export const sortSpriteFrames = arr => arr.sort((a, b) => getFrameIndex(a.name) - getFrameIndex(b.name))
