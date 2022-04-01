import { GameConfig } from "./config.module"
import { Grid } from "./ground.module"
import { Position } from "./snake.module"

export interface SnakeDrawData {
  snake: Position[],
  oldSnake: Position[],
  oneStepProgress?: number
  color?: string
}

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
    this.ctx.beginPath()

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

    this.ctx.strokeStyle = strokeStyle
    this.ctx.stroke()

    this.ctx.restore()
  }

  drawSnake(data: SnakeDrawData) {
    this.ctx.save()

    this.ctx.beginPath()

    data.oneStepProgress = data.oneStepProgress || 0
    data.color = data.color || '#DFDFDE'

    let selectedGrid: Grid = null
    let oldSelectedGrid: Grid = null

    let position: Position = null
    let oldPosition: Position = null

    let interpolationX = 0
    let interpolationY = 0

    let currentX = 0
    let currentY = 0
    let radius = 0
    for (let i = 0; i < data.oldSnake.length; i++) {
      position = data.snake[i]
      oldPosition = data.oldSnake[i]

      if (!this.ground[oldPosition.x] || !this.ground[oldPosition.x][oldPosition.y]) {
        console.error(oldPosition)
        throw new Error('Snake body is out of game ground!')
      }

      oldSelectedGrid = this.ground[oldPosition.x][oldPosition.y]
      selectedGrid = this.ground[position.x][position.y]

      if (Math.abs(selectedGrid.topLeftPoint.x - oldSelectedGrid.topLeftPoint.x) > selectedGrid.sideLength ||
        Math.abs(selectedGrid.topLeftPoint.y - oldSelectedGrid.topLeftPoint.y) > selectedGrid.sideLength) {
        interpolationX = 0
        interpolationY = 0
      } else {
        interpolationX = Math.floor((selectedGrid.topLeftPoint.x - oldSelectedGrid.topLeftPoint.x) * data.oneStepProgress / 100)
        interpolationY = Math.floor((selectedGrid.topLeftPoint.y - oldSelectedGrid.topLeftPoint.y) * data.oneStepProgress / 100)
      }

      radius = Math.floor(selectedGrid.sideLength / 2)
      currentX = oldSelectedGrid.topLeftPoint.x + radius + interpolationX
      currentY = oldSelectedGrid.topLeftPoint.y + radius + interpolationY

      this.ctx.moveTo(currentX, currentY)
      this.ctx.arc(currentX, currentY, radius, 0, 2 * Math.PI)
      if (i === 0) {
        this.ctx.fillStyle = '#8D8DAA'
        this.ctx.fill()
        this.ctx.beginPath()
      }
    }
    this.ctx.fillStyle = data.color
    this.ctx.fill()

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

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    this.ctx.fillRect(0, 0, this.gameConfig.gameWidth, this.gameConfig.gameHeight)

    this.ctx.restore()
  }
}