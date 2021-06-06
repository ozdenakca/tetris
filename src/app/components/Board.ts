import { Game } from "../Game";
import { Component } from "../types/Component";
import {BoardDimensions, BLOCK_CODES } from "../scenes/Main";
import { OFFSET } from "../components/Piece";



export class Board extends Component {

    private _dimensions: BoardDimensions;
    private _matrix: number[][] = [];

    constructor(game: Game, x: number, y: number, dimensions: BoardDimensions, parent) {
        super(game, x, y);
        this._dimensions = dimensions;
        const background = new PIXI.Sprite(PIXI.Texture.from("background"));
        this.addChild(background);
        this.generateBoard();
        parent.addChild(this);
    }

    public dispose() {
        this.removeChildren();

    }

    public generateBoard() {
        for (let rowIndex = 0; rowIndex < this._dimensions.row; rowIndex++) {
            this._matrix[rowIndex] = [];
            for (let colIndex = 0; colIndex < this._dimensions.col; colIndex++) {
                this._matrix[rowIndex][colIndex] = 0;
            }
        }
    }

    public setBoard() {
        this.removeChildren();
        const background = new PIXI.Sprite(PIXI.Texture.from("background"));
        this.addChild(background);
        for (let rowIndex = 0; rowIndex < this._matrix.length; rowIndex++) {
            for (let colIndex = 0; colIndex < this._matrix[0].length; colIndex++) {
                const index = this.matrix[rowIndex][colIndex];
                const texture =
                  index === 0
                    ? PIXI.Texture.EMPTY
                    : PIXI.Texture.from(BLOCK_CODES[index]);
                const block = new PIXI.Sprite(texture);
                block.position.set(block.width * colIndex + OFFSET.x, block.height * rowIndex+ OFFSET.y);
                this.addChild(block);
            }
        }
    }

    public get dimensions(): BoardDimensions {
        return this._dimensions;
    }
    public get matrix(): number[][]{
        return this._matrix;
    }

    public set matrix(value: number[][]) {
        this._matrix = value;
        this.setBoard();
    }

}