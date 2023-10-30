import Phaser from "phaser";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("main-menu");
    window.MENU = this;
  }
  preload() {
    this.load.image("escenario", "assets/space3.png");
    this.load.audio("music", "assets/audio/gameMusic.mp3");
    this.load.audio("main-music", "assets/audio/Bipedal Mech.ogg");
  }

  create() {
    const sound = this.sound.add("main-music");
    sound.play({ loop: true });
    const bg = this.add.image(400, 400, "escenario");

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
}
