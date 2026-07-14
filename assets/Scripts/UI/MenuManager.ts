import { _decorator, Component } from 'cc'
import { EVENT_ENUM } from '../../Enum'
import { EventManager } from '../../RunTIme/EventManager'
import { AUDIO_CLIP_ENUM } from '../Audio/AudioConfig'
import { AudioManager } from '../Audio/AudioManager'
const { ccclass, property } = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {
  handleRevoke() {
    AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_UI_CLICK)
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }

  handleRestart() {
    AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_UI_CLICK)
    EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
  }

  handleOutScene() {
    AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_UI_CLICK)
    EventManager.Instance.emit(EVENT_ENUM.QUIT_BATTLE)
  }
}
