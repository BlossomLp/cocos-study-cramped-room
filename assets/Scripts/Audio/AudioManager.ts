import { AudioClip, AudioSource, director, Node, resources } from 'cc'
import Singleton from '../../Base/Singleton'
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum'
import { EventManager } from '../../RunTIme/EventManager'
import { AUDIO_CLIP_ENUM, EVENT_TO_SFX } from './AudioConfig'

/**
 * 音频管理器
 * 负责管理背景音乐(BGM)和音效(SFX)
 * 遵循事件驱动模式，自动根据游戏事件播放对应音效
 *
 * 调用时序：
 *   Loading 场景 → AudioManager.init() → 加载音频资源 → 进入 Start/Battle 场景 → playBGM/playSFX
 */
export class AudioManager extends Singleton {
  static get Instance() {
    return super.getInstance<AudioManager>()
  }

  /** 音频剪辑缓存 (name → AudioClip) */
  private _clips: Map<string, AudioClip> = new Map()

  /** 是否已完成初始化 */
  private _ready: boolean = false

  /** BGM 播放器 AudioSource */
  private _bgmSource: AudioSource = null
  /** SFX 播放器 AudioSource */
  private _sfxSource: AudioSource = null

  /** 当前播放的 BGM 名称 */
  private _currentBGM: string = ''

  /** BGM 静音（默认静音） */
  private _bgmMuted: boolean = false
  /** SFX 静音（默认静音） */
  private _sfxMuted: boolean = false
  /** BGM 音量 (0-1) */
  private _bgmVolume: number = 0.2
  /** SFX 音量 (0-1) */
  private _sfxVolume: number = 0.5

  constructor() {
    super()
    this.createAudioNodes()
  }

  /** 初始化音频管理器：加载资源 + 绑定事件 */
  async init() {
    if (this._ready) return
    await this.loadClips()
    this.bindEvents()
    this._ready = true
  }

  /** 创建持久化的 AudioSource 节点 */
  private createAudioNodes() {
    const root = new Node()
    director.addPersistRootNode(root)

    const bgmNode = new Node('BGMNode')
    bgmNode.setParent(root)
    this._bgmSource = bgmNode.addComponent(AudioSource)

    const sfxNode = new Node('SFXNode')
    sfxNode.setParent(root)
    this._sfxSource = sfxNode.addComponent(AudioSource)
  }

  /** 加载 resources/audio/ 下的所有 AudioClip */
  private loadClips(): Promise<void> {
    return new Promise(resolve => {
      resources.loadDir('audio', AudioClip, (err, assets) => {
        if (err) {
          console.warn('【音频管理器】未找到音频资源，音效将静默跳过', err.message)
          resolve()
          return
        }
        assets.forEach((clip: AudioClip) => {
          this._clips.set(clip.name, clip)
        })
        console.log(`【音频管理器】加载完成，共 ${assets.length} 个音频剪辑`)
        resolve()
      })
    })
  }

  /** 绑定游戏事件 → 音效 */
  private bindEvents() {
    const eventNames = Object.keys(EVENT_TO_SFX) as EVENT_ENUM[]
    for (const eventName of eventNames) {
      const clipName = EVENT_TO_SFX[eventName]
      EventManager.Instance.on(eventName, (...args: any[]) => {
        if (eventName === EVENT_ENUM.ATTACK_PLAYER) {
          const type = args[0] as ENTITY_STATE_ENUM
          if (type === ENTITY_STATE_ENUM.AIRDEATH) {
            this.playSFX(AUDIO_CLIP_ENUM.SFX_PLAYER_AIRDEATH)
          } else {
            this.playSFX(AUDIO_CLIP_ENUM.SFX_PLAYER_DEATH)
          }
          return
        }
        this.playSFX(clipName)
      })
    }
  }

  // ========== BGM ==========

  /** 播放背景音乐 */
  playBGM(name: AUDIO_CLIP_ENUM) {
    if (!this._ready) return
    if (this._currentBGM === name) return

    if (this._bgmSource) {
      this._bgmSource.stop()
    }

    this._currentBGM = name

    const clip = this._clips.get(name)
    if (!clip) {
      console.warn(`【音频管理器】BGM 未找到: ${name}`)
      return
    }

    this._bgmSource.clip = clip
    this._bgmSource.loop = true
    this._bgmSource.volume = this._bgmMuted ? 0 : this._bgmVolume
    this._bgmSource.play()
  }

  /** 停止背景音乐 */
  stopBGM() {
    if (!this._bgmSource) return
    this._bgmSource.stop()
    this._currentBGM = ''
  }

  /** BGM 静音 */
  get bgmMuted() {
    return this._bgmMuted
  }
  set bgmMuted(v: boolean) {
    this._bgmMuted = v
    if (this._bgmSource) {
      this._bgmSource.volume = v ? 0 : this._bgmVolume
    }
  }

  /** BGM 音量 (0-1) */
  get bgmVolume() {
    return this._bgmVolume
  }
  set bgmVolume(v: number) {
    this._bgmVolume = Math.max(0, Math.min(1, v))
    if (this._bgmSource && !this._bgmMuted) {
      this._bgmSource.volume = this._bgmVolume
    }
  }

  // ========== SFX ==========

  /** 播放音效（一次性） */
  playSFX(name: string, volume?: number) {
    if (!this._ready) return
    const clip = this._clips.get(name)
    if (!clip) return

    this._sfxSource.playOneShot(clip, volume ?? (this._sfxMuted ? 0 : this._sfxVolume))
  }

  /** SFX 静音 */
  get sfxMuted() {
    return this._sfxMuted
  }
  set sfxMuted(v: boolean) {
    this._sfxMuted = v
  }

  /** SFX 音量 (0-1) */
  get sfxVolume() {
    return this._sfxVolume
  }
  set sfxVolume(v: number) {
    this._sfxVolume = Math.max(0, Math.min(1, v))
  }
}
