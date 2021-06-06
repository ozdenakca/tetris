import { BlockTextures } from "../scenes/Main";

export class ResourceLoader extends PIXI.utils.EventEmitter {
  private _loader: PIXI.Loader;

  constructor() {
    super();
  }

  public loadAsset(): void {
    this._loader = new PIXI.Loader();
    this._loader.add("background", "assets/images/bg_full.jpg");
    this._loader.add(BlockTextures.EMPTY, "assets/images/bg_block.png");
    this._loader.add(BlockTextures.BLUE, "assets/images/block_blue.png");
    this._loader.add(BlockTextures.GREEN, "assets/images/block_green.png");
    this._loader.add(BlockTextures.LIGHT_BLUE, "assets/images/block_light_blue.png");
    this._loader.add(BlockTextures.ORANGE, "assets/images/block_orange.png");
    this._loader.add(BlockTextures.PINK, "assets/images/block_pink.png");
    this._loader.add(BlockTextures.RED, "assets/images/block_red.png");
    this._loader.add(BlockTextures.VIOLET, "assets/images/block_violet.png");
    this._loader.add(BlockTextures.YELLOW, "assets/images/block_yellow.png");


    this.loader.onComplete.add(() => {
      this.emit("loadcomplete");
    });
    this._loader.load();
  }

  public get loader(): any {
    return this._loader;
  }
}
