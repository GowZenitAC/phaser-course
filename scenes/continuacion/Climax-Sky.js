import Phaser from "phaser";
import { game } from "../../main.js";

export default class Climax2 extends Phaser.Scene {
    constructor() {
        super({ key: "climax2" });
    }
    preload() {
        this.load.image("sky", "assets/images/sky.png");
        this.load.image("capsuleFull", "assets/images/capsule-complete.png");
        this.load.spritesheet("capsule", "assets/sprites/capsule-spritesheet.png", {
            frameWidth: 223,
            frameHeight: 223,
            startFrame: 0,
            endFrame: 4
        })
    }
    create() {
        this.cameras.main.fadeIn(1000);

       this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sky');
        this.background.setOrigin(0, 0);
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;


        //animacion de caida
        this.anims.create({
            key: 'fall2',
            frames: this.anims.generateFrameNumbers('capsule'),
            frameRate: 20,
            repeat: -1
        });
        this.capsule = this.add.sprite(game.config.width / 2, 0, 'capsule');
        this.capsule.play('fall2', true);
    }
    update() {
        this.background.tilePositionY += 5;

        this.capsule.y += 3;
        if (this.capsule.y > game.config.height) {
            this.cameras.main.fadeOut(5000, 0, 0, 0);
            
            this.time.delayedCall(1000, () => {
                this.scene.start("climax3");
            });
            
        }
        

    }
}