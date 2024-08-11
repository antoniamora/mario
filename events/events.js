import { playAudio } from "../controls/audios.js";
import { states } from "../controls/states.js";
import { config } from "../config/config.js";

export function marioTouchGoomba(mario, goomba) {
    
    if(!states.marioIsTouchedByGoomba && !states.goombaIsDying) {
        if(mario.y > 195)
        {
            states.marioIsTouchedByGoomba = true;
        }
        else
        {
            states.goombaIsDying = true;
            this.marioAndGoombaCollider.destroy();
            goomba.anims.play('goomba-dead');
            goomba.setCollideWorldBounds(false);
            this.myFloorGoombaCollider.destroy();
            addToScore(200, goomba, this);
            playAudio('goomba-stomp', this, { volume: 0.5 });

            setTimeout(() => {
                this.goomba.setVelocityY(-50);
            }, 100);
        }
    }      
}

export function collectItems(mario, collectible) {
    collectible.destroy();
    
    if(collectible.className === 'coin') {
        playAudio('coin-pickup', this, { volume: 0.08 });
        addToScore(100, collectible, this);
    } else if(collectible.className === 'supermushroom') {
        playAudio('consume-powerup', this, { volume: 0.1 });
    }
    
}

export function addToScore (scoreToAdd, origin, game) {
    const scoreText = game.add.text(
        origin.x,
        origin.y,
        scoreToAdd,
        {
            fontFamily: 'SuperMario',
            fontSize: config.width / 40
        }
    )

    game.tweens.add({
        targets: scoreText,
        duration: 600,
        y: scoreText.y - 40,
        onComplete: () => {
            game.tweens.add({
                targets: scoreText,
                duration: 100,
                alpha: 0,
                onComplete: () => {
                    scoreText.destroy()
                }
            })
        }
    })
}

/*
let marioIsTouchedByFlagMast = false;

function marioTouchFlagMast(mario) {
    if (!marioIsTouchedByFlagMast) {
        marioIsTouchedByFlagMast = true;
        this.marioAndFlagMastCollider.destroy();
        mario.anims.play('mario-wins');
        mario.wins = true;
        this.sound.play('win');

        // Animar finalflag para que baje hasta la altura de Mario
        this.tweens.add({
            targets: this.finalflag,
            y: mario.y, // Bajar hasta la altura de Mario
            duration: 2000,
            ease: 'Linear'
        });
    }
}
*/
