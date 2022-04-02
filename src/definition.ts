export enum Direction {
  None = 0,
  Up = 1,
  Down = 2,
  Left = 3,
  Right = 4
}

export class Position {
  constructor(public x = 0, public y = 0) {}

  set(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
  
  clone() {
    return new Position(this.x, this.y)
  }

  equal(this: Position, another: Position) {
    return this.x === another.x && this.y === another.y
  }
}