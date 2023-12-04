import Phaser from "phaser";
import { width, height } from "./modules/constants";
import Preloader from "./scenes/preload/Preloader";
import MainMenu from "./scenes/menu/MainMenu";
import Example from "./scenes/game/Game";
import Init from "./scenes/prologo/Prologo";
import Nivel2 from "./scenes/game/Nivel2";
import Credits from "./scenes/credits/Credits";
import GameOver from "./scenes/gameOver/gameOver";







export const config = {
  type: Phaser.AUTO,
  width,
  height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: [Preloader, MainMenu, Example, Init, Nivel2,Credits,GameOver ],
};

export const game = new Phaser.Game(config);
