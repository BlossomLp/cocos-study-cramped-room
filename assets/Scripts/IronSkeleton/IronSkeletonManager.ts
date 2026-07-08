import { _decorator } from 'cc'
import { EnemyManager } from '../../Base/EnemyManager'
import { IEntity } from '../../Levels'
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine'
const { ccclass, property } = _decorator

/**
 * 铁骷髅管理器类，继承自敌人管理器(EnemyManager)
 * 用于管理铁骷髅实体的行为和属性
 */
@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}
