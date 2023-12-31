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
  shieldActive = false;
  shieldlife = 1;
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
    this.load.spritesheet(
      "explosion-ship",
      "assets/sprites/explosion-ship.png",
      {
        frameWidth: 119,
        frameHeight: 223,
        startFrame: 0,
        endFrame: 7,
      }
    );
    this.load.spritesheet("health", "assets/sprites/lifebar2.png", {
      frameWidth: 256,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 6,
    });
    this.load.spritesheet("shieldbar", "assets/sprites/shield-bar.png", {
      frameWidth: 192,
      frameHeight: 192,
      startFrame: 0,
      endFrame: 5,
    });
    this.load.spritesheet("asteroid", "assets/sprites/asteroid.png", {
      frameWidth: 432,
      frameHeight: 357,
      startFrame: 0,
      endFrame: 19,
    });
    this.load.image("enemybullet", "assets/sprites/bullet5.png");
    this.load.image("shield", "assets/sprites/shield2.png");
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
          this.destroy();
        }
        if (this.active) {
          //comprobar si estan activas las balas para no destruirlas
          this.body.setAllowGravity(false); // Deshabilitar la gravedad en las balas
          this.body.setImmovable(true); // Hacer que las balas no sean móviles
        }
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
    this.anims.create({
      key: "explosion_ship_animation",
      frames: this.anims.generateFrameNumbers("explosion-ship"),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "rotate",
      frames: this.anims.generateFrameNumbers("asteroid"),
      frameRate: 10,
      repeat: -1,
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

    this.shields = this.physics.add.group({
      key: "shield",
      maxSize: 3,
      setXY: { x: 400, y: 0, stepX: 70 },
    });

    this.asteroidGroup = this.physics.add.group();


    this.aliens = this.add.group({
      classType: Alien,
      maxSize: 350, // Ajusta según tus necesidades
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
    this.shieldbar = this.add.sprite(150, 500, "shieldbar").setDepth(1);
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
      delay: 250, // Ajusta el intervalo de tiempo
      callback: this.spawnAlien,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 30000, // 50000 milisegundos = 50 segundos
      callback: this.spawnShield,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 400000, // 10000 milisegundos = 10 segundos
      callback: this.spawnAsteroid,
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

    this.asteroidGroup.getChildren().forEach(asteroid => {
      if (asteroid.y > this.game.config.height) {
        // Si el asteroide sale de la pantalla por abajo, lo reciclamos
        this.asteroidGroup.killAndHide(asteroid);
        asteroid.setActive(false);
        asteroid.setVisible(false);
      }
    });

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
    this.physics.overlap(
      this.ship,
      this.shields,
      this.collectShield,
      null,
      this
    );

    this.physics.overlap(
      this.ship,
      this.asteroidGroup,
      this.asteroidHitShip,
      null,
      this
    )
  }
  stopShipShooting() {
    this.lastFired = Number.POSITIVE_INFINITY; // Detener futuros disparos
  }
  spawnAlien() {
    const x = Phaser.Math.Between(0, game.config.width);
    const y = -50; // Posición en la parte superior de la pantalla
    const alien = this.aliens.get();
    if (alien) {
      alien.spawn(x, y);
    }
  }

  spawnShield() {
    const x = Phaser.Math.Between(0, this.game.config.width);
    const y = 0; // Posición en la parte superior de la pantalla
    let shield = this.shields.getFirstDead();
    if (!shield) {
      return; // Si no hay escudos inactivos, no hagas nada
    }
    shield.setPosition(x, y);
    shield.setActive(true);
    shield.setVisible(true);
    shield.setBounce(1, 1);
    shield.setCollideWorldBounds(true);
    shield.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }

  spawnAsteroid() {
    const x = Phaser.Math.Between(0, this.game.config.width);
    const y = Phaser.Math.Between(-100, -50); // Adjust these values according to your needs
    const asteroid = this.asteroidGroup.create(x, y, "asteroid");    

    asteroid.setActive(true);
    asteroid.setVisible(true);

    asteroid.setScale(0.2);
    asteroid.setCollideWorldBounds(false);
    asteroid.play("rotate"); // Inicia la animación
    asteroid.setVelocity(300, 300); // Ajusta la velocidad según tus necesidades
  }

  collectShield(ship, shield) {
    // shield.disableBody(true, true);
    shield.setActive(false);
    shield.setVisible(false);
    this.shieldlife = 1;
    this.shieldbar.setFrame(this.shieldlife);
    this.shieldActive = true;
    // Aquí puedes agregar código para aumentar la vida del jugador,
    // o cualquier otro beneficio que quieras darle al recoger el escudo
  }

  asteroidHitShip(player, asteroid) {
    // Cuando el jugador colisiona con un asteroide, ejecuta alguna lógica
    // player.setAlpha(0.5); // Cambia la opacidad del jugador
    asteroid.setActive(false); // Desactiva el asteroide
    asteroid.setVisible(false);
    asteroid.destroy();
    if (this.shieldActive) {
      this.shieldActive = false;
      this.shieldlife = 5
      this.shieldbar.setFrame(this.shieldlife);
      
    }else{
      this.life = 6;
      this.lifeText.setText(this.lifevalues[this.life].toString());
      this.lifebar.setFrame(this.life);
      if (this.life >= 6) {
        this.sound.stopByKey("stellar-confrontation");
        const explosionShip = this.add.sprite(
          this.ship.x,
          this.ship.y,
          "explosion-ship"
        );
        explosionShip.setDepth(1);
        explosionShip.play("explosion_ship_animation");
        this.ship.destroy();
        explosionShip.on(
          "animationcomplete",
          () => {
            this.time.delayedCall(3000, () => {
              this.cameras.main.fadeOut(1000);
              this.time.delayedCall(1000, () => {
                this.scene.start("climax");
              });
            });
          },
          this
        );
      }
    }
    console.log("Colisión con asteroide detectada");
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
    if (this.shieldActive) {
      this.shieldlife += 1;
      this.shieldbar.setFrame(this.shieldlife);
      if (this.shieldlife >= 5) {
        this.shieldActive = false;
      }
    } else {
      this.life += 1;
      this.lifeText.setText(this.lifevalues[this.life].toString());
      this.lifebar.setFrame(this.life);
      if (this.life >= 6) {
        this.stopShipShooting();
        this.sound.stopByKey("stellar-confrontation");
        const explosionShip = this.add.sprite(
          this.ship.x,
          this.ship.y,
          "explosion-ship"
        );
        explosionShip.setDepth(1);
        explosionShip.play("explosion_ship_animation");
        this.ship.destroy();
        explosionShip.on(
          "animationcomplete",
          () => {
            this.time.delayedCall(3000, () => {
              this.cameras.main.fadeOut(1000);
              this.time.delayedCall(1000, () => {
                this.scene.start("climax");
              });
            });
          },
          this
        );
      }
    }
  }
}
