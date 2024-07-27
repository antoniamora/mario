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
        { frameWidth: 18, frameHeight: 16 }
    )

    this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
}

function create() {
    this.add.image(100, 50, 'cloud1').setOrigin(0, 0).setScale(0.15);

    this.floor = this.physics.add.staticGroup();

    this.floor.create(0, config.height - 16, 'floorbricks').setOrigin(0, 0.5).refreshBody();
    this.floor.create(110, config.height - 16, 'floorbricks').setOrigin(0, 0.5).refreshBody();

    this.floor.create(290, config.height - 16, 'floorbricks').setOrigin(0, 0.5).refreshBody();

    this.mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)
        .setGravityY(500);
    
    this.goomba = this.physics.add.sprite(350, 100, 'goomba')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)

    this.physics.world.setBounds(0, 0, 2000, config.height);

    this.physics.add.collider(this.mario, this.floor);
    this.physics.add.collider(this.goomba, this.floor);

    this.cameras.main.setBounds(0, 0, 2000, config.height);
    this.cameras.main.startFollow(this.mario);

    createAnimations(this);

    this.physics.add.collider(this.mario, this.goomba, marioTouchGoomba, null, this);

    this.tweens.add({
        targets: this.goomba,
        x: this.goomba.x + 40,
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: 'Linear'
    });

    this.keys = this.input.keyboard.createCursorKeys();
}

function marioTouchGoomba(mario, goomba) {
    mario.isDead = true;
    mario.anims.play('mario-dead');
    mario.setCollideWorldBounds(false);
    this.sound.play('gameover');

    setTimeout(() => {
        mario.setVelocityY(-350);
    }, 100);

    setTimeout(() => {
        this.scene.restart();
    }, 2000);
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
        }, 2000);
    }
}