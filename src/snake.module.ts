import { defaultGameConfig, GameConfig } from "./config.module"

export enum Direction {
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4
}
export class Location {
  constructor(public x = 0, public y = 0) {}

  set(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
  
  clone() {
    return new Location(this.x, this.y)
  }
}

/**
 * 想法记录
 * 
 * 蛇的数据结构，不应该管理绘图相关的东西，应该只是蛇的坐标数据管理，所以 Snake 类中应该只维护一个数组，然后每次移动都更新这个数组
 */
export class Snake {
  private body: Location[] = []
  private width: number
  private height: number

  constructor(gameConfig: GameConfig) {
    this.width = gameConfig.gameWidth || defaultGameConfig.gameWidth
    this.height = gameConfig.gameHeight || defaultGameConfig.gameHeight
  }

  moveOneStep(dir: Direction) {
    // 移动策略，只动第一个，后面的全都跟着动
    const firstBody = this.body[0]
    const beforeBody = firstBody.clone()
    
    switch(dir) {
      case Direction.UP:
        firstBody.y--
        break
      case Direction.DOWN:
        firstBody.y++
        break
      case Direction.LEFT:
        firstBody.x--
        break
      case Direction.RIGHT:
        firstBody.x++
        break
      default:
        break
    }
    // 范围判定，复位
    firstBody.x = firstBody.x >= this.width ? 0 : firstBody.x
    firstBody.x = firstBody.x < 0 ? this.width - 1 : firstBody.x

    firstBody.y = firstBody.y >= this.height ? 0 : firstBody.y
    firstBody.y = firstBody.y < 0 ? this.height - 1 : firstBody.y

    // 后续节点更新
    let beforeX = beforeBody.x
    let beforeY = beforeBody.y
    for (let i = 1; i < this.body.length; i++) {
      this.body[i].set(beforeX, beforeY)

      beforeX = this.body[i].x
      beforeY = this.body[i].y
    }
  }
}