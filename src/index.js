import "./styles/index.css";
import Phaser from "phaser";

import Boot from "./scenes/Boot.js";
import Play from "./scenes/Play.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: [Boot, Play]
};

new Phaser.Game(config);
