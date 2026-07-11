import { _decorator, BlockInputEvents, Color, Component, Graphics, Tween, tween, UITransform, view } from 'cc'
const { ccclass } = _decorator

const SCREEN_WIDTH: number = view.getVisibleSize().width
const SCREEN_HEIGHT: number = view.getVisibleSize().height

export const DEFAULT_FADE_DURATION: number = 0.2
@ccclass('DrawManager')
export class DrawManager extends Component {
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

  fadeIn(duration: number = DEFAULT_FADE_DURATION) {
    return new Promise<void>(resolve => {
      Tween.stopAllByTarget(this.fadeState)
      this.fadeState.alpha = 0
      tween(this.fadeState)
        .to(
          duration,
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

  fadeOut(duration: number = DEFAULT_FADE_DURATION) {
    return new Promise<void>(resolve => {
      Tween.stopAllByTarget(this.fadeState)
      this.fadeState.alpha = 255
      tween(this.fadeState)
        .to(
          duration,
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
}
