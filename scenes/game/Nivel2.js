import Phaser from "phaser";
import { game } from "../../main.js";
export default class Nivel2 extends Phaser.Scene {
  lastFired = 0;
  bullets;
  bulletsup;
  fallSpeed = 0;
  helicopterAlive = true;
  jumpKey;
  killedSoldiers = 0;
  life = 0;
  healthHelicopter = 10;
  constructor() {
    super({ key: "dos" });
  }
  preload() {
    // load all assets tile sprites
    this.load.audio("explosion-sound", "assets/audio/explosion-sound.wav");
    this.load.audio("retro_metal", "assets/audio/retro_metal.ogg");
    this.load.image("bg_1", "assets/images/bg-1.png");
    this.load.image("bg_2", "assets/images/bg-2.png");
    this.load.image("ground", "assets/images/ground.png");
    this.load.image("bala", "assets/images/bala.png");
    this.load.image("balaup", "assets/images/balaup.png");
    // load spritesheet
    this.load.spritesheet("health", "assets/sprites/lifebar2.png", {
      frameWidth: 256,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 6,
    });
    this.load.spritesheet("player", "assets/sprites/player-right.png", {
      frameWidth: 122,
      frameHeight: 122,
    });
    this.load.spritesheet("playerizq", "assets/sprites/playerizq.png", {
      frameWidth: 122,
      frameHeight: 122,
    });
    this.load.spritesheet("helicopter1", "assets/sprites/helicopter1.png", {
      frameWidth: 256,
      frameHeight: 256,
    });
    this.load.spritesheet("explosion", "assets/sprites/explosion.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet(
      "soldado_caminando",
      "assets/sprites/soldier-runed.png",
      {
        frameWidth: 224,
        frameHeight: 224,
      }
    );
    this.load.spritesheet(
      "soldado_caminando_reverso",
      "assets/sprites/soldier-runed-reverse.png",
      {
        frameWidth: 224,
        frameHeight: 224,
      }
    );
    this.load.spritesheet(
      "soldado_disparar",
      "assets/sprites/soldado_disparar.png",
      {
        frameWidth: 112,
        frameHeight: 112,
      }
    );
  }
  create() {
   const soundbg = this.sound.add("retro_metal", { loop: true, volume: 1.0 });
    soundbg.play();
    // hasta aqui
    // clase de soldado_caminando
    class SoldierRun extends Phaser.GameObjects.Sprite {
      constructor(scene) {
        super(scene, 0,0, "soldado_caminando");
        this.scene = scene
        this.speed = 1;
        this.scene.physics.world.enable(this);
      }
      spawn(x, y){
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
      }
      update() {
        // Mover el soldado
        this.x -= this.speed;
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.velocity.set(0);
        this.body.setSize(30, 30);
      }
    }
    class SoldierRunReverse extends Phaser.GameObjects.Sprite {
      constructor(scene) {
        super(scene, 0,0, "soldado_caminando_reverso");
        this.scene = scene
        this.speed = 1;
        this.scene.physics.world.enable(this);
      }
      spawn(x, y){
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
      }
      update() {
        // Mover el soldado
        this.x += this.speed;
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.velocity.set(0);
        this.body.setSize(30, 30);
      }
    }
    this.soldiersRun = this.add.group({
      classType: SoldierRun,
      maxSize: 10,
      runChildUpdate: true
    });
    this.soldiersRunRev = this.add.group({
      classType: SoldierRunReverse,
      maxSize: 10,
      runChildUpdate: true
    });
    this.bullets = this.physics.add.group({
      defaultKey: "bala",
      maxSize: 30,
      runChildUpdate: true,
    });
    // grupo de balas arriba eje y
    
    this.bulletsHelicopter = this.physics.add.group({
      defaultKey: "bala",
      maxSize: 30,
      runChildUpdate: true,
    });
    this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
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
    this.player = this.physics.add.sprite(300, 495, "player");
    this.player.body.setAllowGravity(false);
    this.lifebar = this.add.sprite(150, 50, "health").setDepth(2);
    this.lifebar.setScrollFactor(0);
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
        end: 33,
      }),
      frameRate: 12,
      repeat: -1,
    });
    // helicopter1
    this.anims.create({
      key: "helicopter1",
      frames: this.anims.generateFrameNumbers("helicopter1", {
        start: 0,
        end: 9,
      }),
      frameRate: 12,
      repeat: -1,
    });
    // explsion
    this.anims.create({
      key: "explosion",
      frames: this.anims.generateFrameNumbers("explosion"),
      start: 0,
      end: 7,
      frameRate: 20,
      repeat: 0,
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
        end: 17,
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
    // soldado_caminando 1
    this.anims.create({
      key: "soldado_caminando",
      frames: this.anims.generateFrameNumbers("soldado_caminando", {
        start: 0,
        end: 7,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "soldado_caminando_reverso",
      frames: this.anims.generateFrameNumbers("soldado_caminando_reverso", {
        start: 7,
        end: 0,
      }),
      frameRate: 12,
      repeat: -1,
    });
    // soldado_disparar 1
    this.anims.create({
      key: "soldado_disparar",
      frames: this.anims.generateFrameNumbers("soldado_disparar", {
        start: 0,
        end: 14,
      }),
      frameRate: 12,
      repeat: -1,
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
   // helicopter1
   this.helicopter1 = this.physics.add.sprite(100 , 100, "helicopter1");
   this.helicopter1.setScale(1, 1);
   this.helicopter1.setSize(
     this.helicopter1.width / 2,
     this.helicopter1.height / 2
   );
   this.helicopter1.body.setImmovable(true);
   this.helicopter1.play("helicopter1");
   this.helicopter1.body.setAllowGravity(false);
   this.helicopter1.body.setImmovable(true);
   // Puedes ajustar la posición inicial del helicóptero según tus necesidades
   this.helicopter1.setPosition(200, 1);

   // Añade la animación de vuelo para el helicóptero
   this.tweens.add({
     targets: this.helicopter1,
     x: 300, // Posición horizontal a la que quieres que vuele el helicóptero
     y: 200, // Altura a la que quieres que vuele el helicóptero
     duration: 5000, // Duración del vuelo en milisegundos
     ease: 'Power2',
     yoyo: true, // Hace que el helicóptero vuelva a la posición original después del vuelo
     repeat: -1, // -1 para que la animación se repita infinitamente
   });
   this.tweens.add({
     targets: this.helicopter1,
     x: game.config.width, // Posición horizontal a la que quieres que vuele el helicóptero
    duration: 5000, // Duración del vuelo en milisegundos
    ease: 'Linear',
    yoyo: true, // Hace que el helicóptero vuelva a la posición original：
    repeat: -1, // -1 para que la animación se repita infinitamente
   })

    this.time.addEvent({
      delay: 2000,
      callback: this.fireBulletFromHelicopter,
      callbackScope: this,
      loop: true,
    });
    this.time.addEvent({
      delay: 2000, // Ajusta el intervalo de tiempo
      callback: this.spawnSoldier ,
      callbackScope: this, 
      loop: true,
    });
    this.time.addEvent({
      delay: 2000, // Ajusta el intervalo de tiempo
      callback: this.spawnSoldierRev,
      callbackScope: this, 
      loop: true,
    });
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  }
  update(time, delta) {
  
       // Verifica si la tecla X está presionada y el jugador no está en el aire
       if (Phaser.Input.Keyboard.JustDown(this.jumpKey) && !this.player.isJumping) {
        // Establece el estado de salto a verdadero
        this.player.isJumping = true;
        // Inicia la animación de salto
        this.player.play("player-jump", true);
  
        // Establece la velocidad de caída inicial (puedes ajustar este valor)
        this.fallSpeed = 500;
      }
      // Lógica de salto y caída
      if (this.player.isJumping) {
        // Aplica la velocidad de caída
        this.player.y -= this.fallSpeed * (delta / 1000);
        // Reduce la velocidad de caída con el tiempo
        this.fallSpeed -= 1000 * (delta / 1000);
  
        // Verifica si el jugador ha vuelto al suelo
        if (this.player.y >= 495) { // Ajusta la altura del suelo según tu configuración
          this.player.y = 495;
          this.player.isJumping = false;
          
          // Detén la animación de salto
          this.player.anims.stop("player-jump", true);
  
          // Reinicia la animación al estado estático después de aterrizar
          if (this.player.direction === "right") {
            this.player.setTexture("player", 0); // Ajusta el frame según tu configuración
          } else {
            this.player.setTexture("playerizq", 39); // Ajusta el frame según tu configuración
          }
        }
      }
    this.bullets.children.each(function (bullet) {
      if (bullet.active) {
        if (
          bullet.x > game.config.width * 3 ||
          bullet.x < 0 ||
          bullet.y < 0 ||
          bullet.y > game.config.height
        ) {
          bullet.setActive(false);
          bullet.setVisible(false);
        }
      }
    }, this);
    this.bulletsHelicopter.children.each(function (bullet) {
      if (bullet.active) {
        if (
          bullet.x > game.config.width * 3 ||
          bullet.x < 0 ||
          bullet.y < 0 ||
          bullet.y > game.config.height
        ) {
          bullet.setActive(false);
          bullet.setVisible(false);
        }
      }
    }, this);
    if (
      this.cursors.left.isDown &&
      this.player.x > 0 &&
      this.cursors.up.isDown
    ) {
      this.player.x -= 3;
      this.player.direction = "left";
      if (
        this.player &&
        this.player.anims &&
        (!this.player.anims.isPlaying ||
          this.player.anims.currentAnim.key !== "player-jump")
      ) {
        this.player.play("player-diag-contrario", true);
        this.isAimingDiagIzq = true;
      }
    } else if (this.cursors.left.isDown && this.player.x > 0) {
      this.player.x -= 3;
      this.player.direction = "left";
      if (
        this.player &&
        this.player.anims &&
        (!this.player.anims.isPlaying ||
          this.player.anims.currentAnim.key !== "player-jump")
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
        this.player &&
        this.player.anims &&
        (!this.player.anims.isPlaying ||
          this.player.anims.currentAnim.key !== "player-jump")
      ) {
        this.player.play("player-diag-der", true);
        this.isAimingDiagDer = true;
      }
    } else if (
      this.cursors.right.isDown &&
      this.player.x < game.config.width * 3
    ) {
      this.player.x += 3;
      this.player.direction = "right";
      if (
        this.player &&
        this.player.anims &&
        (!this.player.anims.isPlaying ||
          this.player.anims.currentAnim.key !== "player-jump")
      ) {
        this.player.play("player-right", true);
        this.isAimingDiagDer = false;
        this.isAimingDiagIzq = false;
      }
    } else {
      if (this.player.direction === "right") {
        if (
          this.player &&
          this.player.anims &&
          (!this.player.anims.isPlaying  ||
            this.player.anims.currentAnim.key !== "player-jump")
        ) {
          this.player.play("player-static");
        }
      } else if (this.player.direction === "left") {
        if (
          this.player &&
          this.player.anims &&
          (!this.player.anims.isPlaying ||
            this.player.anims.currentAnim.key !== "player-jump")
        ) {
          this.player.play("player-static-izq");
          this.isAimingDiagIzq = false;
          this.isAimingDiagDer = false;
        }
      }
      if (this.cursors.up.isDown) {
        this.isAimingUp = true;
        this.player.play("player-up", true);
      } else {
        this.isAimingUp = false;
      }
    }
    // scroll the texture of the tilesprites proportionally to the camera scroll
    this.bg_1.tilePositionX = this.myCam.scrollX * 0.3;
    this.bg_2.tilePositionX = this.myCam.scrollX * 0.6;
    this.ground.tilePositionX = this.myCam.scrollX;
    if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
      this.fireBullet();
    }
    this.physics.add.collider(
      this.bullets,
      this.helicopter1,
      this.bulletHitHelicopter,
      null,
      this
    );
    this.physics.add.overlap(
      this.bullets,
      this.soldiersRun,
      this.bulletHitSoldierRun,
      null,
      this
    )
    this.physics.add.overlap(
      this.bulletsHelicopter,
      this.player,
      this.bulletHelicopterHitPlayer,
      null,
      this
    )
    this.physics.add.overlap(
      this.bullets,
      this.soldiersRunRev,
      this.bulletHitSoldierRunRev,
      null,
      this
    );
    this.physics.add.overlap(
      this.soldiersRun,
      this.player,
      this.soldierHitPlayer,
      null,
      this
    )
    this.physics.add.overlap(
      this.soldiersRunRev,
      this.player,
      this.soldierRunHitPlayer,
      null,
      this
    )
  }
  spawnSoldier(){
    const x = this.cameras.main.worldView.x + this.cameras.main.worldView.width + 10;
    const y = 485
    let soldier = this.soldiersRun.get();
    
    if(soldier){
      soldier.spawn(x,y)
      soldier.anims.play("soldado_caminando", true)
    }
  }
  spawnSoldierRev(){
    const x = this.cameras.main.worldView.x - 10;
    const y = 485
    let soldier = this.soldiersRunRev.get();
    
    if(soldier){
      soldier.spawn(x,y)
      soldier.anims.play("soldado_caminando_reverso", true)
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
      // Cambiar la dirección de la bala basado en si el jugador está apuntando hacia arriba
      if (this.isAimingUp) {
        bullet.body.velocity.y = -800;
        bullet.body.velocity.x = 0; // Mover la bala hacia arriba
        bullet.setPosition(
          this.player.x + 20,
          this.player.y - this.player.height / 3
        );
      } else {
        bullet.body.velocity.y = 0;
        //  bullet.body.velocity.x = 0; // No mover la bala en la dirección Y
      }
      if (this.isAimingDiagDer) {
        bullet.body.velocity.y = -800;
        bullet.body.velocity.x = 800;
        bullet.setPosition(
          this.player.x + 50,
          this.player.y - this.player.height / 5
        );
      }
      if(this.isAimingDiagIzq){
        bullet.body.velocity.y = -800;
        bullet.body.velocity.x = -800;
        bullet.setPosition(
          this.player.x - 50,
          this.player.y - this.player.height / 5
        );
      }
    }
  }
  // Método para disparar una bala
  collectBullet(player, bullet) {
    bullet.disableBody(true, true);
  }
  bulletHitHelicopter(bullet, helicopter) {
    this.healthHelicopter = this.healthHelicopter - 1
    console.log(`Vida del helicoptero: ${this.healthHelicopter}`);
    if (this.healthHelicopter === 0) {
      this.helicopterAlive = false
       bullet.setActive(false);
    bullet.setVisible(false);
    bullet.destroy();
    const explosion = this.add.sprite(helicopter.x, helicopter.y, "explosion");
    explosion.setDepth(1);
    explosion.play("explosion");
    explosion.setScale(5); // Aumenta el tamaño de la explosión
    this.sound.play("explosion-sound", { volume: 1 });
    }
    this.isBlinking = true;
    this.blinkHelicopter();
     helicopter.destroy();
     helicopter.setActive(false);
     helicopter.setVisible(false);
    
  }
  bulletHitSoldierRun(bullet, soldier){
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.destroy();
    soldier.destroy();
    const explosion = this.add.sprite(soldier.x, soldier.y, "explosion");
    explosion.setDepth(1);
    explosion.play("explosion");
    explosion.setScale(1); // Aumenta el tamaño de la explosión
    this.sound.play("explosion-sound", { volume: 1 });
    this.killedSoldiers = this.killedSoldiers + 1;
    console.log(`Soldados eliminados: ${this.killedSoldiers}`);
  }
  bulletHitSoldierRunRev(bullet, soldier){
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.destroy();
    soldier.destroy();
    const explosion = this.add.sprite(soldier.x, soldier.y, "explosion");
    explosion.setDepth(1);
    explosion.play("explosion");
    explosion.setScale(1); // Aumenta el tamaño de la explosión
    this.sound.play("explosion-sound", { volume: 1 });
    this.killedSoldiers = this.killedSoldiers + 1;
    console.log(`Soldados eliminados: ${this.killedSoldiers}`);
  }
  bulletHelicopterHitPlayer(bullet, player){
    player.setActive(false);
    player.setVisible(false);
    player.destroy();
    console.log("me dio el helicoptero");
    this.life += 1;
    this.lifebar.setFrame(this.life);
    this.isBlinking = true;
    this.blinkShip();
  }
  soldierHitPlayer(soldier, player) {
    this.life += 1;
    this.lifebar.setFrame(this.life);
    soldier.setActive(false);
    soldier.setVisible(false);
    soldier.destroy();
    // player.destroy();
    this.isBlinking = true;
      this.blinkShip();
    
  }
  soldierRunHitPlayer(soldier, player) {
    this.life += 1;
    this.lifebar.setFrame(this.life);
    soldier.setActive(false);
    soldier.setVisible(false);
    soldier.destroy();
    // player.destroy();
    this.isBlinking = true;
      this.blinkShip();
    
  }
  // disparar una bala helicoptero1
  fireBulletFromHelicopter() {
    if (!this.helicopterAlive) {
      return;
    }
    let bullet = this.bulletsHelicopter.get();
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.setAllowGravity(false);
      bullet.setPosition(
        this.helicopter1.x + this.helicopter1.width / 5 - 140,
        this.helicopter1.y + 90
      );

      let angle = Phaser.Math.Angle.Between(
        this.helicopter1.x,
        this.helicopter1.y,
        this.player.x,
        this.player.y
      );

      let speed = 800; // la velocidad a la que quieres que se mueva la bala
      let vec = new Phaser.Math.Vector2();
      vec.setToPolar(angle, speed);

      bullet.body.velocity.x = vec.x;
      bullet.body.velocity.y = vec.y;
    }
  }
  blinkShip() {
    const blinkInterval = 100; // Intervalo de parpadeo en milisegundos
    const blinkTimes = 10; // Número de veces que parpadea la nave
    let blinkCount = 0;
    const blinkTimer = this.time.addEvent({
      delay: blinkInterval,
      callback: () => {
        this.player.setVisible(!this.player.visible);
        blinkCount++;
        if (blinkCount >= blinkTimes) {
          this.player.setVisible(true);
          this.isBlinking = false;
          blinkTimer.destroy();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }
  blinkHelicopter() {
    const blinkInterval = 100; // Intervalo de parpadeo en milisegundos
    const blinkTimes = 20; // Número de veces que parpadea la nave
    let blinkCount = 0;
    const blinkTimer = this.time.addEvent({
      delay: blinkInterval,
      callback: () => {
        this.helicopter1.setVisible(!this.helicopter1.visible);
        blinkCount++;
        if (blinkCount >= blinkTimes) {
          this.helicopter1.setVisible(true);
          this.isBlinking = false;
          blinkTimer.destroy();
        }
      },
      callbackScope: this,
      loop: true,
    })
  }
}
