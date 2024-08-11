import { initSpritesheet } from "../controls/spritesheet.js";
import { initAudio } from "../controls/audios.js";

export function preload() {

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
        'supermushroom',
        'assets/collectibles/super-mushroom.png'
    )

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