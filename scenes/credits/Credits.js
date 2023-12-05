import Phaser from "phaser";
import { game } from "../../main.js";
export default class Credits extends Phaser.Scene {
    constructor() {
        super({ key: "credits" });
    }
    preload() {
        this.load.image("logo", "assets/images/title.png");
        this.load.audio("finalsong", "assets/audio/creditos.mp3");
    }
    create() {
        const sceneWidth = this.sys.game.config.width;
        const sceneHeight = this.sys.game.config.height;
        const centerX = sceneWidth / 2;
        const centerY = sceneHeight / 2;


           // Creamos la lista de creadores y sus títulos
        let creadores = [
            { nombre: 'Development Staff', titulo: 'PROJECT TURNS' },
            { nombre: 'Armando Conrado', titulo: 'Equipo de Desarrollo' },
            { nombre: 'Danny Caamal', titulo: 'Equipo de Desarrollo' },
            { nombre: 'Ariel Nabte', titulo: 'Administrador de proyecto' },
            { nombre: 'Noe Can', titulo: 'Diseñador' },
            { nombre: 'Adan Moo', titulo: 'QA' },
            { nombre: 'Manuel Can', titulo: 'Tester' },
            { nombre: ' ', titulo: 'Gracias por jugar!!' },
        ];

        let yOffset = 0;
        // Reproduce el audio al inicio de la escena
    const audio = this.sound.add('finalsong', {volume:1});
    audio.play();

        creadores.forEach((creador, index) => {
            // Crear el texto con el título del creador
            let textoTitulo = this.add.text(centerX, sceneHeight + yOffset, creador.titulo, {
                fontSize: "32px",
                fill: "#F8B445",
            });
            textoTitulo.setOrigin(0.5, 0.5);

            // Crear el texto con el nombre del creador
            let textoCreador = this.add.text(centerX, sceneHeight + yOffset + 40, creador.nombre, {
                fontSize: "32px",
                fill: "#ffffff",
            });
            textoCreador.setOrigin(0.5, 0.5);

            // Agregar el efecto de desplazamiento a ambos textos
            this.tweens.add({
                targets: [textoTitulo],
                y: -200,
                duration: 10000 + index * 3000,
                ease: 'Linear'
            });
            this.tweens.add({
                targets: [textoCreador],
                y: -180,
                duration: 10000 + index * 3000,
                ease: 'Linear'
            });

            yOffset += 100;
            
        });
        // Agregar una imagen
        const image = this.add.image(centerX, sceneHeight + yOffset, 'logo');
        image.setOrigin(0.5, 0.5);

         // Configurar la animación de desplazamiento de la imagen
         const tween = this.tweens.add({
            targets: [image],
            y: -100,
            duration: 10000 + creadores.length * 3000,
            ease: 'Linear',
            // Función onUpdate que se llama en cada fotograma durante la animación
            onUpdate: () => {
                // Verificar si la imagen ha llegado a la mitad de la pantalla
                if (image.y <= sceneHeight / 2) {
                    // Calcular el valor de volumen gradualmente basado en la posición de la imagen
                    const volume = Phaser.Math.Linear(1, 0, (sceneHeight / 1 - image.y) / (sceneHeight / 1));

                    // Establecer el volumen del audio
                    audio.setVolume(volume);
                    // Detener la animación
                    tween.stop();
                
                }
            }
        });

        // Agregar un temporizador para regresar al menú después de que se hayan mostrado todos los créditos
        this.time.delayedCall(10000 + creadores.length * 3000, () => {
            // Detén el audio al regresar al menú
            audio.stop();
            this.scene.start('main-menu');
        });
    }
}
