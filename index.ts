import { defaultGameConfig } from "./src/config"
import { Game } from "./src/game"

function init() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (canvas) {
    const game = new Game(canvas, defaultGameConfig)
    game.begin()
  } else {
    console.error('not found canvas element')
  }
}

init()