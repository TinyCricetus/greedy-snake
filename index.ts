import { defaultGameConfig } from "./src/config.module"
import { Game } from "./src/game.module"

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