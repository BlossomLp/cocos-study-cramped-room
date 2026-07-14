import { _decorator, Component, Slider, Toggle } from 'cc'
import { AudioManager } from '../Audio/AudioManager'
const { ccclass, property } = _decorator

/**
 * 音频设置组件
 *
 * 挂载到包含 BGM/SFX 的 Toggle 和 Slider 的节点上，
 * 在编辑器中拖入对应控件即可。
 */
@ccclass('AudioSetting')
export class AudioSetting extends Component {
  @property(Toggle)
  bgmToggle: Toggle = null

  @property(Slider)
  bgmSlider: Slider = null

  @property(Toggle)
  sfxToggle: Toggle = null

  @property(Slider)
  sfxSlider: Slider = null

  onLoad() {
    const audio = AudioManager.Instance
    if (this.bgmToggle) this.bgmToggle.isChecked = !audio.bgmMuted
    if (this.bgmSlider) this.bgmSlider.progress = audio.bgmVolume
    if (this.sfxToggle) this.sfxToggle.isChecked = !audio.sfxMuted
    if (this.sfxSlider) this.sfxSlider.progress = audio.sfxVolume
  }

  onBGMChanged() {
    if (!this.bgmToggle) return
    AudioManager.Instance.bgmMuted = !this.bgmToggle.isChecked
  }

  onBGMVolumeChanged() {
    if (!this.bgmSlider) return
    AudioManager.Instance.bgmVolume = this.bgmSlider.progress
  }

  onSFXChanged() {
    if (!this.sfxToggle) return
    AudioManager.Instance.sfxMuted = !this.sfxToggle.isChecked
  }

  onSFXVolumeChanged() {
    if (!this.sfxSlider) return
    AudioManager.Instance.sfxVolume = this.sfxSlider.progress
  }
}
