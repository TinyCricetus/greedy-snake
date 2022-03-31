export interface GameConfig {
  /** 游戏宽度 单位 px */
  gameWidth: number,
  /** 游戏高度 单位 px */
  gameHeight: number,

  /** 游戏尺寸 x * x 大小 */
  gridSize: number,

  snakeOriginLength: number,

  /** 蛇初始速度，n 格每秒 */
  snakeOriginSpeed: number,

  /** 蛇身体方格内宽 px */
  snakeGridPadding: number
}

export const defaultGameConfig: GameConfig = {
  gameWidth: 500,
  gameHeight: 500,
  gridSize: 20,
  snakeOriginLength: 5,
  snakeOriginSpeed: 1,
  snakeGridPadding: 3,
}