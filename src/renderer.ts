import { GameConfig } from "./config"
import { Position } from "./definition"

export interface SnakeDrawData {
  snake: Position[],
  oldSnake: Position[],
  /** 移动一步的进度 满额为100% */
  oneStepProgress?: number
}

interface Grid {
  sideLengthX: number
  sideLengthY: number
  
  topLeftPoint: {
    x: number,
    y: number
  }
}
export class Renderer {
  private gridSideLengthX
  private gridSideLengthY
  private gameGround: Grid[][]

  constructor(private ctx: CanvasRenderingContext2D, private gameConfig: GameConfig) {
    this.gridSideLengthX = this.gameConfig.gameWidth / this.gameConfig.gridSize
    this.gridSideLengthY = this.gameConfig.gameHeight / this.gameConfig.gridSize
    this.gameGround = this.getGameGround()
  }

  drawGround() {
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

    this.ctx.strokeStyle = this.gameConfig.groundLineColor
    this.ctx.stroke()

    this.ctx.restore()
  }

  drawSnake(data: SnakeDrawData) {
    this.ctx.save()

    this.ctx.beginPath()

    data.oneStepProgress = data.oneStepProgress || 0

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

      if (!this.gameGround[oldPosition.x] || !this.gameGround[oldPosition.x][oldPosition.y]) {
        console.error(oldPosition)
        throw new Error('Snake body is out of game ground!')
      }

      oldSelectedGrid = this.gameGround[oldPosition.x][oldPosition.y]
      selectedGrid = this.gameGround[position.x][position.y]

      if (Math.abs(selectedGrid.topLeftPoint.x - oldSelectedGrid.topLeftPoint.x) > selectedGrid.sideLengthX ||
        Math.abs(selectedGrid.topLeftPoint.y - oldSelectedGrid.topLeftPoint.y) > selectedGrid.sideLengthY) {
        interpolationX = 0
        interpolationY = 0
      } else {
        interpolationX = Math.floor((selectedGrid.topLeftPoint.x - oldSelectedGrid.topLeftPoint.x) * data.oneStepProgress / 100)
        interpolationY = Math.floor((selectedGrid.topLeftPoint.y - oldSelectedGrid.topLeftPoint.y) * data.oneStepProgress / 100)
      }

      radius = Math.floor(selectedGrid.sideLengthX / 2)
      currentX = oldSelectedGrid.topLeftPoint.x + radius + interpolationX
      currentY = oldSelectedGrid.topLeftPoint.y + radius + interpolationY

      this.ctx.moveTo(currentX, currentY)
      this.ctx.arc(currentX, currentY, radius, 0, 2 * Math.PI)
      if (i === 0) {
        this.ctx.fillStyle = this.gameConfig.snakeHeadColor
        this.ctx.fill()
        this.ctx.beginPath()
      }
    }
    this.ctx.fillStyle = this.gameConfig.snakeBodyColor
    this.ctx.fill()

    this.ctx.restore()
  }

  clearSnake(snake: Position[]) {
    this.ctx.save()

    let selectedGrid = null
    for (const position of snake) {
      selectedGrid = this.gameGround[position.x][position.y]
      this.ctx.clearRect(selectedGrid.topLeftPoint.x, selectedGrid.topLeftPoint.y,
        selectedGrid.sideLengthX, selectedGrid.sideLengthY)
    }

    this.ctx.restore()
  }

  clearGround() {
    this.ctx.save()

    // 拖尾
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    this.ctx.fillRect(0, 0, this.gameConfig.gameWidth, this.gameConfig.gameHeight)

    this.ctx.restore()
  }

  private getGameGround() {
    const list: Array<Grid[]> = []
    for (let i = 0; i < this.gameConfig.gridSize; i++) {
      list.push([])
      for (let j = 0; j < this.gameConfig.gridSize; j++) {
        list[i][j] = {
          sideLengthX: this.gridSideLengthX,
          sideLengthY: this.gridSideLengthY,

          topLeftPoint: {
            x: i * this.gridSideLengthX,
            y: j * this.gridSideLengthY
          }
        }
      }
    }

    return list
  }
}