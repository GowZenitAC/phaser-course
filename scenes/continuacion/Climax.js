import Phaser from "phaser";
import { game } from "../../main.js";

export default class Climax extends Phaser.Scene {
    constructor() {
        super({ key: "climax" });
    }
    preload() {
        this.load.image("background", "assets/sprites/starBackground.png");
        this.load.spritesheet("capsule", "assets/sprites/capsule-spritesheet.png", {
            frameWidth: 223,
            frameHeight: 223,
            startFrame: 0,
            endFrame: 4
        })
    }
    create() {
       this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background');
        this.background.setOrigin(0, 0);
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;


        //animacion de caida
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('capsule'),
            frameRate: 10,
            repeat: -1
        });
        this.capsule = this.add.sprite(game.config.width / 2, 0, 'capsule');
        this.capsule.play('fall', true);
    }
    update() {
        this.background.tilePositionY += 5;

        if (this.capsule.y < game.config.height / 2) {
            this.capsule.y += 3;
        } else {
            this.capsule.y += 1;
        }

        if (this.capsule.y > game.config.height) {
            this.cameras.main.fadeOut(5000, 0, 0, 0);
            
            this.time.delayedCall(1000, () => {
                this.scene.start("climax2");
            });
        }
        

    }
}