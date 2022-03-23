import { Snake } from "./snake"
import { SnakeGround } from "./snake-ground"
import { GameConfig } from "./snake.config"

export class Game {
  private canvas: HTMLCanvasElement = null
  private snakeGround: SnakeGround = null
  private snake: Snake = null
  private ctx: CanvasRenderingContext2D = null
  private lastTimestamp = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas

    this.canvas.width = GameConfig.GAME_WIDTH
    this.canvas.height = GameConfig.GAME_HEIGHT
    this.ctx = this.canvas.getContext('2d')

    this.snakeGround = new SnakeGround(this.ctx)
    this.snake = new Snake(this.ctx, this.snakeGround.getGrids())
  }

  begin() {
    requestAnimationFrame(() => {
      this.run()
    })
  }

  private run() {
    const now = Date.now()
    if (now - this.lastTimestamp >= 300) {
      this.lastTimestamp = now
      this.snakeGround.update()
      this.snake.update()
    }

    requestAnimationFrame(() => {
      this.run()
    })
  }
}