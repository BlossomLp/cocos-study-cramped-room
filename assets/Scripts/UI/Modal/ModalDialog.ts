import { _decorator, Component, instantiate, isValid, Label, Layout, Node, Prefab } from 'cc'
import { AUDIO_CLIP_ENUM } from '../../Audio/AudioConfig'
import { AudioManager } from '../../Audio/AudioManager'
const { ccclass, property } = _decorator

export interface ModalOptions {
  title?: string | null
  content?: string | Prefab
  showCancel?: boolean
  cancelText?: string
  okText?: string
  onOk?: () => void
  onCancel?: () => void
  footer?: Prefab | null // 传 null 则完全隐藏底层按钮
}

@ccclass('ModalDialog')
export class ModalDialog extends Component {
  @property(Node) windowNode: Node = null // Window 外壳
  @property(Node) headerNode: Node = null // Header
  @property(Label) titleLabel: Label = null

  @property(Node) contentAreaNode: Node = null // 新增：ContentArea 纯色容器
  @property(Node) bodyNode: Node = null // Body
  @property(Label) defaultTextLabel: Label = null

  @property(Node) footerNode: Node = null // Footer
  @property(Label) okBtnLabel: Label = null
  @property(Label) cancelBtnLabel: Label = null
  @property(Node) cancelBtnNode: Node = null

  private _options: ModalOptions = null

  public setup(options: ModalOptions) {
    this._options = options

    // 1. 处理页眉 (Header)
    if (options.title === null) {
      this.headerNode.active = false
    } else {
      this.headerNode.active = true
      if (options.title) this.titleLabel.string = options.title
    }

    // 2. 处理内容 (Body)
    if (typeof options.content === 'string') {
      this.defaultTextLabel.node.active = true
      this.defaultTextLabel.string = options.content
    } else if (options.content instanceof Prefab) {
      this.defaultTextLabel.node.active = false
      const customView = instantiate(options.content)
      this.bodyNode.addChild(customView)
    }

    // 3. 处理页脚 (Footer - 共享纯色背景内部)
    if (options.footer === null) {
      // 如果不需要底部按钮，隐藏 Footer。此时 ContentArea 会自动缩水，只包裹 Body
      this.footerNode.active = false
    } else if (options.footer instanceof Prefab) {
      this.footerNode.active = true
      this.footerNode.removeAllChildren()
      this.footerNode.addChild(instantiate(options.footer))
    } else {
      this.footerNode.active = true
      if (options.okText) this.okBtnLabel.string = options.okText
      if (options.cancelText) this.cancelBtnLabel.string = options.cancelText
      this.cancelBtnNode.active = options.showCancel !== false
    }

    // 🌟 核心刷新：强制刷新所有 Layout，防止引擎在同一帧渲染时出现尺寸未更新的闪烁
    this.scheduleOnce(() => {
      if (!isValid(this.node)) return

      // 从最内层往外层刷新机制
      if (this.bodyNode.active) this.bodyNode.getComponent(Layout)?.updateLayout()
      if (this.footerNode.active) this.footerNode.getComponent(Layout)?.updateLayout()

      // 刷新纯色背景层
      this.contentAreaNode.getComponent(Layout)?.updateLayout()
      // 刷新最外壳
      this.windowNode.getComponent(Layout)?.updateLayout()
    }, 0)
  }

  public onOkClick() {
    if (this._options?.onOk) this._options.onOk()
    AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_UI_CLICK)
    this.close()
  }

  public onCancelClick() {
    if (this._options?.onCancel) this._options.onCancel()
    AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_UI_CLICK)
    this.close()
  }

  public close() {
    if (isValid(this.node)) {
      AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_UI_CLICK)
      this.node.destroy()
    }
  }
}
