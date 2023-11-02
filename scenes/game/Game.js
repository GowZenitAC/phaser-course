import Phaser from "phaser";
import { game } from "../../main.js";
export default class Example extends Phaser.Scene {
  lastFired = 0;
  life = 0;
  lifebar;
  cursors;
  stats;
  speed;
  ship;
  bullets;
  aliens;

  constructor() {
    super({ key: "game" });
  }

  preload() {
    this.load.image("ship", "assets/sprites/ship.png");
    this.load.image("bullet", "assets/sprites/bullet.png");
    this.load.spritesheet("explosion", "assets/sprites/explosion-7.png", {
      frameWidth: 48,
      frameHeight: 48,
      startFrame: 0,
      endFrame: 8,
    });
    this.load.spritesheet("health", "assets/sprites/lifebar2.png", {
      frameWidth: 256,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 6,
    });
    this.load.image("enemybullet", "assets/sprites/bullet5.png");
    this.load.image("enemy", "assets/sprites/enemyship.png");
    this.load.image("spaceShip", "assets/sprites/spaceShip.png");
    this.load.image("background", "assets/sprites/starBackground.png");
    this.load.audio("laser", "assets/audio/laser1.wav");
    this.load.audio("explosion-sound", "assets/audio/explosion-sound.wav");
    this.load.audio("blaster", "assets/audio/blaster.mp3");
    this.load.audio(
      "stellar-confrontation",
      "assets/audio/Stellar Confrontation-full.ogg"
    );
  }

  create() {
    const soundbg = this.sound.add("stellar-confrontation");
    soundbg.play({ loop: true }, { volume: 0.4 });
    const bg = this.add.image(400, 400, "background");
    class Bullet extends Phaser.GameObjects.Image {
      constructor(scene) {
        super(scene, 0, 0, "bullet");
        this.speed = Phaser.Math.GetSpeed(400, 1);
        this.scene.physics.world.enable(this);
      }

      fire(x, y) {
        this.setPosition(x, y - 50);
        this.setActive(true);
        this.setVisible(true);
      }

      update(time, delta) {
        this.y -= this.speed * delta;
        if (this.y < -50) {
          this.setActive(false);
          this.setVisible(false);
        }
        this.body.setAllowGravity(false); // Deshabilitar la gravedad en las balas
        this.body.setImmovable(true); // Hacer que las balas no sean móviles
      }
    }

    class EnemyBullet extends Phaser.GameObjects.Image {
      constructor(scene) {
        super(scene, 0, 0, "enemybullet");
        this.speed = Phaser.Math.GetSpeed(400, 0.2);
        this.scene.physics.world.enable(this);
      }
      fire(x, y) {
        this.setPosition(x, y + 50); // Ajusta la posición inicial de las balas de enemigos
        this.setActive(true);
        this.setVisible(true);
      }
      update(time, delta) {
        this.y += this.speed;
        if (this.y > this.scene.game.config.height) {
          this.setActive(false);
          this.setVisible(false);
          this.destroy();
        }
      }
    }

    class Alien extends Phaser.GameObjects.Image {
      constructor(scene) {
        super(scene, 0, 0, "enemy");
        this.scene.physics.world.enable(this);
        this.horizontalSpeed = 1;
        this.isRandomMoving = false;
        this.lastFired = 0;
        this.fireRate = 1000;
      }

      spawn(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.fireBullet();
      }
      startRandomMovement() {
        this.isRandomMoving = true;
      }
      fireBullet() {
        if (this.active) {
          const enemyBullet = this.scene.enemyBullets.get();
          if (enemyBullet) {
            enemyBullet.fire(this.x, this.y);
            this.scene.sound.play("laser", { volume: 0.3 }); // No es necesario reproducir el sonido de disparo de los enemigos, puedes omitirlo si lo deseas
          }
        }
      }

      update(time, delta) {
        this.y += 0.5; // Ajusta la velocidad de caída
        if (this.y > game.config.height / 3) {
          if (!this.isRandomMoving) {
            // Cuando el alien llega a la mitad de la pantalla, comienza a moverse aleatoriamente
            this.startRandomMovement();
            this.horizontalSpeed = Phaser.Math.Between(-1, 1); // Velocidad horizontal aleatoria
          }
          if (time > this.lastFired) {
            this.fireBullet(); // Dispara una bala
            this.lastFired = time + this.fireRate; // Actualiza el último momento de disparo
          }
        } else {
          if (this.isRandomMoving) {
            // Cuando el alien vuelve a subir, detén el movimiento aleatorio
            this.isRandomMoving = false;
            this.horizontalSpeed = 1; // Restaura la velocidad horizontal predeterminada
          }
          this.x += this.horizontalSpeed; // Mueve el alien horizontalmente
        }
        if (this.y > this.scene.game.config.width) {
          this.destroy();
          // console.log("alien desaparecido");
        }
      }
    }

    this.anims.create({
      key: "explosion_animation",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
    });

    this.bullets = this.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.enemyBullets = this.add.group({
      classType: EnemyBullet,
      maxSize: 150, // Ajusta según tus necesidades
      runChildUpdate: true,
    });

    this.aliens = this.add.group({
      classType: Alien,
      maxSize: 200, // Ajusta según tus necesidades
      runChildUpdate: true,
    });
    this.lifevalues = [100, 90, 75, 50, 35, 15, 0];
    this.lifeText = this.add
      .text(51, 480, this.lifevalues[0].toString(), {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#ffffff",
      })
      .setDepth(1.5);
    this.healthText = this.add
      .text(150, 530, "Health", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
      })
      .setDepth(1);
    this.lifebar = this.add.sprite(150, 500, "health").setDepth(1);
    this.ship = this.add.sprite(400, 500, "ship").setDepth(1);
    if (this.ship) {
      this.physics.world.enable(this.ship);
      this.ship.body.setAllowGravity(false);
      this.ship.body.setCollideWorldBounds(true);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.enable([this.bullets, this.aliens]);

    this.speed = Phaser.Math.GetSpeed(300, 1);

    // Temporizador para generar nuevos aliens
    this.time.addEvent({
      delay: 500, // Ajusta el intervalo de tiempo
      callback: this.spawnAlien,
      callbackScope: this,
      loop: true,
    });
  }

