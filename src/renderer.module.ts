import { GameConfig } from "./config.module"
import { Grid } from "./ground.module"
import { Position } from "./snake.module"

export class Renderer {
  private gridSideLengthX
  private gridSideLengthY

  constructor(private ctx: CanvasRenderingContext2D, private ground: Grid[][], private gameConfig: GameConfig) {
    this.gridSideLengthX = this.gameConfig.gameWidth / this.gameConfig.gridSize
    this.gridSideLengthY = this.gameConfig.gameHeight / this.gameConfig.gridSize
  }

  update(): void {
    throw new Error("Method not implemented.");
  }

  drawGround(strokeStyle = 'rgb(233, 231, 231)') {
    this.ctx.save()

    this.ctx.strokeStyle = strokeStyle
    let tempWidth = 0
    let tempHeight = 0
    for (let i = 0; i < this.gameConfig.gridSize; i++) {
      tempWidth += this.gridSideLengthX
      tempHeight += this.gridSideLengthY
      this.ctx.moveTo(tempWidth, 0)
      this.ctx.lineTo(tempWidth, this.gameConfig.gameHeight)
      this.ctx.moveTo(0, tempHeight)
      this.ctx.lineTo(this.gameConfig.gameWidth, tempHeight)
    }
    this.ctx.stroke()

    this.ctx.restore()
  }

  drawSnake(snake: Position[], color = 'black') {
    this.ctx.save()

    this.ctx.fillStyle = color
    let selectedGrid = null
    for (const position of snake) {
      if (!this.ground[position.x] || !this.ground[position.x][position.y]) {
        console.error(position)
        throw new Error('Snake body is out of game ground!')
      }
      selectedGrid = this.ground[position.x][position.y]
      this.ctx.fillRect(selectedGrid.topLeftPoint.x, selectedGrid.topLeftPoint.y, 
        selectedGrid.sideLength, selectedGrid.sideLength)
    }

    this.ctx.restore()
  }

  clearSnake(snake: Position[]) {
    this.ctx.save()

    let selectedGrid = null
    for (const position of snake) {
      selectedGrid = this.ground[position.x][position.y]
      this.ctx.clearRect(selectedGrid.topLeftPoint.x, selectedGrid.topLeftPoint.y, 
        selectedGrid.sideLength, selectedGrid.sideLength)
    }

    this.ctx.restore()
  }

  clearGround() {
    this.ctx.save()

    this.ctx.clearRect(0, 0, this.gameConfig.gameWidth, this.gameConfig.gameHeight)
    
    this.ctx.restore()
  }
}