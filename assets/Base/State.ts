import { animation, AnimationClip, Sprite, SpriteFrame } from 'cc'
import ResourceManager from '../RunTIme/ResourceManager'
import { StateMachine } from './StateMachine'

const ANIMATION_SPEED = 1 / 8

/****
 *  1. 需要知道自己的 animationClip
 *  2. 需要有播放动画的能力 animationComponent.play()
 */
export default class State {
  private animationClip: AnimationClip

  constructor(
    /** 状态机 */
    private fsm: StateMachine,
    /** sprite资源路径 */
    private path: string,
    /** 循环模式 */
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
  ) {
    this.init()
  }

  async init() {
    const loadResPromise = ResourceManager.Instance.loadResources(this.path)
    this.fsm.waitingList.push(loadResPromise)
    const spriteFrames = await loadResPromise

    this.animationClip = new AnimationClip()

    const track = new animation.ObjectTrack() // 创建一个 对象轨道

    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')

    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item: SpriteFrame, index: number) => [
      ANIMATION_SPEED * index,
      item,
    ])

    console.log('spriteFrames', spriteFrames, frames)
    // track.channel.curve.assignSorted([
    //   [0.4, { value: 0.4 }],
    //   [0.6, { value: 0.6 }],
    //   [0.8, { value: 0.8 }],
    // ])
    track.channel.curve.assignSorted(frames)

    // 最后将轨道添加到动画剪辑以应用
    this.animationClip.addTrack(track)

    this.animationClip.name = this.path // 动画剪辑的名称

    this.animationClip.duration = frames.length * ANIMATION_SPEED // 整个动画剪辑的周期
    this.animationClip.wrapMode = this.wrapMode // 循环播放
  }

  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
