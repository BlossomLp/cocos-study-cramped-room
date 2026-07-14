import { _decorator, Component, director, Node } from 'cc'
import FaderManager from '../../Base/FaderManager'
import { SCENE_ENUM } from '../../Enum'
import { AUDIO_CLIP_ENUM } from '../Audio/AudioConfig'
import { AudioManager } from '../Audio/AudioManager'
const { ccclass, property } = _decorator

@ccclass('StartManager')
export class StartManager extends Component {
  async onLoad() {
    director.preloadScene(SCENE_ENUM.Battle)
    await AudioManager.Instance.init()
    await FaderManager.Instance.fader.fadeOut(1000)
    AudioManager.Instance.playBGM(AUDIO_CLIP_ENUM.BGM_START)
    // EventManager.Instance.emit(EVENT_ENUM.GAME_START)
    this.node.once(Node.EventType.TOUCH_END, this.handleStart, this)
  }

  async handleStart() {
    AudioManager.Instance.stopBGM()
    await FaderManager.Instance.fader.fadeIn(300)
    director.loadScene(SCENE_ENUM.Battle)
  }
}
