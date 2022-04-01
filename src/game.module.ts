import { Snake } from "./snake.module"
import { SnakeGround } from "./ground.module"
import { Renderer } from "./renderer.module"
import { GameConfig } from "./config.module"
import { ControllerModule } from "./controller.module"
import { Direction } from "./definition"
import Stats from 'stats.js'

export class Game {
  private snakeGround: SnakeGround = null
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
    this.snakeGround = new SnakeGround(this.gameConfig)
    this.snake = new Snake(this.gameConfig)
    this.renderer = new Renderer(this.ctx, this.snakeGround.snakeGround, this.gameConfig)
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