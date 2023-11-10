import Phaser from "phaser";
import { game } from "../../main.js";

export default class Climax3 extends Phaser.Scene {
    constructor() {
        super({ key: "climax3" });
    }
    preload() {
        this.load.image("capsuleFull", "assets/images/capsule-complete.png");
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.background = this.add.image(0, 0,'capsuleFull', );
        this.background.setOrigin(0, 0);

        this.scale.on('resize', this.resize, this);
        this.resize();  
    }
    resize() {
        const { width, height } = this.scale;
        this.background.setScale(width / this.background.width, height / this.background.height);
    }
}