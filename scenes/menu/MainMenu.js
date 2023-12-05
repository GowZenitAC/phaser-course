import Phaser from "phaser";
import { game } from "../../main";
export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("main-menu");
    window.MENU = this;
  }
  preload() {
    this.load.image("escenario", "assets/space3.png");
    this.load.image("space", "assets/images/space-bg.png");
    this.load.audio("music", "assets/audio/gameMusic.mp3");
    this.load.audio("main-music", "assets/audio/Bipedal Mech.ogg");
  }

  create() {
    const sound = this.sound.add("main-music");
    sound.play({ loop: true });
     this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, "space");
    this.bg.setOrigin(0, 0);
    this.bg.displayWidth = this.sys.game.config.width;
    this.bg.displayHeight = this.sys.game.config.height;
    const title = this.add.image(400, 200, "titulo");
    const playbutton = this.add.image(400, 400, "play-button");

    playbutton.setInteractive();
    playbutton.on(
      "pointerup",
      () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(
          Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
          () => {
            this.scene.start("init");
            this.sound.stopAll();
          }
        );
      },
      this
    );
  }

  update() {
    this.bg.tilePositionX += 1;
  }
}
