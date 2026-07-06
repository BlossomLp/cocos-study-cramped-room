import { _decorator, Component, Event } from 'cc'
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enum'
import { EventManager } from '../../RunTIme/EventManager'
const { ccclass, property } = _decorator

@ccclass('ControllerManager')
export class ControllerManager extends Component {
  handleCtrl(event: Event, direction: CONTROLLER_ENUM) {
    // EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, direction, event)
  }
}
