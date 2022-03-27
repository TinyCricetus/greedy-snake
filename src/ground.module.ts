import { GameConfig } from "./config.module"
import { Grid } from "./renderer"

export class SnakeGround {
  private gridSideLength: number

  constructor(private gameConfig: GameConfig) {
    this.gridSideLength = this.gameConfig.gameHeight / this.gameConfig.gridSize
  }

  getGrids() {
    const list: Array<Grid[]> = []
    for (let i = 0; i < this.gameConfig.gridSize; i++) {
      list.push([])
      for (let j = 0; j < this.gameConfig.gridSize; j++) {
        list[i][j] = {
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