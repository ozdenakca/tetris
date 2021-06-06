import { BLOCK_CODES, BLOCK_WIDTH_HEIGHT } from "../scenes/Main";
import { TETROMINOS } from "./Pieces";

export type CoordinatesType = { x: number; y: number };
export const OFFSET: CoordinatesType = { x: 8, y: 109 };

export class Piece extends PIXI.Sprite {
  private _index;
  private _matrix: number[][];
  private _rotationIndex: number = 0;
  private _coordinates: CoordinatesType = { x: 0, y: -2 };
  private _numberIndex = 0;
  constructor(index: string, parent) {
    super();
    parent.addChild(this);
    this.matrix = TETROMINOS[index][this._rotationIndex];
    this._index = index;
    this.setPiece();
  }

  public set index(value) {}

  public dispose() {}

  public moveDown() {
    this.coordinateY = this._coordinates.y + 1;
  }

  public moveRight() {
    this.coordinateX = this._coordinates.x + 1;
  }

  public moveLeft() {
    this.coordinateX = this._coordinates.x - 1;
  }

  public rotate() {
    const pieceArray = TETROMINOS[this.index];
    this.matrix = pieceArray[(this._rotationIndex + 1) % pieceArray.length];
    this._rotationIndex++;
  }

  public rotateBack() {
    const pieceArray = TETROMINOS[this.index];
    this.matrix = pieceArray[(this._rotationIndex - 1) % pieceArray.length];
    this._rotationIndex--;
  }

  public setPiece() {
    this.removeChildren();
    for (let rowIndex = 0; rowIndex < this.matrix.length; rowIndex++) {
      for (let colIndex = 0; colIndex < this.matrix.length; colIndex++) {
        const index = this.matrix[colIndex][rowIndex];
        const texture =
          index === 0
            ? PIXI.Texture.EMPTY
            : PIXI.Texture.from(BLOCK_CODES[index]);
        const block = new PIXI.Sprite(texture);

        block.position.set(
          block.width * (colIndex + this._coordinates.x) + OFFSET.x,
          block.height * (rowIndex + this._coordinates.y) + OFFSET.y
        );
        if(index !== 0) this._numberIndex = index;
        this.addChild(block);
      }
    }
  }

  public set matrix(value: number[][]) {
    this._matrix = value;
  }

  public set coordinateX(value: number) {
    this._coordinates.x = value;
  }

  public set coordinateY(value: number) {
    this._coordinates.y = value;
  }

  public get coordinates(): CoordinatesType {
    return this._coordinates;
  }

  public get matrix(): number[][] {
    return this._matrix;
  }

  public get index(): string {
    return this._index;
  }

  public get rotationIndex(): number {
    return this._rotationIndex;
  }

  public get numberIndex(): number {
      return this._numberIndex
  }
}
