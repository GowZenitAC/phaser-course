import Phaser from "phaser";
import { game } from "../../main.js";

export default class Nivel2 extends Phaser.Scene {
  lastFired = 0;
  bullets;
  fallSpeed = 0;
  
  constructor() {
    super({ key: "dos" });
  }
  preload() {
    // load all assets tile sprites
    this.load.image("bg_1", "assets/images/bg-1.png");
    this.load.image("bg_2", "assets/images/bg-2.png");
    this.load.image("ground", "assets/images/ground.png");
    this.load.image("bala", "assets/images/bala.png");
    // load spritesheet
    this.load.spritesheet("player", "assets/sprites/player-right.png", {
      frameWidth: 122,
      frameHeight: 122,
    });
    this.load.spritesheet("playerizq", "assets/sprites/playerizq.png", {
      frameWidth: 122,
      frameHeight: 122,
    });
  }

  create() {
    this.bullets = this.physics.add.group({
      defaultKey: "bala",
      maxSize: 30,
      runChildUpdate: true,
    });

    this.fireKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z
    );

    // create an tiled sprite with the size of our game screen
    this.bg_1 = this.add.tileSprite(
      0,
      0,
      game.config.width,
      game.config.height,
      "bg_1"
    );
    // Set its pivot to the top left corner
    this.bg_1.setOrigin(0, 0);
    // fixe it so it won't move when the camera moves.
    // Instead we are moving its texture on the update
    this.bg_1.setScrollFactor(0);

    // Add a second background layer. Repeat as in bg_1
    this.bg_2 = this.add.tileSprite(
      0,
      0,
      game.config.width,
      game.config.height,
      "bg_2"
    );
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
    this.player = this.add.sprite(300, 495, "player");
    // create an animation for the player
    this.anims.create({
      key: "player-right",
      frames: this.anims.generateFrameNumbers("player", { start: 2, end: 9 }),
      frameRate: 20,
    });
    this.anims.create({
      key: "player-left",
      frames: this.anims.generateFrameNumbers("playerizq", {
        start: 37,
        end: 30,
      }),
      frameRate: 20,
    });
    
    this.anims.create({
      key: "player-static",
      frames: [{ key: "player", frame: 0 }], // Cambia 0 al número de frame que desees mostrar
      frameRate: 1, // Puedes ajustar la velocidad de la animación si es necesario
      repeat: -1, // -1 para hacer que la animación se repita continuamente
    });
    this.anims.create({
      key: "player-static-izq",
      frames: [{ key: "playerizq", frame: 39 }], // Cambia 0 al número de frame que desees mostrar
      frameRate: 1, // Puedes ajustar la velocidad de la animación si es necesario
      repeat: -1, // -1 para hacer que la animación se repita continuamente
    });
    // salto hacia derecha
    this.anims.create({
      key: "player-jump",
      frames: this.anims.generateFrameNumbers("player", { 
        start: 26,
        end: 33, }),
      frameRate: 20,
    });
    // mirar hacia arriba derecha
    this.anims.create({
      key: "player-up",
      frames: [{ key: "player", frame: 1 }],
      frameRate: 20,
    });
    // mirar hacia arriba izquierda
    this.anims.create({
      key: "player-up-left",
      frames: { key: "playerizq", frame: 38 },
      frameRate: 20,
    });
    // mirar en diagonal derecho
    this.anims.create({
      key: "player-diag-der",
      frames: this.anims.generateFrameNumbers("player", {
        start: 10,
        end : 17,
      }),
      frameRate: 20,
    });
    // mirar en diagonal izquierda
    this.anims.create({
      key: "player-diag-contrario",
      frames: this.anims.generateFrameNumbers("playerizq", {
        start: 28,
        end: 22,
      }),
      frameRate: 20,
    });
    // player izquierda

    // allow key inputs to control the player
    this.cursors = this.input.keyboard.createCursorKeys();

    this.player.direction = "right";
    // set workd bounds to allow camera to follow the player
    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, game.config.width * 3, game.config.height);

    // making the camera follow the player
    this.myCam.startFollow(this.player);

    this.player.isJumping = false; // Agregar una variable para rastrear si el jugador está en el aire


    // habilitar boton 
  }

  update(time, delta) {
    this.bullets.children.each(function (bullet) {
      if (bullet.active) {
        if (bullet.x > game.config.width * 3 || bullet.x < 0) {
          bullet.setActive(false);
          bullet.setVisible(false);
        }
      }
    }, this);
  
    if (this.cursors.left.isDown && this.player.x > 0 && this.cursors.up.isDown) {
      this.player.x -= 3;
      this.player.direction = "left";
      if (
        !this.player.anims.isPlaying ||
        (this.player.anims.isPlaying &&
          this.player.anims.currentAnim.key !== "player-diag-contrario")
      ) {
        this.player.play("player-diag-contrario", true);
      }
    } else if (this.cursors.left.isDown && this.player.x > 0) {
      this.player.x -= 3;
      this.player.direction = "left";
      if (
        !this.player.anims.isPlaying ||
        (this.player.anims.isPlaying &&
          this.player.anims.currentAnim.key !== "player-left")
      ) {
        this.player.play("player-left", true);
      }
    } else if (
      this.cursors.right.isDown &&
      this.player.x < game.config.width * 3 &&
      this.cursors.up.isDown
    ) {
      this.player.x += 3;
      this.player.direction = "right";
      if (
        !this.player.anims.isPlaying ||
        (this.player.anims.isPlaying &&
          this.player.anims.currentAnim.key !== "player-diag-der")
      ) {
        this.player.play("player-diag-der", true);
      } 
    } else if (this.cursors.right.isDown && this.player.x < game.config.width * 3) {
      this.player.x += 3;
      this.player.direction = "right";
      if (
        !this.player.anims.isPlaying ||
        (this.player.anims.isPlaying &&
          this.player.anims.currentAnim.key !== "player-right")
      ) {
        this.player.play("player-right", true);
      }
    } else {
      if (this.player.direction === "right") {
        if (
          !this.player.anims.isPlaying ||
          (this.player.anims.isPlaying &&
            this.player.anims.currentAnim.key !== "player-static")
        ) {
          this.player.play("player-static");
        }
      } else if (this.player.direction === "left") {
        if (
          !this.player.anims.isPlaying ||
          (this.player.anims.isPlaying &&
            this.player.anims.currentAnim.key !== "player-static-izq")
        ) {
          this.player.play("player-static-izq");
        }
      }
  
      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).isDown) {
        this.player.play("player-up", true);
      }
    }
  
    // scroll the texture of the tilesprites proportionally to the camera scroll
    this.bg_1.tilePositionX = this.myCam.scrollX * 0.3;
    this.bg_2.tilePositionX = this.myCam.scrollX * 0.6;
    this.ground.tilePositionX = this.myCam.scrollX;
    if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
      this.fireBullet();
    }
  }
  
  
  fireBullet() {
    let bullet = this.bullets.get();
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.setAllowGravity(false);
      // bullet.setPosition(this.player.x, this.player.y);
      // Ajustar la velocidad de la bala según la dirección del jugador
      if (this.player.direction === "right") {
        bullet.body.velocity.x = 800;
        bullet.setPosition(
          this.player.x + this.player.width / 2,
          this.player.y
        );
      } else {
        bullet.body.velocity.x = -800;
        bullet.setPosition(
          this.player.x - this.player.width / 2,
          this.player.y
        );
      }
    }
  }
  collectBullet(player, bullet) {
    bullet.disableBody(true, true);
  }
}
