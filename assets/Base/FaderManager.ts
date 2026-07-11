import { director, RenderRoot2D } from 'cc'
import { DrawManager } from '../Scripts/UI/DrawManager'
import { createUINode } from '../Utils'
import Singleton from './Singleton'

export default class FaderManager extends Singleton {
  static get Instance() {
    return super.getInstance<FaderManager>()
  }

  private _fader: DrawManager = null

  get fader() {
    if (this._fader) {
      return this._fader
    }
    const root = createUINode()
    root.addComponent(RenderRoot2D)
    const node = createUINode()
    node.setParent(root)
    this._fader = node.addComponent(DrawManager)
    this._fader.init()
    director.addPersistRootNode(root)
    return this._fader
  }
}
