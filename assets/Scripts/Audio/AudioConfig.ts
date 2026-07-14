import { EVENT_ENUM } from '../../Enum'

/**
 * 音频文件名常量
 * 对应 resources/audio/ 下的音频文件（不含扩展名）
 */
export enum AUDIO_CLIP_ENUM {
  /** 开始界面背景音乐 */
  BGM_START = 'bgm_start',
  /** 战斗场景背景音乐 */
  BGM_BATTLE = 'bgm_battle',
  /** 脚步声 */
  SFX_FOOTSTEP = 'sfx_footstep',
  /** 攻击声 */
  SFX_ATTACK = 'sfx_attack',
  /** 玩家死亡（地面） */
  SFX_PLAYER_DEATH = 'sfx_player_death',
  /** 玩家死亡（空中坠落） */
  SFX_PLAYER_AIRDEATH = 'sfx_player_airdeath',
  /** 敌人死亡 */
  SFX_ENEMY_DEATH = 'sfx_enemy_death',
  /** 过关 */
  SFX_LEVEL_COMPLETE = 'sfx_level_complete',
  /** 撞墙 */
  SFX_WALL_BUMP = 'sfx_wall_bump',
  /** 门打开 */
  SFX_DOOR_OPEN = 'sfx_door_open',
  /** 撤回 */
  SFX_REVOKE = 'sfx_revoke',
  /** 重新开始 */
  SFX_RESTART = 'sfx_restart',
  /** 尖刺滴答 */
  SFX_SPIKES_TICK = 'sfx_spikes_tick',
  /** 地裂 */
  SFX_BURST = 'sfx_burst',
  /** UI 按钮点击 */
  SFX_UI_CLICK = 'sfx_ui_click',
}

/**
 * 事件 → 音效映射
 * AudioManager 监听游戏事件后根据此配置自动播放对应音效
 */
export const EVENT_TO_SFX: Partial<Record<EVENT_ENUM, AUDIO_CLIP_ENUM>> = {
  [EVENT_ENUM.PLAYER_MOVE_END]: AUDIO_CLIP_ENUM.SFX_FOOTSTEP,
  [EVENT_ENUM.ATTACK_ENEMY]: AUDIO_CLIP_ENUM.SFX_ATTACK,
  // [EVENT_ENUM.ATTACK_PLAYER]: AUDIO_CLIP_ENUM.SFX_PLAYER_DEATH,
  // [EVENT_ENUM.ENEMY_DEATH]: AUDIO_CLIP_ENUM.SFX_ENEMY_DEATH,
  [EVENT_ENUM.SCREEN_SHAKE]: AUDIO_CLIP_ENUM.SFX_WALL_BUMP,
  // [EVENT_ENUM.DOOR_OPEN]: AUDIO_CLIP_ENUM.SFX_DOOR_OPEN,
  [EVENT_ENUM.NEXT_LEVEL]: AUDIO_CLIP_ENUM.SFX_LEVEL_COMPLETE,
  [EVENT_ENUM.REVOKE_STEP]: AUDIO_CLIP_ENUM.SFX_REVOKE,
  [EVENT_ENUM.RESTART_LEVEL]: AUDIO_CLIP_ENUM.SFX_RESTART,
}
