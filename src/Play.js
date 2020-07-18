import Phaser from "phaser";
import logoImg from "./assets/logo.png";

class Play extends Phaser.Scene {
  constructor() {
    super({
      key: "Play"
    });
  }

  preload() {
    this.load.image("logo", logoImg);
  }

  create() {
    const logo = this.add.image(200, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 100,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1
    });
  }

  update(time, delta) {}
}

export default Play;
