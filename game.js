import { createAnimations } from "./animations.js";

const config = {
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

    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    );

    this.load.image(
        'bush1',
        'assets/scenery/overworld/bush1.png'
    )

    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    );

    this.load.spritesheet(
        'mario',
        'assets/entities/mario.png',
        { frameWidth: 18, frameHeight: 16 }
    );

    this.load.spritesheet(
        'goomba',
        'assets/entities/overworld/goomba.png',
        { frameWidth: 16, frameHeight: 16 }
    )

    this.load.audio('gameover', 'assets/sound/music/gameover.mp3');

    this.load.audio('goomba-stomp', 'assets/sound/effects/goomba-stomp.wav')
}

function create() {

    this.add.image(100, 50, 'cloud1').setOrigin(0, 0).setScale(0.15);
    this.add.image(200, 207, 'bush1').setOrigin(0, 0).setScale(0.15);

    this.floor = this.physics.add.staticGroup();

    const floorPositions = [0, 110, 200, 370, 550]

    floorPositions.forEach(pos => {
        this.floor.create(pos, config.height - 16, 'floorbricks')
    })

    this.mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)
        .setGravityY(500);
    
    this.goomba = this.physics.add.sprite(350, 100, 'goomba')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)

    this.physics.world.setBounds(0, 0, 2000, config.height);

    this.myFloorMarioCollider = this.physics.add.collider(this.mario, this.floor);
    this.myFloorGoombaCollider = this.physics.add.collider(this.goomba, this.floor);

    this.cameras.main.setBounds(0, 0, 2000, config.height);
    this.cameras.main.startFollow(this.mario);

    createAnimations(this);

    this.marioAndGoombaCollider = this.physics.add.collider(this.mario, this.goomba, marioTouchGoomba, null, this);

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
            this.sound.play('goomba-stomp');
            setTimeout(() => {
                this.goomba.setVelocityY(-50);
            }, 100);
        }
    }  
            
        
}

function update() {
    if (this.mario.isDead) return;

    if (this.keys.left.isDown) {
        this.mario.setVelocityX(-160);
        this.mario.anims.play('mario-walk', true);
        this.mario.flipX = true;
    } else if (this.keys.right.isDown) {
        this.mario.setVelocityX(160);
        this.mario.anims.play('mario-walk', true);
        this.mario.flipX = false;
    } else {
        this.mario.setVelocityX(0);
        this.mario.anims.play('mario-idle', true);
    }

    if (this.keys.up.isDown && this.mario.body.touching.down) {
        this.mario.setVelocityY(-330);
        this.mario.anims.play('mario-jump', true);
    }

    if (this.mario.y >= config.height) {
        this.mario.isDead = true;
        this.mario.anims.play('mario-dead');
        this.mario.setCollideWorldBounds(false);
        this.sound.play('gameover');

        setTimeout(() => {
            this.mario.setVelocityY(-350);
        }, 100);

        setTimeout(() => {
            this.scene.restart();
        }, 7000);
    }
}