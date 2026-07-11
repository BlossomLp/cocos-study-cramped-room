import { _decorator } from 'cc'
import { IEntity } from '../../Levels'
import { EntityManager } from './../../Base/EntityManager'
import { SmokeStateMachine } from './SmokeStateMachine'
const { ccclass, property } = _decorator

/**
 * 烟雾管理器类，继承自敌人管理器(EnemyManager)
 * 用于管理烟雾实体的行为和属性
 * Player移动后产生烟雾
 */
@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}
