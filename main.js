import Phaser from "phaser";
import { width, height } from "./modules/constants";

class Preloader extends Phaser.Scene {
  constructor() {
    super("preload");
  }
  preload() {
    this.load.image("jungle", "assets/jungle.png");
    this.load.image("play-button", "assets/playbutton.png");  
    this.load.image("mission1", "assets/mission1.png");
    this.load.image("edificios", "assets/edificios.png");
    this.load.image("escenario", "assets/city.gif");
  }
  create() {
    this.scene.start("main-menu");
  }
}

class MainMenu extends Phaser.Scene {
  constructor() {
    super("main-menu");
    window.MENU = this;
  }
  preload() {
    this.load.image("escenario", "assets/city.gif");
  }

  create() {
    const gif = this.add.image(400, 300, "escenario");
   const text = this.add.text(210, 150, "Bienvenido a Project Turns", {
      fontSize: "30px", 
      fontFamily: "Bold",
      color: "#ffffff",
   })
   const playbutton =  this.add.image(400, 400, "play-button");

    playbutton.setInteractive();
    playbutton.on("pointerup", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>{
        this.scene.start("game");
      })
    }, this);

  
  }


}

class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  create() {
    this.cameras.main.fadeIn(500);
    this.add.image(400, 300, "mission1");
  }}



var config = {
  type: Phaser.AUTO,
  width,
  height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [ Preloader, MainMenu, Game ],
};

const game = new Phaser.Game(config);

