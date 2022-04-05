import { Direction } from "./definition"

export enum DirectionKey {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight'
}

export class ControllerModule {
  private callback: (direction: Direction) => void = null

  constructor() { }

  init() {
    document.addEventListener('keydown', (event) => {
      this.onClickKeyBoard(event.key)
    })
  }

  subscribeKeyDownEvent(callback: (direction: Direction) => void) {
    this.callback = callback
  }

  private onClickKeyBoard(key: string) {
    if (!this.callback) {
      return
    }
    console.log(key)
    switch (key) {
      case 'ArrowUp':
      case 'w':
        this.callback(Direction.Up)
        break
      case 'ArrowDown':
      case 's':
        this.callback(Direction.Down)
        break
      case 'ArrowLeft':
      case 'a':
        this.callback(Direction.Left)
        break
      case 'ArrowRight':
      case 'd':
        this.callback(Direction.Right)
        break
      case ' ':
        this.callback(Direction.None)
        break
      default:
        break
    }
  }
}