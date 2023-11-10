import Phaser from "phaser";
import { width, height } from "./modules/constants";
import Preloader from "./scenes/preload/Preloader";
import MainMenu from "./scenes/menu/MainMenu";
import Example from "./scenes/game/Game";
import Init from "./scenes/prologo/Prologo";
import Climax from "./scenes/continuacion/Climax";
import Climax2 from "./scenes/continuacion/Climax-Sky";
import Climax3 from "./scenes/continuacion/ClimaxEnd";





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
  scene: [Preloader, MainMenu, Example, Init, Climax, Climax2, Climax3, ],
};

export const game = new Phaser.Game(config);
