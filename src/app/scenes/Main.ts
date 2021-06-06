import "pixi-spine";
import { Scene } from "../types/Scene";
import { Piece } from "../components/Piece";
import { Board } from "../components/Board";

//our main scene

const BOARD_DIMENSIONS: BoardDimensions = {
  row: 20,
  col: 10,
};

export const BLOCK_WIDTH_HEIGHT = 42;

export type BoardDimensions = {
  row: number;
  col: number;
};

export enum BlockTextures {
  EMPTY = "bgBlock",
  YELLOW = "yellow",
  VIOLET = "violet",
  PINK = "pink",
  RED = "red",
  ORANGE = "orange",
  LIGHT_BLUE = "lightBlue",
  GREEN = "green",
  BLUE = "blue",
}

export const BLOCK_CODES = {
  0: BlockTextures.EMPTY,
  1: BlockTextures.VIOLET,
  2: BlockTextures.PINK,
  3: BlockTextures.BLUE,
  4: BlockTextures.ORANGE,
  5: BlockTextures.GREEN,
  6: BlockTextures.LIGHT_BLUE,
  7: BlockTextures.RED,
  8: BlockTextures.YELLOW,
};

export const BLOCK_INDICES = ["I", "J", "L", "T", "S", "O", "M", "Z"];

const LEVEL = 500;

export class Main extends Scene {
  private _currentBlock: Piece;
  private _board: Board;
  private _interval: any;

  public init() {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    this._board = new Board(this.game, 0, 0, BOARD_DIMENSIONS, this);
    this.generateRandomBlock();
    this.start();
  }

  public dispose() {}

  private newGame() {
    this.removeChildren();
    this._board = new Board(this.game, 0, 0, BOARD_DIMENSIONS, this);
    this.generateRandomBlock();
    this.start();
  }

  private start() {
    clearInterval(this._interval);
    this._interval = setInterval(this.moveDown.bind(this), LEVEL);
  }

  private generateRandomBlock() {
    this._currentBlock = new Piece(
      BLOCK_INDICES[Math.floor(Math.random() * 100) % BLOCK_INDICES.length],
      this
    );
    this.addChild(this._currentBlock);
  }

  private onKeyDown(event) {
    if (event.keyCode == 37) {
      this.moveLeft();
    } else if (event.keyCode == 38) {
      this.rotate();
    } else if (event.keyCode == 39) {
      this.moveRight();
    } else if (event.keyCode == 40) {
      this.moveDown();
    }
  }
  private rotate() {
    this._currentBlock.rotate();
    let kick = 0;

    if (this.collision(0, 0, this._currentBlock)) {
      if (this._currentBlock.coordinates.x > BOARD_DIMENSIONS.col / 2) {
        kick = -1;
      } else {
        kick = 1;
      }
    }

    if (!this.collision(kick, 0, this._currentBlock)) {
      if (kick === 1) this._currentBlock.moveRight();
      else if (kick === -1) this._currentBlock.moveLeft();
      this._currentBlock.setPiece();
    } else {
      this._currentBlock.rotateBack();
    }
  }

  private moveRight() {
    const result = this.collision(1, 0, this._currentBlock);
    if (!result) {
      this._currentBlock.moveRight();
      this._currentBlock.setPiece();
    }
  }

  private moveLeft() {
    const result = this.collision(-1, 0, this._currentBlock);
    if (!result) {
      this._currentBlock.moveLeft();
      this._currentBlock.setPiece();
    }
  }

  private moveDown() {
    const result = this.collision(0, 1, this._currentBlock);
    if (!result) {
      this._currentBlock.moveDown();
      this._currentBlock.setPiece();
    } else {
      this.lockPiece();
      this.removeFullRows();
      this.removeChild(this._currentBlock);
      this.generateRandomBlock();
    }
  }

  private lockPiece() {
    for (let rowIndex = 0; rowIndex < this._currentBlock.matrix.length; rowIndex++) {
      for (let colIndex = 0; colIndex < this._currentBlock.matrix.length; colIndex++) {
        if (!this._currentBlock.matrix[rowIndex][colIndex]) {
          continue;
        }
        if (this._currentBlock.coordinates.y + rowIndex < 0) {
          alert("Game Over");
          this.newGame();
          break;
        }
        // we lock the piece
        this._board.matrix[this._currentBlock.coordinates.y + colIndex][
          this._currentBlock.coordinates.x + rowIndex
        ] = this._currentBlock.numberIndex;
      }
    }
  }

  private removeFullRows() {
    for (let rowIndex = 0; rowIndex < BOARD_DIMENSIONS.row; rowIndex++) {
      let isRowFull = true;
      for (let colIndex = 0; colIndex < BOARD_DIMENSIONS.col; colIndex++) {
        isRowFull = isRowFull && this._board.matrix[rowIndex][colIndex] != 0;
      }
      if (isRowFull) {
        for (let upperRowIndex = rowIndex; upperRowIndex > 1; upperRowIndex--) {
          for (let colIndex = 0; colIndex < BOARD_DIMENSIONS.col; colIndex++) {
            this._board.matrix[upperRowIndex][colIndex] = this._board.matrix[upperRowIndex - 1][colIndex];
          }
        }
        for (let colIndex = 0; colIndex < BOARD_DIMENSIONS.col; colIndex++) {
          this._board.matrix[0][colIndex] = 0;
        }
      }
      this._board.setBoard();
    }
  }

  private collision(x: number, y: number, piece: Piece): boolean {
    for (let rowIndex = 0; rowIndex < piece.matrix.length; rowIndex++) {
      for (let colIndex = 0; colIndex < piece.matrix.length; colIndex++) {
        if (!piece.matrix[colIndex][rowIndex]) {
          continue;
        }
        const newX = piece.coordinates.x + colIndex + x;
        const newY = piece.coordinates.y + rowIndex + y;

        if (
          newX < 0 ||
          newX >= BOARD_DIMENSIONS.col ||
          newY >= BOARD_DIMENSIONS.row
        ) {
          return true;
        }
        if (newY < 0) {
          continue;
        }
        if (this._board.matrix[newY][newX] !== 0) {
          return true;
        }
      }
    }
    return false;
  }
}
