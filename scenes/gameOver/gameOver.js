import Phaser from "phaser";
import { game } from "../../main.js";
export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: "gameOver" });
    }
    create() {
            // Fondo
            this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);

            // Texto de Game Over
            this.add.text(400, 200, "Game Over", {
                fontSize: "40px",
                fill: "#ffffff",
            }).setOrigin(0.5);
    
            // Texto de Continuar
            const continueText = this.add.text(400, 300, "Continuar", {
                fontSize: "30px",
                fill: "#ffffff",
            }).setOrigin(0.5);

            continueText.setInteractive();
            continueText.on("pointerdown", () => {
            });
    
            // Texto de Menú Principal
            const mainMenuText = this.add.text(400, 350, "Menú Principal", {
                fontSize: "30px",
                fill: "#ffffff",
            }).setOrigin(0.5);
    
            // Configuración de interactividad para el texto de Continuar
            continueText.setInteractive();
            continueText.on("pointerdown", () => {
                // Aquí puedes agregar lógica para continuar el juego
                console.log("Continuar el juego");
                // Cambiar a la escena 2 (asegúrate de que "Scene2" esté registrada en tu juego)
                this.scene.stop();
                this.scene.get("dos").restart();
            });
    
            // Configuración de interactividad para el texto de Menú Principal
            mainMenuText.setInteractive();
            mainMenuText.on("pointerdown", () => {
                // Aquí puedes agregar lógica para ir al menú principal
                this.scene.start("main-menu");
            });
        }
    }