  update(time, delta) {
    if (this.cursors.left.isDown) {
      this.ship.x -= this.speed * delta;
    } else if (this.cursors.right.isDown) {
      this.ship.x += this.speed * delta;
    }

    if (this.cursors.up.isDown && time > this.lastFired) {
      const bullet = this.bullets.get();
      if (bullet) {
        bullet.fire(this.ship.x, this.ship.y);
        this.sound.play("blaster", { volume: 0.3 });
        this.lastFired = time + 50;
      }
    }

    // this.bullets.children.each((bullet) => {
      this.physics.overlap(
        this.bullets,
        this.aliens,
        this.bulletHitAlien,
        null,
        this
      );
    // });
    this.physics.overlap(
      this.ship,
      this.enemyBullets,
      this.bulletHitBullet,
      null,
      this
    );
  }

  spawnAlien() {
    const x = Phaser.Math.Between(0, game.config.width);
    const y = -50; // Posición en la parte superior de la pantalla
    const alien = this.aliens.get();
    if (alien) {
      alien.spawn(x, y);
    }
  }

  bulletHitAlien(bullet, alien) {
    console.log("Colisión detectada");
    bullet.setActive(false);
    bullet.setVisible(false);
    const explosion = this.add.sprite(alien.x, alien.y, "explosion");
    explosion.setDepth(1);
    explosion.play("explosion_animation");
    this.sound.play("explosion-sound", { volume: 1 });
    alien.destroy();
    bullet.destroy();
  }
  bulletHitBullet(ship, enemyBullet) {
    enemyBullet.setActive(false);
    enemyBullet.setVisible(false);
    enemyBullet.destroy();
    // game.pause();
    console.log("Me dio el alien");
    this.life += 1;
    this.lifeText.setText(this.lifevalues[this.life].toString());
    this.lifebar.setFrame(this.life);
    if (this.life >= 6) {
      this.healthText.setText("You lose!");
      this.sound.stopByKey("stellar-confrontation");

      game.pause();
    }
  }
}
