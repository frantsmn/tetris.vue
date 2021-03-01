export default class AssetsLoader {
    constructor() {
        this.progress = 0;
        this.__loadedItemsCounter = 0;

        // SOUNDS
        const soundsPath = './assets/game/sound/';
        const soundsNames = [
            'land.mp3',
            'move.mp3',
            'rotate.mp3',
            'clearline.mp3',
            'tetris.mp3',
            'gameover.mp3',
            'levelup.mp3',
            'pause.mp3',
            'option.mp3'
        ];
        this.soundsPaths = soundsNames.map(name => `${soundsPath}${name}`)


        // TEXTURES FOR CANVAS
        const texturesPath = './assets/game/svg/textures/';
        const texturesPathModifier = 'level_';
        const texturesPathModifierAmount = 10;
        const texturesNames = [
            'type_1.svg',
            'type_2.svg',
            'type_3.svg'
        ];
        this.texturesPaths = [];
        for (let index = 0; index < texturesPathModifierAmount; index++) {
            const indexedPathModifier = `${texturesPathModifier}${index}/`;
            this.texturesPaths = [
                ...this.texturesPaths,
                ...texturesNames.map(name => `${texturesPath}${indexedPathModifier}${name}`)
            ]
        }


        // BLOCK IMAGES FOR STATS
        const blocksPath = './assets/game/svg/textures/';
        const blocksPathModifier = 'level_';
        const blocksPathModifierAmount = 10;
        const blocksNames = [
            'i-block.svg',
            'j-block.svg',
            'l-block.svg',
            'o-block.svg',
            's-block.svg',
            't-block.svg',
            'z-block.svg',
        ];
        this.blocksPaths = [];
        for (let index = 0; index < blocksPathModifierAmount; index++) {
            const indexedPathModifier = `${blocksPathModifier}${index}/`;
            this.blocksPaths = [
                ...this.texturesPaths,
                ...blocksNames.map(name => `${blocksPath}${indexedPathModifier}${name}`)
            ]
        }

    }

    loadAssets() {
        return Promise.all([
            this.__loadSounds(this.soundsPaths),
            this.__loadImages(this.texturesPaths),
            this.__loadImages(this.blocksPaths)
        ]);
    }

    __loadSounds(paths) {
        return new Promise((resolve) => {
            let counter = 0;
            const sounds = [];

            const onLoad = () => {
                counter++;
                this.loadedItemsCounter++;
                if (counter === paths.length) {
                    resolve(sounds);
                }
            }

            for (let i = 0; i < paths.length; i++) {
                const audio = new Audio();
                audio.src = paths[i];
                audio.addEventListener('canplaythrough', () => onLoad(), { once: true });
                // audio.onload = audio.onerror = () => onLoad();
                sounds.push(audio);
            }

        });
    }

    __loadImages(paths) {
        return new Promise((resolve) => {

            let counter = 0;
            const images = [];

            const onLoad = () => {
                counter++;
                this.loadedItemsCounter++;
                if (counter === paths.length) {
                    resolve(images);
                }
            }

            for (let i = 0; i < paths.length; i++) {
                let img = document.createElement('img');
                img.onload = img.onerror = onLoad;
                img.src = paths[i];
                images.push(img);
            }
        });

    }

    set loadedItemsCounter(value) {
        const itemsAmout = this.soundsPaths.length + this.texturesPaths.length + this.blocksPaths.length;
        this.progress = 1 / (itemsAmout / value);
        this.__loadedItemsCounter = value;
        //DEBUG
        console.log('loading...', Math.round(this.progress * 100));
    }

    get loadedItemsCounter() {
        return this.__loadedItemsCounter;
    }

}