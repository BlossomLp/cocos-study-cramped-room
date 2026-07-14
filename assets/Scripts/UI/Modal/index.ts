import { director, instantiate, Prefab, resources } from 'cc'
import { ModalDialog, ModalOptions } from './ModalDialog'

export class Modal {
  private static _modalPrefab: Prefab = null

  /**
   * 呼出弹窗
   */
  public static show(options: ModalOptions) {
    // 如果已经加载过预制体，直接创建
    if (this._modalPrefab) {
      this.createNode(options)
      return
    }

    // 第一次调用时，动态加载 resources 里的预制体
    resources.load('prefabs/ModalBase', Prefab, (err, prefab) => {
      if (err) {
        console.error('加载 Modal 预制体失败:', err)
        return
      }
      this._modalPrefab = prefab
      this.createNode(options)
    })
  }

  private static createNode(options: ModalOptions) {
    const modalNode = instantiate(this._modalPrefab)
    const modalComponent = modalNode.getComponent(ModalDialog)

    if (modalComponent) {
      modalComponent.setup(options)
    }

    // 挂载到当前场景的 Canvas 或根节点下
    const canvas = director.getScene().getChildByName('Canvas')
    if (canvas) {
      canvas.addChild(modalNode)
      // 确保弹窗在最上层
      modalNode.setSiblingIndex(999)
    }
  }
}
