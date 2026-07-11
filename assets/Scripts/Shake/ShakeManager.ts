import { _decorator, Component, tween, Tween, Vec3 } from 'cc'
import { EVENT_ENUM, SHAKE_TYPE_ENUM } from '../../Enum'
import { EventManager } from '../../RunTIme/EventManager'

const { ccclass } = _decorator

// 最大振幅（像素）
const SHAKE_AMOUNT = 8

// 持续时间(ms)
const DURATION = 200

// 频率(Hz)
const FREQUENCY = 12

@ccclass('ShakeManager')
export class ShakeManager extends Component {
  private isShaking = false

  private readonly _state = {
    time: 0,
  }

  private readonly _originPos = new Vec3()

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake)
  }

  onShake(direction: SHAKE_TYPE_ENUM) {
    if (this.isShaking) {
      return
    }

    this.isShaking = true

    this._originPos.set(this.node.position)

    this._state.time = 0

    Tween.stopAllByTarget(this._state)

    const duration = DURATION / 1000

    tween(this._state)
      .to(
        duration,
        { time: duration },
        {
          onUpdate: () => {
            this.onShakeUpdate(duration, direction)
          },
        },
      )
      .call(() => {
        this.node.setPosition(this._originPos)
        this.isShaking = false
      })
      .start()
  }

  /**
   * 阻尼正弦振动
   *
   * y = A * e^(-kt) * sin(2πft)
   */
  private onShakeUpdate(duration: number, direction: SHAKE_TYPE_ENUM) {
    const t = this._state.time

    // 归一化时间(0~1)
    const progress = t / duration

    // 指数衰减
    const amplitude = SHAKE_AMOUNT * Math.exp(-5 * progress)

    // 正弦偏移
    // const offset = Math.sin(t * FREQUENCY * Math.PI * 2) * amplitude
    // 转为余弦 - 保证第一帧体现方向性
    const offset = Math.cos(t * FREQUENCY * Math.PI * 2) * amplitude

    let x = this._originPos.x
    let y = this._originPos.y

    switch (direction) {
      case SHAKE_TYPE_ENUM.LEFT:
        x -= offset
        break

      case SHAKE_TYPE_ENUM.RIGHT:
        x += offset
        break

      case SHAKE_TYPE_ENUM.TOP:
        y += offset
        break

      case SHAKE_TYPE_ENUM.BOTTOM:
        y -= offset
        break
    }

    this.node.setPosition(x, y, this._originPos.z)
  }

  stop() {
    Tween.stopAllByTarget(this._state)
    this.node.setPosition(this._originPos)
    this.isShaking = false
  }
}
