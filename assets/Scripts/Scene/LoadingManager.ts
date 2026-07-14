import { _decorator, Component, director, ProgressBar, resources } from 'cc'
import { SCENE_ENUM } from '../../Enum'
import { AudioManager } from '../Audio/AudioManager'
const { ccclass, property } = _decorator

@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar

  onLoad() {
    this.preload()
  }

  preload() {
    director.preloadScene(SCENE_ENUM.Start)
    resources.preloadDir(
      'texture',
      (cur, total) => {
        this.bar.progress = cur / total
      },
      async err => {
        if (err) {
          await new Promise(resolve => {
            setTimeout(resolve, 2000)
          })
          this.preload()
          return
        }

        await AudioManager.Instance.init()
        director.loadScene(SCENE_ENUM.Start)
      },
    )
  }
}
