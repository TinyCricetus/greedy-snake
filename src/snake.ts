import { GameConfig } from "./config"
import { Position, Direction } from "./definition"

/**
 * 想法记录
 * 
 * 蛇的数据结构，不应该管理绘图相关的东西，应该只是蛇的坐标数据管理，所以 Snake 类中应该只维护一个数组，然后每次移动都更新这个数组
 */
export class Snake {
  private body: Position[] = null
  private oldBody: Position[] = null

  private widthGrid: number
  private heightGrid: number

  private foodEatenCallback: () => void = null

  get snakeBody() {
    return this.body.map((item) => { return item.clone() })
  }

  get snakeOldBody() {
    return this.oldBody.map((item) => { return item.clone() })
  }

  constructor(private gameConfig: GameConfig) {
    this.widthGrid = this.gameConfig.gridSize
    this.heightGrid = this.gameConfig.gridSize

    this.init()
  }

  init() {
    const randomColumn = Math.floor(Math.random() * 1000) % this.gameConfig.gridSize
    this.body = []
    for (let i = 0; i < 5; i++) {
      this.body.push(new Position(i + 3, randomColumn))
    }
    this.body = this.body.reverse()
    this.oldBody = this.cloneBody(this.body)
  }

  cloneBody(sourceBody: Position[]) {
    return sourceBody.map((item) => { return item.clone() })
  }

  needUpdateSnake() {
    if (this.oldBody.length !== this.body.length) {
      return true
    }

    for (let i = 0; i < this.oldBody.length; i++) {
      if (!this.oldBody[i].equal(this.body[i])) {
        return true
      }
    }

    return false
  }

  canEatFood(food: Position) {
    return this.snakeBody[0].x === food.x && this.snakeBody[0].y === food.y
  }

  /** 蛇长加一 */
  eatFood() {
    this.body.push(this.body[this.body.length - 1].clone())
    
    if (this.foodEatenCallback) {
      this.foodEatenCallback()
    }
  }

  subscribeFoodEaten(callback: () => void) {
    this.foodEatenCallback = callback
  }

  moveOneStep(dir: Direction) {
    if (dir === Direction.None) {
      return
    }

    this.oldBody = this.cloneBody(this.body)

    // 移动策略，只动第一个，后面的全都跟着动
    const firstBody = this.body[0]

    switch (dir) {
      case Direction.Up:
        firstBody.y--
        break
      case Direction.Down:
        firstBody.y++
        break
      case Direction.Left:
        firstBody.x--
        break
      case Direction.Right:
        firstBody.x++
        break
      default:
        break
    }
    // 范围判定，复位
    firstBody.x = firstBody.x >= this.widthGrid ? 0 : firstBody.x
    firstBody.x = firstBody.x < 0 ? this.widthGrid - 1 : firstBody.x

    firstBody.y = firstBody.y >= this.heightGrid ? 0 : firstBody.y
    firstBody.y = firstBody.y < 0 ? this.heightGrid - 1 : firstBody.y

    // 后续节点更新
    for (let i = 1; i < this.oldBody.length; i++) {
      this.body[i].set(this.oldBody[i - 1].x, this.oldBody[i - 1].y)
    }
  }
}