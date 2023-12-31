import Phaser from "phaser";
import { game } from "../../main.js";

export default class Climax3 extends Phaser.Scene {
    constructor() {
        super({ key: "climax3" });
    }
    preload() {
        this.load.image("capsuleFull", "assets/images/capsule-complete.png");
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.background = this.add.image(0, 0,'capsuleFull', );
        this.background.setOrigin(0, 0);

        this.scale.on('resize', this.resize, this);
        this.resize();  
        const text = this.add.text(100, 50, "", {
            fontSize: "24px",
            fill: "#ffffff",
            wordWrap: { width: 600 },
          });
          const message1 = "“Derke apenas logra enviar un mensaje para pedir ayuda antes de escapar en una capsula, pero su destino fue el planeta Citrino en el que tendría que esperar que el resto de su equipo llegara …mientras tanto seria atacado y acorralado por el imperio. Presiona cualquier tecla para continuar";
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
              this.scene.start("dos");
            });
          }
        },
        repeat: message1.length - 1,
      });
    }
    resize() {
        const { width, height } = this.scale;
        this.background.setScale(width / this.background.width, height / this.background.height);
    }
}