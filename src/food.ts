import { GameConfig } from "./config";
import { Position } from "./definition";

export class Food {
  private foodGround: number[][] = null
  private foodPosition: Position = null
  private oldFoodPosition: Position = null

  get food() {
    return this.foodPosition
  }

  get oldFood() {
    return this.oldFoodPosition
  }

  constructor(private gameConfig: GameConfig) {
    this.init()
  }

  /**
   * 生成食物坐标,重复调用也只可保有一个食物
   * @param snake 目前蛇所占据的位置
   */
  generateFood(snake: Position[]) {
    const availablePositions = this.getAvailablePositions(snake)
    const randomPositionIndex = this.generateRandomInteger() % availablePositions.length

    if (this.foodPosition) {
      this.oldFoodPosition = this.foodPosition
    } else {
      this.oldFoodPosition = availablePositions[randomPositionIndex]
    }

    this.foodPosition = availablePositions[randomPositionIndex]

    return this.foodPosition
  }

  private init() {
    // 初始化游戏格子图]
    this.foodGround = []
    for (let i = 0; i < this.gameConfig.gridSize; i++) {
      this.foodGround.push([])
      for (let j = 0; j < this.gameConfig.gridSize; j++) {
        this.foodGround[i].push(0)
      }
    }
  }

  /**
   * 收集所有食物可用方块坐标
   * @param snake 
   * @returns 
   */
  private getAvailablePositions(snake: Position[]) {
    const availablePositions = []
    for (let i = 0; i < this.foodGround.length; i++) {
      for (let j = 0; j < this.foodGround[i].length; j++) {
        if (snake.findIndex((pos) => { return pos.x === i && pos.y === j }) < 0) {
          // 这里偷懒了，每次产生食物都要进行大量 Position 对象的实例化，此处可以优化
          // 可以使用一个二维 Position 数组，每次使用前重置，或者是使用 Position 对象池进行优化
          availablePositions.push(new Position(i, j))
        }
      }
    }

    return availablePositions
  }

  /**
   * @deprecated
   * 这种随机生成的策略不可取，因为当蛇较长时，随机数可能要随机很多次才能随机到空余方格
   */
  private createRandomPosition() {
    return new Position(this.generateRandomInteger() % this.gameConfig.gridSize, this.generateRandomInteger() % this.gameConfig.gridSize)
  }

  private generateRandomInteger() {
    return Math.floor(Math.random() * 10000)
  }
}