import { createAnimations } from "./animations.js";
import { initAudio, playAudio } from "./audios.js";
import { checkControls } from "./controls.js";
import { initSpritesheet } from "./spritesheet.js";

const config = {
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

new Phaser.Game(config);

function preload() {

    // Imágenes

    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    );

    this.load.image(
        'cloud2',
        'assets/scenery/overworld/cloud2.png'
    );

    this.load.image(
        'bush1',
        'assets/scenery/overworld/bush1.png'
    )
    
    this.load.image(
        'bush2',
        'assets/scenery/overworld/bush2.png'
    )

    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    );

    this.load.image(
        'flagmast',
        'assets/scenery/flag-mast.png'
    );

    this.load.image(
        'finalflag',
        'assets/scenery/final-flag.png'
    )

    // Spritesheets

    initSpritesheet(this);

    // Audio

    initAudio(this);
}

function create() {

    createAnimations(this);

    const cloudPositions = [
        { x: 80, y: 50, key: 'cloud1' },
        { x: 350, y: 80, key: 'cloud2' }
    ];
    
    // Valores comunes para todas las nubes
    const cloudScale = 0.15;
    const cloudOrigin = { x: 0, y: 0 };
    
    // Añadir las nubes en las posiciones especificadas
    cloudPositions.forEach(cloud => {
        this.add.image(cloud.x, cloud.y, cloud.key)
            .setOrigin(cloudOrigin.x, cloudOrigin.y)
            .setScale(cloudScale);
    });

    const bushPositions = [
        { x: 180, y: 202, key: 'bush1' },
        { x: 600, y: 202, key: 'bush2' }
    ];

    const bushScale = 0.3;
    const bushOrigin = { x: 0, y: 0 };

    bushPositions.forEach(bush => {
        this.add.image(bush.x, bush.y, bush.key)
            .setOrigin(bushOrigin.x, bushOrigin.y)
            .setScale(bushScale);
    })

    const flagPosition = [
        { x: 920, y: 202, key: 'flagmast' }
    ];

    flagPosition.forEach(flag => {
        this.add.image(flag.x, flag.y, flag.key)
            .setOrigin(0, 0.94)
            .setScale(1);
    })

    const finalFlagPosition = [
        { x: 920, y: 199, key: 'finalflag' }
    ];

    finalFlagPosition.forEach(finalflag => {
        this.add.image(finalflag.x, finalflag.y, finalflag.key)
            .setOrigin(0.6, 9)
            .setScale(1)
    })

    this.floor = this.physics.add.staticGroup();

    const floorPositions = [0, 110, 200, 370, 550, 600, 640, 810, 880]

    floorPositions.forEach(pos => {
        this.floor.create(pos, config.height - 16, 'floorbricks')
    })

    this.mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)
        .setGravityY(500);
    
    this.goomba = this.physics.add.sprite(350, 100, 'goomba')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true);

    this.physics.world.setBounds(0, 0, 2000, config.height);

    this.myFloorMarioCollider = this.physics.add.collider(this.mario, this.floor);
    this.myFloorGoombaCollider = this.physics.add.collider(this.goomba, this.floor);

    this.cameras.main.setBounds(0, 0, 2000, config.height);
    this.cameras.main.startFollow(this.mario);

    this.coins = this.physics.add.staticGroup();
    this.coins.create(600, 150, 'coin').anims.play('coin-idle', true);
    this.physics.add.overlap(this.mario, this.coins, collectCoin, null, this)

    this.marioAndGoombaCollider = this.physics.add.collider(this.mario, this.goomba, marioTouchGoomba, null, this);
    this.marioAndFlagMastCollider = this.physics.add.collider(this.mario, this.flagmast, marioTouchFlagMast, null, this);

    this.tweens.add({
        targets: this.goomba,
        x: this.goomba.x + 50,
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: 'Linear'
    });

    this.keys = this.input.keyboard.createCursorKeys();
}

function collectCoin(mario, coin) {
    coin.destroy();
    playAudio('coin-pickup', this, { volume: 0.1 });

    const scoreText = this.add.text(
        coin.x,
        coin.y,
        200,
        {
            fontFamily: 'SuperMario',
            fontSize: config.width / 40
        }
    )

    this.tweens.add({
        targets: scoreText,
        duration: 500,
        y: scoreText.y - 20,
        onComplete: () => {
            this.tweens.add({
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

let marioIsTouchedByGoomba = false;
let goombaIsDying = false;

function marioTouchGoomba(mario, goomba) {
    
    if(!marioIsTouchedByGoomba && !goombaIsDying) {
        if(mario.y >  195)
        {
            marioIsTouchedByGoomba = true;
            mario.isDead = true;
            mario.anims.play('mario-dead');
            this.myFloorMarioCollider.destroy();
            mario.setCollideWorldBounds(false);
            this.sound.play('gameover');
    
            setTimeout(() => {
                this.mario.setVelocityY(-350);
            }, 100);
    
            setTimeout(() => {
                this.scene.restart();
                marioIsTouchedByGoomba = false;
            }, 7000);
        }
        else
        {
            goombaIsDying = true;
            this.marioAndGoombaCollider.destroy();
            goomba.anims.play('goomba-dead');
            goomba.setCollideWorldBounds(false);
            this.myFloorGoombaCollider.destroy();
            playAudio('goomba-stomp', this);

            setTimeout(() => {
                this.goomba.setVelocityY(-50);
            }, 100);
        }
    }      
}

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

function update() {
    checkControls(this);
    const { mario, sound, scene } = this;

    if (mario.isDead) return;
    if (mario.wins) return;

    //Check if Mario is dead
    if (mario.y >= config.height) {
        mario.isDead = true;
        mario.anims.play('mario-dead');
        mario.setCollideWorldBounds(false);
        playAudio('gameover', this, { volume: 0.2 })

        setTimeout(() => {
            mario.setVelocityY(-350);
        }, 100);

        setTimeout(() => {
            scene.restart();
        }, 7000);
    }
}
