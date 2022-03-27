import { defaultGameConfig, GameConfig } from "./config.module";

export interface Grid {
  topLeftPoint: {
    x: number,
    y: number
  }
}

export class Renderer {
  private gridSideLengthX
  private gridSideLengthY

  constructor(private ctx: CanvasRenderingContext2D, private gameConfig: GameConfig) {
    this.gridSideLengthX = this.gameConfig.gameWidth / this.gameConfig.gridSize
    this.gridSideLengthY = this.gameConfig.gameHeight / this.gameConfig.gridSize
  }

  update(): void {
    throw new Error("Method not implemented.");
  }

  /**
   * 绘制以X轴点为起点的垂直线
   * -------------
   * |  |  |  |  |
   * |  |  |  |  |
   * |  |  |  |  |
   * -------------
   * @param strokeStyle 直线描边样式
   */
  drawXLines(strokeStyle = 'rgb(233, 231, 231)') {
    this.ctx.save()

    this.ctx.strokeStyle = strokeStyle
    let tempWidth = 0
    for (let i = 0; i < this.gameConfig.gridSize; i++) {
      tempWidth += this.gridSideLengthX
      this.ctx.moveTo(tempWidth, 0)
      this.ctx.lineTo(tempWidth, this.gameConfig.gameHeight)
      this.ctx.stroke()
    }

    this.ctx.restore()
  }

  /**
   * 绘制以Y轴点为起点的垂直线
   * -------------
   * - - - - - - -
   * - - - - - - -
   * - - - - - - -
   * -------------
   * @param strokeStyle 直线描边样式
   */
  drawYLines(strokeStyle = 'rgb(233, 231, 231)') {
    this.ctx.save()

    this.ctx.strokeStyle = strokeStyle
    let tempHeight = 0
    for (let i = 0; i < this.gameConfig.gridSize; i++) {
      tempHeight += this.gridSideLengthY
      this.ctx.moveTo(0, tempHeight)
      this.ctx.lineTo(this.gameConfig.gameWidth, tempHeight)
      this.ctx.stroke()
    }

    this.ctx.restore()
  }
}