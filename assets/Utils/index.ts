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
