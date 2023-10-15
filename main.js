import Phaser from "phaser";
import { width, height } from "./modules/constants";

class Preloader extends Phaser.Scene {
  constructor() {
    super("preload");
  }
  preload() {
    this.load.image("play-button", "assets/images/playbutton.png");
    this.load.image("mission1", "assets/images/mission1.png");
    this.load.image("escenario", "assets/images/space3.png");
    this.load.image("titulo", "assets/images/title.png");
    this.load.audio("music", "assets/images/gameMusic.mp3");
  }
  create() {
    this.scene.start("main-menu");
  }
}

class MainMenu extends Phaser.Scene {
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
    sound.play();
    const bg = this.add.image(400, 400, "escenario");
    //  const text = this.add.text(210, 150, "Bienvenido a Project Turns", {
    //     fontSize: "30px",
    //     fontFamily: "Bold",
    //     color: "#ffffff",
    //  })
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
            this.scene.start("game");
            this.sound.stopAll();
          }
        );
      },
      this
    );
  }
}

class Example extends Phaser.Scene {
  lastFired = 0;
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
    this.load.image("enemybullet", "assets/sprites/bullet5.png");
    this.load.image("enemy", "assets/sprites/enemyship.png");
    this.load.image("spaceShip", "assets/sprites/spaceShip.png");
    this.load.image("background", "assets/sprites/starBackground.png");
    this.load.audio("laser", "assets/audio/laser1.wav");
    this.load.audio("explosion-sound", "assets/audio/explosion-sound.wav");
    this.load.audio("blaster", "assets/audio/blaster.mp3");
    this.load.audio("stellar-confrontation", "assets/audio/Stellar Confrontation-full.ogg");
  }

  create() {
    const soundbg = this.sound.add("stellar-confrontation");
    soundbg.play( { loop: true }, { volume: 0.4 });
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
        this.speed = Phaser.Math.GetSpeed(400, 1);
        this.scene.physics.world.enable(this);
      }
      fire(x, y) {
        this.setPosition(x, y + 50); // Ajusta la posición inicial de las balas de enemigos
        this.setActive(true);
        this.setVisible(true);
      }
      update(time, delta) {
        this.y += this.speed;
        if (this.y > game.config.height) {
          this.setActive(false);
          this.setVisible(false);
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
        if (this.y > game.config.height / 2) {
          if (!this.isRandomMoving) {
            // Cuando el alien llega a la mitad de la pantalla, comienza a moverse aleatoriamente
            this.startRandomMovement();
            this.horizontalSpeed = Phaser.Math.Between(-1, 1); // Velocidad horizontal aleatoria
          }
          if (time > this.lastFired) {
            this.fireBullet(); // Dispara una bala
            this.lastFired = time + this.fireRate; // Actualiza el último momento de disparo
          }
        } 
         else {
          if (this.isRandomMoving) {
            // Cuando el alien vuelve a subir, detén el movimiento aleatorio
            this.isRandomMoving = false;
            this.horizontalSpeed = 1; // Restaura la velocidad horizontal predeterminada
          }
          this.x += this.horizontalSpeed; // Mueve el alien horizontalmente
        }
      }
      
    }

    this.anims.create({
      key: "explosion_animation",
      frames: this.anims.generateFrameNumbers("explosion",),
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

    

    this.ship = this.add.sprite(400, 500, "ship").setDepth(1);
    if (this.ship) {
      this.physics.world.enable(this.ship);
      this.ship.body.setAllowGravity(false);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.enable([this.bullets, this.aliens]);

    this.speed = Phaser.Math.GetSpeed(300, 1);

    // Temporizador para generar nuevos aliens
    this.time.addEvent({
      delay: 1000, // Ajusta el intervalo de tiempo
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
        this.sound.play("blaster", { volume: 0.3 }); ;
        this.lastFired = time + 50;
      }
    }

    this.physics.add.collider(
      this.bullets,
      this.aliens,
      this.bulletHitAlien,
      null,
      this
    );
    this.physics.add.collider(
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

  bulletHitAlien(bullet, alien,) {
    console.log("Colisión detectada");
    bullet.setActive(false);
    bullet.setVisible(false);
    const explosion = this.add.sprite(alien.x, alien.y, "explosion");
    explosion.setDepth(1);
    explosion.play("explosion_animation");
    this.sound.play("explosion-sound", { volume: 1 });
    alien.destroy();
  }
  bulletHitBullet(ship, enemyBullet) {
    enemyBullet.setActive(false);
    enemyBullet.setVisible(false);
    game.pause();
    this.sound.stopByKey("stellar-confrontation");
    console.log("Me dio el alien");
  }
  
}

const config = {
  type: Phaser.AUTO,
  width,
  height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Preloader, MainMenu, Example],
};

const game = new Phaser.Game(config);
