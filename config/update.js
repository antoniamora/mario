import { checkControls } from "../controls/controls.js";
import { config } from "./config.js";
import { states } from "../controls/states.js";
import { playAudio } from "../controls/audios.js";

export function update() {
    checkControls(this);
    const { mario, sound, scene } = this;

    if (mario.isDead) return;
    if (mario.wins) return;

    //Check if Mario is dead
    if (mario.y >= config.height || states.marioIsTouchedByGoomba) {
        mario.isDead = true;
        mario.anims.play('mario-dead');
        this.myFloorMarioCollider.destroy();
        mario.setCollideWorldBounds(false);
        playAudio('gameover', this, { volume: 0.1 })

        setTimeout(() => {
            mario.setVelocityY(-350);
        }, 100);

        setTimeout(() => {
            states.marioIsTouchedByGoomba = false;
            scene.restart();
        }, 7000);
    }
}