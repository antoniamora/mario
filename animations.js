export const createAnimations = (game) => {
    game.anims.create({
        key: 'mario-walk',
        frames: game.anims.generateFrameNumbers(
            'mario',
            { start: 1, end: 3 }
        ),
        frameRate: 12,
        repeat: -1
    });

    game.anims.create({
        key: 'mario-idle',
        frames: [{ key: 'mario', frame: 0 }]
    });

    game.anims.create({
        key: 'mario-jump',
        frames: [{ key: 'mario', frame: 5 }]
    });

    game.anims.create({
        key: 'mario-dead',
        frames: [{ key: 'mario', frame: 4 }]
    });

    game.anims.create({
        key: 'goomba',
        frames: [{ key: 'goomba', frame: 1 }]
    });

    game.anims.create({
        key: 'goomba-dead',
        frames: [{ key: 'goomba', frame: 2 }]
    });

    game.anims.create({
        key: 'mario-wins',
        frames: [{ key: 'mario', frame: 5 }]
    })
}
