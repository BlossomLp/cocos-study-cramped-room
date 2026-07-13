import { _decorator, Component } from 'cc'
import { EVENT_ENUM } from '../../Enum'
import { EventManager } from '../../RunTIme/EventManager'
const { ccclass, property } = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {
  handleRevoke() {
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }

  handleRestart() {
    EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
  }

  handleOutScene() {
    EventManager.Instance.emit(EVENT_ENUM.QUIT_BATTLE)
  }
}
