import { _decorator } from 'cc'
import { EntityManager } from '../../Base/EntityManager'
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from '../../Enum'
import { IEntity } from '../../Levels'
import { DataManager } from '../../RunTIme/DataManager'
import { EventManager } from '../../RunTIme/EventManager'
import {
  BLOCK_DIRECTIONS,
  CONTROLLER_TO_SHAKE_TYPE_ENUM_MAP,
  CTRL_MOVE_POSITIONS,
  TURN_CHECK_POSITIONS,
  TURN_DIRECTIONS,
} from './config'
import { PlayerStateMachine } from './PlayerStateMachine'
const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  /** 角色坐标 x */
  x: number = 0
  /** 角色坐标 y */
  y: number = 0
  /** 角色移动目标坐标 x */
  targetX: number = 0
  /** 角色移动目标坐标 y */
  targetY: number = 0
  /** 角色移动速度 */
  private readonly speed: number = 0.1
  /** 角色正在移动 */
  private isMoving: boolean = false

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandle)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_PLAYER, this.onDead)
  }

  async init(params: IEntity) {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    this.targetX = params.x
    this.targetY = params.y
    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)
  }

  /**
   * 更新角色位置的方法
   * 该方法负责更新角色在游戏场景中的位置，通过计算瓦片坐标转换为屏幕坐标
   */
  protected update() {
    // 首先更新角色的位置信息
    this.updatePos()
    super.update()
  }

  /**
   * 更新对象位置的方法
   * 用于平滑地移动对象到目标位置(targetX, targetY)
   */
  updatePos() {
    // console.log('updatePos', this.targetX, this.targetY, this.x, this.y) // 调试信息，用于打印当前位置和目标位置

    // X轴方向移动逻辑
    if (this.x < this.targetX) {
      this.x += this.speed // 如果目标X在右侧，则向右移动
    } else if (this.x > this.targetX) {
      this.x -= this.speed // 如果目标X在左侧，则向左移动
    }

    // Y轴方向移动逻辑
    if (this.y < this.targetY) {
      this.y += this.speed // 如果目标Y在下方，则向下移动
    } else if (this.y > this.targetY) {
      this.y -= this.speed // 如果目标Y在上方，则向上移动
    }

    // 防止鬼畜：当当前位置与目标位置非常接近时，直接设置为目标位置，避免微小抖动
    if (Math.abs(this.targetX - this.x) < 0.1 && Math.abs(this.targetY - this.y) < 0.1 && this.isMoving) {
      this.isMoving = false
      this.x = this.targetX // 直接设置X坐标为目标值
      this.y = this.targetY // 直接设置Y坐标为目标值
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }

  inputHandle(inputDirection: CONTROLLER_ENUM) {
    if (
      this.state === ENTITY_STATE_ENUM.DEATH ||
      this.state === ENTITY_STATE_ENUM.AIRDEATH ||
      this.state === ENTITY_STATE_ENUM.ATTACK
    )
      return
    if (this.isMoving) return

    // 检查是否可以攻击
    const enemyId = this.willAttack(inputDirection)
    if (enemyId) {
      console.log('攻击')
      this.state = ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, enemyId)
      // EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN) // 试着换到动画结束时再触发
      return
    }

    // 撞墙
    if (this.willBlock(inputDirection)) {
      // 触发振动
      EventManager.Instance.emit(
        EVENT_ENUM.SCREEN_SHAKE,
        CONTROLLER_TO_SHAKE_TYPE_ENUM_MAP[inputDirection][this.direction],
      )
      return
    }
    this.move(inputDirection)
  }

  /**
   * 移动方法，根据输入方向控制目标位置或转向
   * @param inputDirection - 控制器输入的方向枚举值
   */
  move(inputDirection: CONTROLLER_ENUM) {
    // 左转处理
    if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      this.state = ENTITY_STATE_ENUM.TURNLEFT
      this.direction = TURN_DIRECTIONS[inputDirection][this.direction]
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
    // 右转处理
    else if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
      this.state = ENTITY_STATE_ENUM.TURNRIGHT
      this.direction = TURN_DIRECTIONS[inputDirection][this.direction]
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
    // 移动处理
    else {
      this.isMoving = true
      // 根据输入方向更新目标位置
      const [moveX, moveY] = CTRL_MOVE_POSITIONS[inputDirection]
      this.targetX += moveX
      this.targetY += moveY
      this.showSmoke(inputDirection) // 移动时显示烟雾
    }
  }

  showSmoke(inputDirection: CONTROLLER_ENUM) {
    EventManager.Instance.emit(EVENT_ENUM.SHOW_SMOKE, this.x, this.y, inputDirection)
  }

  willBlock(inputDirection: CONTROLLER_ENUM) {
    const { tileMapInfo, enemies: allEnemies, door, bursts: allBursts } = DataManager.Instance
    // 获取当前活着的敌人
    const enemies = allEnemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)
    // 获取当前活着的地裂
    const bursts = allBursts.filter(burst => burst.state === ENTITY_STATE_ENUM.IDLE)

    const { direction, targetX, targetY } = this
    let x = Math.round(targetX)
    let y = Math.round(targetY)
    console.log('开始碰撞检测 -> ', x, y, `direction:`, direction, `inputDirection:`, inputDirection)

    // ----- 移动 -----
    if (
      inputDirection === CONTROLLER_ENUM.TOP ||
      inputDirection === CONTROLLER_ENUM.BOTTOM ||
      inputDirection === CONTROLLER_ENUM.LEFT ||
      inputDirection === CONTROLLER_ENUM.RIGHT
    ) {
      // 要判断人物（moveable）和枪头（null || turnable）的目标位置
      // 根据输入方向 计算 【人物目标位置】
      const [moveX, moveY] = CTRL_MOVE_POSITIONS[inputDirection]
      x += moveX
      y += moveY
      // 判断人物是否走到 【地图边界】
      if (x < 0 || y < 0 || x >= tileMapInfo.length || y >= tileMapInfo[0].length) {
        // 撞墙状态（动画）
        this.state = BLOCK_DIRECTIONS[direction][inputDirection]
        return true
      }
      let weaponX = x
      let weaponY = y
      // 根据人物朝向 计算 【枪头目标位置】
      if (direction === DIRECTION_ENUM.TOP) {
        weaponY = y - 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        weaponY = y + 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        weaponX = x - 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        weaponX = x + 1
      }
      const playerTile = tileMapInfo[x][y]
      // 枪头可能超出边界
      const weaponTile = tileMapInfo[weaponX]?.[weaponY]
      // 判断枪头是否撞到 【敌人】
      const isCollisionEnemy = enemies.some(enemy => enemy.x === weaponX && enemy.y === weaponY)
      // 判断枪头是否撞到 【门】
      const isCollisionDoor = door.state === ENTITY_STATE_ENUM.IDLE && door.x === weaponX && door.y === weaponY
      // 判断是否会走到【地裂】上（地裂：即使地图瓦片为空也可以走）
      const isBurst = bursts.some(burst => burst.x === x && burst.y === y)

      if (
        // 判断人物是否走到 【墙】
        (playerTile?.moveable || isBurst) &&
        // 判断枪头是否走到 【墙】
        (!weaponTile || weaponTile.turnable) &&
        !isCollisionEnemy &&
        !isCollisionDoor
      )
        return false
    }
    // ----- 转向 -----
    else if (inputDirection === CONTROLLER_ENUM.TURNLEFT || inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
      const [[dx1, dy1], [dx2, dy2]] = TURN_CHECK_POSITIONS[inputDirection][direction]

      const pos1 = { x: x + dx1, y: y + dy1 }
      const pos2 = { x: x + dx2, y: y + dy2 }

      console.log(`转向碰撞检测[${inputDirection}] -> `, pos1, pos2)

      const tile1 = tileMapInfo[pos1.x][pos1.y]
      const tile2 = tileMapInfo[pos2.x][pos2.y]

      const isCollisionEnemy = enemies.some(
        enemy => (enemy.x === pos1.x && enemy.y === pos1.y) || (enemy.x === pos2.x && enemy.y === pos2.y),
      )

      if ((!tile1 || tile1.turnable) && (!tile2 || tile2.turnable) && !isCollisionEnemy) {
        return false
      }
    }
    // 撞墙状态（动画）
    this.state = BLOCK_DIRECTIONS[direction][inputDirection]
    return true
  }

  onDead(type: ENTITY_STATE_ENUM) {
    this.state = type
  }

  willAttack(inputDirection: CONTROLLER_ENUM) {
    const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)
    if (enemies.length === 0) return false
    const { targetX, targetY, direction } = this
    const attackDistance = 1

    // 人物前方位置上怪物则触发攻击
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i]
      const enemyX = Math.round(enemy.x)
      const enemyY = Math.round(enemy.y)

      // 向上攻击敌人
      if (
        enemyX === targetX &&
        enemyY === targetY - attackDistance - 1 &&
        direction === DIRECTION_ENUM.TOP &&
        inputDirection === CONTROLLER_ENUM.TOP
      ) {
        return enemy.id
      }
      // 向下攻击敌人
      else if (
        enemyX === targetX &&
        enemyY === targetY + attackDistance + 1 &&
        direction === DIRECTION_ENUM.BOTTOM &&
        inputDirection === CONTROLLER_ENUM.BOTTOM
      ) {
        return enemy.id
      }
      // 向左攻击敌人
      else if (
        enemyX === targetX - attackDistance - 1 &&
        enemyY === targetY &&
        direction === DIRECTION_ENUM.LEFT &&
        inputDirection === CONTROLLER_ENUM.LEFT
      ) {
        return enemy.id
      }
      // 向右攻击敌人
      else if (
        enemyX === targetX + attackDistance + 1 &&
        enemyY === targetY &&
        direction === DIRECTION_ENUM.RIGHT &&
        inputDirection === CONTROLLER_ENUM.RIGHT
      ) {
        return enemy.id
      }
    }

    return ''
  }

  onAttackShake(direction: SHAKE_TYPE_ENUM) {
    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, direction)
  }
}
