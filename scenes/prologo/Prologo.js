import Phaser from "phaser";

export default class Init extends Phaser.Scene {
    constructor() {
      super("init");
    }
    preload() {
      this.load.image("background2", "assets/images/station2.png");
      this.load.image("comenzar", "assets/images/start.png");
      this.load.audio("historia", "assets/audio/historia.mp3");
    }
    create() {
      // Reproduce la música
      const music = this.sound.add("historia", { loop: true });
      music.play();
      const sceneWidth = this.sys.game.config.width;
      const sceneHeight = this.sys.game.config.height;
        // const bgWidth = bg.width;
        // const bgHeight = bg.height;
      const bg = this.add.image(400, 400, "background2");
      const centerX = sceneWidth / 2;
      const centerY = sceneHeight / 2;
      bg.setPosition(centerX, centerY);
      const text = this.add.text(100, 50, "", {
        fontSize: "24px",
        fill: "#ffffff",
        wordWrap: { width: 600 },
      });
  
      const message1 =
        "En el año 2160, Artyom Sirmitev, apodado Derke, lidera una rebelión contra el opresivo Imperio de Britania, que controla la mayor parte de la humanidad. Su lucha se centra en detener la explotación desenfrenada de un recurso no renovable llamado Sakuradita, extraído de la corteza terrestre, que causa daño ambiental.";
      const message2 =
        "Derke se encontraba camino a reunirse con sus aliados de la rebelión en el planeta Arrakis para obtener armas y recursos que necesitaría para un golpe de estado, sin embargo, no contaba con que su nave había sido rastreada por la flota imperial de britania y sería interceptado… comienza la batalla!!";
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
      this.sound.stopAll();
      this.scene.start('game');
    });
    }
    
  
    upload() {}
  }