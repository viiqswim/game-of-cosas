import Phaser from "phaser";

class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: "Boot"
    });
  }

  preload() {}

  create() {
    this.scene.start("Play");
  }
}

export default Boot;
