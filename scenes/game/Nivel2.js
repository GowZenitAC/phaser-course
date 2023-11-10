import Phaser from "phaser";
import { game } from "../../main.js";

export default class Nivel2 extends Phaser.Scene {
    lastFired = 0;
    bullets;
    constructor() {
        super({key: "dos"});

    }
    preload() {
              // load all assets tile sprites
      this.load.image("bg_1", "assets/images/bg-1.png");
      this.load.image("bg_2", "assets/images/bg-2.png");
      this.load.image("ground", "assets/images/ground.png");
      this.load.image("bala", "assets/images/bala.png");
      // load spritesheet
      this.load.spritesheet("player", "assets/sprites/player2.png",{
        frameWidth: 72,
        frameHeight: 72,
      });
      this.load.spritesheet("playerizq", "assets/sprites/playerizq.png",{
        frameWidth: 72,
        frameHeight: 72,
      });
    }

    create() {
        class disparo extends Phaser.GameObjects.Image {
            constructor(scene) {
              super(scene, 0, 0, "bala");
              this.speed = Phaser.Math.GetSpeed(400, 1);
              this.scene.physics.world.enable(this);
            }
      
            fire(x, y) {
              this.setPosition(x, y - 50);
              this.setActive(true);
              this.setVisible(true);
            }
      
            update(time, delta) {
              this.x -= this.speed * delta;
              if (this.x < -50) {
                this.setActive(false);
                this.setVisible(false);
                this.destroy();
              }
              if (this.active) {
                //comprobar si estan activas las balas para no destruirlas
                this.body.setAllowGravity(false); // Deshabilitar la gravedad en las balas
                this.body.setImmovable(true); // Hacer que las balas no sean móviles
              }
            }
          }
    // grupo de balas
    this.bullets = this.add.group({
      classType: disparo,
      maxSize: 10,
      runChildUpdate: true
    })

        // create an tiled sprite with the size of our game screen
    this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg_1");
    // Set its pivot to the top left corner
    this.bg_1.setOrigin(0, 0);
    // fixe it so it won't move when the camera moves.
    // Instead we are moving its texture on the update
    this.bg_1.setScrollFactor(0);

    // Add a second background layer. Repeat as in bg_1
    this.bg_2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg_2");
    this.bg_2.setOrigin(0, 0);
    this.bg_2.setScrollFactor(0);

    // add the ground layer which is only 48 pixels tall
    this.ground = this.add.tileSprite(0, 0, game.config.width, 200, "ground");
    this.ground.setOrigin(0, 0);
    this.ground.setScrollFactor(0);
    // sinc this tile is shorter I positioned it at the bottom of he screen
    // this.ground.y = 12 * 16;
    // Ajustar la posición vertical del suelo para moverlo más abajo
    this.ground.y = game.config.height - 130; // Ajusta el valor 48 según tu preferencia
    

    // add player
    this.player = this.add.sprite(300, 510, "player");
    // create an animation for the player
    this.anims.create({
      key: "player-right",
      frames: this.anims.generateFrameNumbers("player", { start: 2, end: 9 }),
      frameRate: 20,
    });
    this.anims.create({
        key: 'player-static',
        frames: [{ key: 'player', frame: 0 }], // Cambia 0 al número de frame que desees mostrar
        frameRate: 1, // Puedes ajustar la velocidad de la animación si es necesario
        repeat: -1, // -1 para hacer que la animación se repita continuamente
    });
    // player izquierda

    

    // allow key inputs to control the player
    this.cursors = this.input.keyboard.createCursorKeys();


    // set workd bounds to allow camera to follow the player
    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, game.config.width * 3, game.config.height);

    // making the camera follow the player
    this.myCam.startFollow(this.player);
        
    }

    update( time, delta ) {
        // move the player when the arrow keys are pressed
        if (this.cursors.left.isDown && this.player.x > 0) {
            this.player.x -= 3;
            this.player.scaleX = -1; // Cambiar a escala negativa
            if (!this.player.anims.isPlaying || (this.player.anims.isPlaying && this.player.anims.currentAnim.key !== 'player-left')) {
                // this.player.play("player-left", true);
            }
        }
        else if (this.cursors.right.isDown && this.player.x < game.config.width * 3) {
            this.player.x += 3;
            this.player.scaleX = 1; // Cambiar a escala positiva
            if (!this.player.anims.isPlaying || (this.player.anims.isPlaying && this.player.anims.currentAnim.key !== 'player-right')) {
                this.player.play("player-right", true);
            }
        }

        

        

      
  
      // scroll the texture of the tilesprites proportionally to the camera scroll
      this.bg_1.tilePositionX = this.myCam.scrollX * .3;
      this.bg_2.tilePositionX = this.myCam.scrollX * .6;
      this.ground.tilePositionX = this.myCam.scrollX;
      

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M).isDown && time > this.lastFired) {
        const bullet = this.bullets.get();
        if (bullet) {
          bullet.fire(this.player.x, this.player.y);
          // this.sound.play("blaster", { volume: 0.3 });
          this.lastFired = time + 50;
        }
      }
      
    }
}