import Phaser from "phaser";
export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preload");
  }
  preload() {
    this.load.image("play-button", "assets/images/playbutton.png");
    this.load.image("mission1", "assets/images/mission1.png");
    this.load.image("escenario", "assets/images/space3.png");
    this.load.image("titulo", "assets/images/title.png");
    // this.load.audio("music", "assets/images/gameMusic.mp3");
  }
  create() {
    this.scene.start("dos");
  }
}
