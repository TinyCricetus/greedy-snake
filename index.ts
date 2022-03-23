import { Game } from "./src/game"

function init() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (canvas) {
    const game = new Game(canvas)
    game.begin()
  } else {
    console.error('not found canvas element')
  }
}

init()