import { _decorator, BlockInputEvents, Color, Component, Graphics, Tween, tween, UITransform, view } from 'cc'
const { ccclass } = _decorator

const SCREEN_WIDTH: number = view.getVisibleSize().width
const SCREEN_HEIGHT: number = view.getVisibleSize().height

export const DEFAULT_FADE_DURATION: number = 200
@ccclass('DrawManager')
export class DrawManager extends Component {
  _timer = null
  ctx: Graphics
  block: BlockInputEvents
  public fadeState = {
    alpha: 0,
  }

  init() {
    // 画一个全屏黑色
    this.ctx = this.addComponent(Graphics)
    const transform = this.getComponent(UITransform)
    transform.setAnchorPoint(0.5, 0.5)

    // 加上阻止事件组件
    this.block = this.addComponent(BlockInputEvents)
    this.block.enabled = false
  }

  drawAlpha() {
    this.ctx.clear()
    this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this.ctx.fillColor = new Color(0, 0, 0, this.fadeState.alpha)
    this.ctx.fill()
    this.block.enabled = this.fadeState.alpha === 255
  }
  /**
   * 淡入效果方法
   * @param duration - 淡入持续时间，单位毫秒，默认值为 DEFAULT_FADE_DURATION 200
   * @returns 返回一个 Promise，淡出完成后 resolve
   */
  fadeIn(duration: number = DEFAULT_FADE_DURATION) {
    return new Promise<void>(resolve => {
      Tween.stopAllByTarget(this.fadeState)
      this.fadeState.alpha = 0
      tween(this.fadeState)
        .to(
          duration / 1000, // 转为 ms
          { alpha: 255 },
          {
            onUpdate: () => {
              this.drawAlpha()
            },
          },
        )
        .call(() => {
          resolve()
        })
        .start()
    })
  }

  /**
   * 淡出效果方法
   * @param duration - 淡出持续时间，单位毫秒，默认值为 DEFAULT_FADE_DURATION 200
   * @returns 返回一个 Promise，淡出完成后 resolve
   */
  fadeOut(duration: number = DEFAULT_FADE_DURATION) {
    return new Promise<void>(resolve => {
      // 停止所有针对 fadeState 的动画
      Tween.stopAllByTarget(this.fadeState)
      // 设置初始透明度为完全不透明（255）
      this.fadeState.alpha = 255
      // 创建并启动一个补间动画
      tween(this.fadeState)
        .to(
          duration / 1000, // 转为 ms
          { alpha: 0 },
          {
            onUpdate: () => {
              this.drawAlpha()
            },
          },
        )
        .call(() => {
          resolve()
        })
        .start()
    })
  }

  /**
   * 黑屏效果方法
   * @param duration - 持续时间，单位毫秒，默认值为 DEFAULT_FADE_DURATION 200
   * @returns 返回一个 Promise，淡出完成后 resolve
   */
  mask(duration: number = DEFAULT_FADE_DURATION) {
    this.fadeState.alpha = 255
    return new Promise<void>(resolve => {
      this.clearTimer()
      this._timer = setTimeout(resolve, duration)
    })
  }

  private clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer)
      this._timer = null
    }
  }
  onDestroy() {
    this.clearTimer()
  }
}
