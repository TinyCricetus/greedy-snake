import { Direction } from "./definition"
import Stats from 'stats.js'
import { GameConfig } from "./config"
import { ControllerModule } from "./controller"
import { Renderer } from "./renderer"
import { Snake } from "./snake"

export class Game {
  private snake: Snake = null
  private ctx: CanvasRenderingContext2D = null
  private lastTimestamp = 0
  private renderer: Renderer = null
  private controller: ControllerModule = null
  private currentDirection = Direction.None

  private stats: Stats = null

  constructor(private canvas: HTMLCanvasElement, private gameConfig: GameConfig) {
    this.canvas = canvas

    this.canvas.width = this.gameConfig.gameWidth
    this.canvas.height = this.gameConfig.gameHeight
    this.ctx = this.canvas.getContext('2d')

    this.controller = new ControllerModule()
    this.snake = new Snake(this.gameConfig)
    this.renderer = new Renderer(this.ctx, this.gameConfig)
  }

  init() {
    this.renderer.drawGround()
    this.renderer.drawSnake({
      snake: this.snake.snakeBody,
      oldSnake: this.snake.snakeOldBody
    })

    this.controller.init()
    this.controller.subscribeKeyDownEvent((direction) => {
      if (this.currentDirection === Direction.Left && direction === Direction.Right ||
        this.currentDirection === Direction.Right && direction === Direction.Left ||
        this.currentDirection === Direction.Up && direction === Direction.Down ||
        this.currentDirection === Direction.Down && direction === Direction.Up) {
        return
      }

      this.currentDirection = direction
    })

    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
  }

  begin() {
    this.init()

    requestAnimationFrame(() => {
      this.run()
    })
  }

  update() {
    if (this.currentDirection === Direction.None) {
      return
    }

    this.stats.update()

    const now = Date.now()
    if (now - this.lastTimestamp >= this.gameConfig.snakeSpeed * 1000) {
      this.lastTimestamp = now
      this.snake.moveOneStep(this.currentDirection)
    }

    this.renderer.clearGround()
    this.renderer.drawGround()
    this.renderer.drawSnake({
      snake: this.snake.snakeBody,
      oldSnake: this.snake.snakeOldBody,
      oneStepProgress: Math.floor(((now - this.lastTimestamp) / this.gameConfig.snakeSpeed / 1000) * 100)
    })
  }

  private run() {
    this.update()

    requestAnimationFrame(() => {
      this.run()
    })
  }
}