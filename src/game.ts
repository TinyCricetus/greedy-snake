import { Snake } from "./snake.module"
import { SnakeGround } from "./ground.module"
import { Renderer } from "./renderer"
import { GameConfig } from "./config.module"

export class Game {
  private snakeGround: SnakeGround = null
  private snake: Snake = null
  private ctx: CanvasRenderingContext2D = null
  private lastTimestamp = 0
  private renderer: Renderer = null

  constructor(private canvas: HTMLCanvasElement, private gameConfig: GameConfig) {
    this.canvas = canvas

    this.canvas.width = this.gameConfig.gameWidth
    this.canvas.height = this.gameConfig.gameHeight
    this.ctx = this.canvas.getContext('2d')

    this.renderer = new Renderer(this.ctx, this.gameConfig)
    this.snakeGround = new SnakeGround(this.gameConfig)
    this.snake = new Snake(this.gameConfig)
  }

  init() {
    this.renderer.drawXLines()
    this.renderer.drawYLines()
  }

  begin() {
    this.init()  

    requestAnimationFrame(() => {
      this.run()
    })
  }

  private run() {
    // const now = Date.now()
    // if (now - this.lastTimestamp >= 300) {
    //   this.lastTimestamp = now
    //   this.snakeGround.update()
    //   this.snake.update()
    // }

    // requestAnimationFrame(() => {
    //   this.run()
    // })
  }
}