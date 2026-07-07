import { _decorator } from 'cc'
import { EntityManager } from '../../Base/EntityManager'
import { IEntity } from '../../Levels'
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine'
const { ccclass, property } = _decorator

/**
 * 木骷髅管理器类，继承自实体管理器(EntityManager)
 * 用于管理木骷髅实体的行为和属性
 */
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  /** 角色坐标 x */
  x: number = 0
  /** 角色坐标 y */
  y: number = 0

  async init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}
