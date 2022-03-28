import { GameConfig } from "./config.module"

export interface Grid {
  sideLength: number
  
  topLeftPoint: {
    x: number,
    y: number
  }
}

export class SnakeGround {
  private gridSideLength: number
  private ground: Grid[][]

  get snakeGround() {
    return JSON.parse(JSON.stringify(this.ground))
  }

  constructor(private gameConfig: GameConfig) {
    this.gridSideLength = this.gameConfig.gameHeight / this.gameConfig.gridSize
    this.ground = this.getGrids()
  }

  private getGrids() {
    const list: Array<Grid[]> = []
    for (let i = 0; i < this.gameConfig.gridSize; i++) {
      list.push([])
      for (let j = 0; j < this.gameConfig.gridSize; j++) {
        list[i][j] = {
          sideLength: this.gridSideLength,

          topLeftPoint: {
            x: i * this.gridSideLength,
            y: j * this.gridSideLength
          }
        }
      }
    }

    return list
  }
}