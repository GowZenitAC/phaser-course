import Phaser from "phaser";
import { width, height } from "./modules/constants";

class Preloader extends Phaser.Scene {
  constructor() {
    super("preload");
  }
  preload() {
    this.load.image("play-button", "assets/playbutton.png");
    this.load.image("mission1", "assets/mission1.png");
    this.load.image("escenario", "assets/space3.png");
    this.load.image("titulo", "assets/title.png");
    this.load.audio("music", "assets/gameMusic.mp3");
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
  }

  create() {
    const sound = this.sound.add("music");
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
    this.load.image("enemybullet", "assets/sprites/bullet4.png");
    this.load.image("alien", "assets/sprites/alien.png");
    this.load.image("enemy", "assets/sprites/enemyship.png");
    this.load.image("spaceShip", "assets/sprites/spaceShip.png");
    this.load.image("background", "assets/sprites/starBackground.png");
    this.load.audio("laser", "assets/audio/laser1.wav");

  }

  create() {
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

    class Alien extends Phaser.GameObjects.Image {
      constructor(scene) {
        super(scene, 0, 0, "enemy");
        this.scene.physics.world.enable(this);
      }

      spawn(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
      }

      update(time, delta) {
        this.y += 0.5; // Adjust the falling speed
        if (this.y > game.config.height / 3) {
          this.y = game.config.height / 3; // Set the y position to the middle of the screen
        } else {
          this.x += 0.5; // Move the alien horizontally
        }
      }
      
    }

    this.bullets = this.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.aliens = this.add.group({
      classType: Alien,
      maxSize: 50, // Ajusta según tus necesidades
      runChildUpdate: true,
    });

    this.ship = this.add.sprite(400, 500, "ship").setDepth(1);

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
        this.sound.play("laser");
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
    alien.destroy()
  }
}

var config = {
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
