import Phaser from "phaser";
import { width, height } from "./modules/constants";
import Preloader from "./scenes/preload/Preloader.js";
import MainMenu from "./scenes/menu/MainMenu.js";
import Example from "./scenes/game/Game.js";


const config = {
  type: Phaser.AUTO,
  width,
  height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Preloader, MainMenu, Example],
};

export const game = new Phaser.Game(config);
