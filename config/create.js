import { config } from "./config.js";
import { createAnimations } from "../controls/animations.js";
import { collectItems, marioTouchGoomba } from "../events/events.js";

export function create() {

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
/*
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
*/
    this.floor = this.physics.add.staticGroup();
    console.log(this)

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

    this.collectibles = this.physics.add.staticGroup();
    const coin1 = this.collectibles.create(600, 150, 'coin').anims.play('coin-idle', true);
    const coin2 = this.collectibles.create(800, 150, 'coin').anims.play('coin-idle', true);
    const supermushroom1 = this.collectibles.create(650, config.height - 40, 'supermushroom');

    coin1.className = 'coin';
    coin2.className = 'coin';
    supermushroom1.className = 'supermushroom';

    this.physics.add.overlap(this.mario, this.collectibles, collectItems, null, this);


    this.marioAndGoombaCollider = this.physics.add.collider(this.mario, this.goomba, marioTouchGoomba, null, this);
    //this.marioAndFlagMastCollider = this.physics.add.collider(this.mario, this.flagmast, marioTouchFlagMast, null, this);

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