import { defaultGameConfig } from "./src/config"
import { Game } from "./src/game"

function init() {
  let game: Game = null
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (canvas) {
    game = new Game(canvas, defaultGameConfig)
    game.begin()
  } else {
    console.error('not found canvas element')
  }

  const scoreEL = document.getElementById('score')
  if (scoreEL) {
    const snake = game.getSnake()
    scoreEL.innerText = `累计得分：0`
    snake.subscribeFoodEaten(() => {
      scoreEL.innerText = `累计得分：${ snake.snakeBody.length - defaultGameConfig.snakeOriginLength }`
    })
  }
}

init()