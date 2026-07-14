import { _decorator, Component, Prefab, resources } from 'cc'
import { AUDIO_CLIP_ENUM } from '../Audio/AudioConfig'
import { AudioManager } from '../Audio/AudioManager'
import { Modal } from './Modal'
const { ccclass, property } = _decorator

@ccclass('ModalManager')
export class ModalManager extends Component {
  handleSettingAudio() {
    AudioManager.Instance.playSFX(AUDIO_CLIP_ENUM.SFX_UI_CLICK)
    // 2. 动态加载设置预制体
    resources.load('prefabs/AudioSetting', Prefab, (err, prefab) => {
      if (err) return

      // 3. 直接呼出 Modal 弹窗，并把这个设置预制体传给 content
      Modal.show({
        title: '声音设置',
        content: prefab, // 这里传入你的 SettingView 预制体
        okText: '确定',
        onOk: () => {
          console.log('保存设置并关闭')
        },
      })
    })
  }
}
