import { Grid } from "./snake-ground"
import { GameConfig } from "./snake.config"

interface Location {
  x: number
  y: number
}

/**
 * 
 * 想法记录
 * 
 * 蛇的数据结构，不应该管理绘图相关的东西，应该只是蛇的坐标数据管理，所以 Snake 类中应该只维护一个数组，然后每次移动都更新这个数组
 */
export class Snake {
  private ctx: CanvasRenderingContext2D = null
  private grids: Grid[][] = null
  private gridMarks: boolean[][] = null
  private speed = GameConfig.SNAKE_INIT_SPEED
  private location: Location = null

  private snakeLocations: Location[] = null
  private margin = 2

  constructor(ctx: CanvasRenderingContext2D, grids: Grid[][]) {
    this.ctx = ctx
    this.grids = grids
    this.gridMarks = []
    this.location = { x: 0, y: 0 }
    this.snakeLocations = []

    this.init()
  }

  update() {
    this.goRight()
    this.repaint()
  }

  private init() {
    this.initGridMarks()
    this.drawFirstGrid()
  }

  private initGridMarks() {
    for (let i = 0; i < GameConfig.GRID_SIZE; i++) {
      this.gridMarks[i] = []
      for (let j = 0; j < GameConfig.GRID_SIZE; j++) {
        this.gridMarks[i][j] = false
      }
    }
  }

  private repaint() {
    for (let i = 0; i < GameConfig.GRID_SIZE; i++) {
      for (let j = 0; j < GameConfig.GRID_SIZE; j++) {
        if (this.gridMarks[i][j]) {
          this.drawGrid(this.grids[i][j])
        } else {
          this.clearGrid(this.grids[i][j])
        }
      }
    }
  }

  private drawFirstGrid() {
    const randomX = Math.floor(Math.random() * 1000) % GameConfig.GRID_SIZE
    const randomY = Math.floor(Math.random() * 1000) % GameConfig.GRID_SIZE

    this.location.x = randomX
    this.location.y = randomY
    this.gridMarks[randomX][randomY] = true

    this.repaint()
  }

  private drawGrid(grid: Grid, style = 'black') {
    if (this.ctx.fillStyle !== style) {
      this.ctx.fillStyle = style
    }
    this.ctx.rect(grid.topLeftPoint.x + this.margin, grid.topLeftPoint.y + this.margin, grid.sideLength - this.margin * 2, grid.sideLength - this.margin * 2)
    this.ctx.fill()
  }

  private clearGrid(grid: Grid) {
    this.ctx.beginPath()
    this.ctx.clearRect(grid.topLeftPoint.x + this.margin, grid.topLeftPoint.y + this.margin, grid.sideLength - this.margin * 2, grid.sideLength - this.margin * 2)
  }

  private setMark(location: Location) {
    this.gridMarks[location.x][location.y] = true
  }

  private getMark(location: Location) {
    return this.gridMarks[location.x][location.y]
  }

  private cleanMark(location: Location) {
    this.gridMarks[location.x][location.y] = false
  }

  private goRight() {
    this.cleanMark(this.snakeLocations[this.snakeLocations.length - 1])
    const firstLocation = this.snakeLocations[0]
    if (this.location.x >= GameConfig.GRID_SIZE - 1) {
      firstLocation.x = 0
    } else {
      firstLocation.x++
    }
    // this.setMark(this.snakeLocations[this])
  }
}