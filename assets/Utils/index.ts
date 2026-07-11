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

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
/**
 * 根据指定长度生成随机字符串
 * @param len - 要生成的随机字符串的长度
 * @returns 返回生成的随机字符串
 */
export const genRandomStrByLen = (len: number) => {
  let str = '' // 用于存储生成的随机字符串
  for (let i = 0; i < len; i++) {
    // 循环len次，每次生成一个随机字符
    // 从chars字符串中随机选择一个字符，并拼接到str上
    str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return str
}

/** 从对象中挑选出指定key的属性 */
export function pickPropsToObj<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>

  keys.forEach(key => {
    result[key] = obj[key]
  })

  return result
}

export function assignProps<T extends object, K extends keyof T>(
  target: T,
  source: Pick<T, K>,
  keys: readonly K[],
): void {
  keys.forEach(key => {
    target[key] = source[key]
  })
}
