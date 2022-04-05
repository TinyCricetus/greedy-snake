import { Direction, GameStatus } from "./definition"
import Stats from 'stats.js'
import { GameConfig } from "./config"
import { ControllerModule } from "./controller"
import { Renderer } from "./renderer"
import { Snake } from "./snake"
import { Food } from "./food"

export class Game {
  private snakeFood: Food = null
  private lastFoodEscapeTs = 0

  private snake: Snake = null
  private ctx: CanvasRenderingContext2D = null
  private lastTimestamp = 0
  private renderer: Renderer = null
  private controller: ControllerModule = null
  private currentDirection = Direction.None

  private stats: Stats = null
  private gameStatus: GameStatus = GameStatus.None

  constructor(private canvas: HTMLCanvasElement, private gameConfig: GameConfig) {
    this.canvas = canvas

    this.canvas.width = this.gameConfig.gameWidth
    this.canvas.height = this.gameConfig.gameHeight
    this.ctx = this.canvas.getContext('2d')

    this.controller = new ControllerModule()
    this.snake = new Snake(this.gameConfig)
    this.snakeFood = new Food(this.gameConfig)
    this.renderer = new Renderer(this.ctx, this.gameConfig)
  }

  getSnake() {
    return this.snake
  }

  init() {
    this.renderer.drawGround()
    this.renderer.drawSnake({
      snake: this.snake.snakeBody,
      oldSnake: this.snake.snakeOldBody
    })

    this.snakeFood.generateFood(this.snake.snakeBody)
    this.renderer.drawFood(this.snakeFood.food, this.snakeFood.oldFood, 0)
    this.snake.subscribeFoodEaten(() => {
      this.snakeFood.generateFood(this.snake.snakeBody)
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
      if (this.getGameStatus() !== GameStatus.Run) {
        this.continue()
      }
    })

    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
  }

  begin() {
    this.init()
    this.gameStatus = GameStatus.Run

    requestAnimationFrame(() => {
      this.run()
    })
  }

  pause() {
    this.currentDirection = Direction.None
    this.gameStatus = GameStatus.Pause
  }

  continue() {
    this.gameStatus = GameStatus.Run
  }

  getGameStatus() {
    return this.gameStatus
  }

  update() {
    if (this.currentDirection === Direction.None) {
      return
    }
    this.stats.update()

    const now = Date.now()
    this.updateSnakeAction(now)
    this.updateRenderer(now)
  }

  private updateSnakeAction(timestampNow: number) {
    if (timestampNow - this.lastTimestamp < this.gameConfig.snakeSpeed * 1000) {
      return
    }
    this.lastTimestamp = timestampNow

    if (!this.snake.moveOneStep(this.currentDirection)) {
      this.pause()
      return
    }

    if (this.snake.isNearFood(this.snakeFood.food) && timestampNow - this.lastFoodEscapeTs >= this.gameConfig.foodEscapeInterval * 1000) {
      this.snakeFood.generateFood(this.snake.snakeBody)
      this.renderer.enableFoodEscapeAnimationOnce(timestampNow)
      this.lastFoodEscapeTs = timestampNow
    }

    if (this.snake.canEatFood(this.snakeFood.food)) {
      this.renderer.playFoodEatenAnimationOnce(this.snakeFood.food)
      this.snake.eatFood()
    }
  }

  private updateRenderer(timestampNow: number) {
    if (this.getGameStatus() !== GameStatus.Run) {
      return
    }
    this.renderer.clearGround()
    this.renderer.drawGround()
    this.renderer.drawFood(this.snakeFood.food, this.snakeFood.oldFood, timestampNow)
    this.renderer.drawSnake({
      snake: this.snake.snakeBody,
      oldSnake: this.snake.snakeOldBody,
      oneStepProgress: Math.floor(((timestampNow - this.lastTimestamp) / this.gameConfig.snakeSpeed / 1000) * 100)
    })
  }

  private run() {
    this.update()

    requestAnimationFrame(() => {
      this.run()
    })
  }
}