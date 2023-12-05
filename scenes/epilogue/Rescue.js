import Phaser from "phaser";
import { game } from "../../main.js";

export default class Rescue extends Phaser.Scene {
    constructor() {
        super({ key: "rescue" });
    }
    preload() {
        this.load.image("bg-rescue", "assets/images/rescue-bg.jpg");
        this.load.image("rescue-ship", "assets/images/ship-rescue.png");
    }
    create() {
        class Ship extends Phaser.GameObjects.Image {
            constructor(scene) {
                super(scene, 0, 0, "rescue-ship");
                scene.add.existing(this);
                scene.physics.add.existing(this);
                this.speed = 1;
            }
            spawn(x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
                this.setDepth(1);
            }
            update() {
                this.body.setAllowGravity(false);
                this.body.setImmovable(false);
                this.x += this.speed;
                this.setDepth(1);
            }
        }
        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-rescue");
        this.bg.setOrigin(0, 0);
        this.bg.displayHeight = this.sys.game.config.height;
        this.bg.displayWidth = this.sys.game.config.width;

        this.ship = this.add.group({
            classType: Ship,
            maxSize: 1,
            runChildUpdate: true
        });

        this.time.addEvent({
            delay:2000,
            callback:this.spawn,
            callbackScope:this

        })
    }
    update() {
        this.bg.tilePositionX += 3; 
        this.ship.children.iterate(ship => {
            if (ship.x > game.config.width + 120) {
                this.scene.start('credits'); // Reemplaza 'otra_escena' con el nombre de tu otra escena
            }
        });
    }
    spawn(){
        const x = -120;
        const y = game.config.width / 2;
        const ship = this.ship.get();
        if (ship) {
            ship.spawn(x, y);
        }
    }
}