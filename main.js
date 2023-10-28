import Phaser from "phaser";
import { width, height } from "./modules/constants";

class Preloader extends Phaser.Scene {
  constructor() {
    super("preload");
  }
  preload() {
    this.load.image("play-button", "assets/images/playbutton.png");
    this.load.image("comenzar", "assets/images/start.png");
    this.load.image("mission1", "assets/images/mission1.png");
    this.load.image("escenario", "assets/images/space3.png");
    this.load.image("titulo", "assets/images/title.png");
    this.load.audio("music", "assets/images/gameMusic.mp3");
    this.load.image("background", "assets/images/station2.png");
    this.load.audio("music", "assets/images/Bipedal Mech.ogg");
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
    sound.play({ loop: true });
    const bg = this.add.image(400, 400, "escenario");

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
            this.scene.start("init");
            this.sound.stopAll();
          }
        );
      },
      this
    );
  }
}

class Init extends Phaser.Scene {
  constructor() {
    super("init");
  }
  preload() {}
  create() {
    
    const sceneWidth = this.sys.game.config.width;
    const sceneHeight = this.sys.game.config.height;
      // const bgWidth = bg.width;
      // const bgHeight = bg.height;
    const bg = this.add.image(400, 400, "background");
    const centerX = sceneWidth / 2;
    const centerY = sceneHeight / 2;
    bg.setPosition(centerX, centerY);
    const text = this.add.text(100, 50, "", {
      fontSize: "24px",
      fill: "#ffffff",
      wordWrap: { width: 600 },
    });

    const message1 =
      "En elibre.";
    const message2 =
      "David Martza el caos , comienza la destrucción";
    const delay = 50; // Milisegundos de retraso entre cada carácter
    let index = 0;
    const timer = this.time.addEvent({
      delay: delay,
      callback: () => {
        text.text += message1[index];
        index++;
        if (index === message1.length) {
          timer.destroy(); // Detén el temporizador cuando se complete el primer mensaje.
          // Agrega un evento para esperar la entrada del teclado antes de mostrar el segundo mensaje.
          this.input.keyboard.once("keydown", () => {
            text.text = ""; // Borra el primer mensaje
            this.showSecondMessage(text, message2, delay);
          });
        }
      },
      repeat: message1.length - 1,
    });
  }

  showSecondMessage(text, message, delay) {
    let index = 0;
    const timer = this.time.addEvent({
      delay: delay,
      callback: () => {
        text.text += message[index];
        index++;
        if (index === message.length) {
          timer.destroy(); // Detén el temporizador cuando se complete el segundo mensaje.
          this.addNextSceneButton();
        }
      },
      repeat: message.length - 1,
    });
  }
  addNextSceneButton() {
    const nextButton = this.add.image(400, 550, 'comenzar');
  nextButton.setScale(0.2, 0.2);

  // Crea la animación de Tween
  this.tweens.add({
    targets: nextButton,
    alpha: 0.5, // Cambia la opacidad del botón a 0.5 (semi-transparente)
    duration: 1000, // Duración de la animación en milisegundos
    yoyo: true, // Hace que la animación se repita de ida y vuelta
    repeat: -1 // Repite la animación indefinidamente
  });

  nextButton.setInteractive();

  nextButton.on('pointerdown', () => {
    this.scene.start('game');
  });
  }
  

  upload() {}
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

  bulletHitAlien(bullet, alien) {
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
  scene: [Preloader, MainMenu, Example, Init],
};

const game = new Phaser.Game(config);
