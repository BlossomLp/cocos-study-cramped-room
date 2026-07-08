import { Event } from 'cc'
import { CONTROLLER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../Enum'

export interface EventMap {
  // 用户操作
  [EVENT_ENUM.PLAYER_CTRL]: [
    /** 输入类型 */
    inputDirection: CONTROLLER_ENUM,
    /** 事件对象（可选） */
    event?: Event,
  ]
  // 玩家移动结束
  [EVENT_ENUM.PLAYER_MOVE_END]: []
  // 怪物攻击玩家
  [EVENT_ENUM.ATTACK_PLAYER]: [
    /** 玩家将死的状态（地面死｜空中死） */
    type: ENTITY_STATE_ENUM,
  ]
  // 玩家攻击怪物
  [EVENT_ENUM.ATTACK_ENEMY]: [
    /** 怪物id */
    id: string,
  ]
  // 下一关
  [EVENT_ENUM.NEXT_LEVEL]: []
  // 开门
  [EVENT_ENUM.DOOR_OPEN]: []
  // 玩家出生
  [EVENT_ENUM.PLAYER_BORN]: [
    /** 是否为初始化 */
    isInit?: boolean,
  ]
}
