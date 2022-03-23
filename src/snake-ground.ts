import { GameConfig } from "./snake.config"

export interface Grid {
  sideLength: number

  topLeftPoint: {
    x: number,
    y: number
  }
}

export class SnakeGround {
  private ctx: CanvasRenderingContext2D = null
  private gridSideLength = GameConfig.GAME_HEIGHT / GameConfig.GRID_SIZE

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.init()
  }

  init() {
    this.initRowLine()
    this.initColumnLine()
  }

  update() {
  }

  repaint() {
    this.init()
  }

  getGrids() {
    const list: Array<Grid[]> = []
    for (let i = 0; i < GameConfig.GRID_SIZE; i++) {
      list.push([])
      for (let j = 0; j < GameConfig.GRID_SIZE; j++) {
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

  private initRowLine() {
    this.ctx.strokeStyle = 'rgb(233, 231, 231)'
    for (let i = this.gridSideLength; i < GameConfig.GAME_HEIGHT; i += this.gridSideLength) {
      this.ctx.moveTo(i, 0)
      this.ctx.lineTo(i, GameConfig.GAME_HEIGHT)
      this.ctx.stroke()
    }
  }

  private initColumnLine() {
    this.ctx.strokeStyle = 'rgb(233, 231, 231)'
    for (let i = this.gridSideLength; i < GameConfig.GAME_HEIGHT; i += this.gridSideLength) {
      this.ctx.moveTo(0, i)
      this.ctx.lineTo(GameConfig.GAME_WIDTH, i)
      this.ctx.stroke()
    }
  }
}