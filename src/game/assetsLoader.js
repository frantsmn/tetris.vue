export default class AssetsLoader {
    constructor() {
        this.onLoad = Function;
        this.progress = 0;
        this.__loadedItemsCounter = 0;

        this.sounds = [];
        this.blockImages = [];

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


        // BLOCK IMAGES FOR STATS
        const blocksPath = './assets/game/svg/blocks/';
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
                ...this.blocksPaths,
                ...blocksNames.map(name => `${blocksPath}${indexedPathModifier}${name}`)
            ]
        }
    }



    async loadAssets() {
        // Load
        this.sounds = await this.__loadSounds(this.soundsPaths);
        this.blockImages = await this.__loadImages(this.blocksPaths);

        // Structurize
        this.blockImages = this.__structurizeAray(this.blockImages, 7);

        return { sounds: this.sounds, blockImages: this.blockImages }
    }

    // Приведение массива к виду [[img1, img2, img3], [img1, img2, img3], ...] если параметр amount === 3
    __structurizeAray(array, amount) {
        return array.reduce((resArray, current, index) => {
            if (!resArray[Math.trunc(index / amount)]) resArray.push([]);
            resArray[Math.trunc(index / amount)].push(current);
            return resArray;
        }, []);
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
        const itemsAmout = this.soundsPaths.length + this.blocksPaths.length;
        this.progress = 1 / (itemsAmout / value);
        this.__loadedItemsCounter = value;
        //DEBUG
        // console.log('loading...', Math.round(this.progress * 100));
        this.onLoad((this.progress * 100).toFixed(0));
    }

    get loadedItemsCounter() {
        return this.__loadedItemsCounter;
    }

}