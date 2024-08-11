import { preload } from "./preload.js";
import { create } from "./create.js";
import { update } from "./update.js";

export const config = {
    autoFocus: false,
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload, // se ejecuta para precargar recursos
        create, // se ejecuta cuando el juego comienza
        update // se ejecuta en cada frame
    }
}