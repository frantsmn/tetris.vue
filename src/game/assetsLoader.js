export default class AssetsLoader {
    constructor() {
        this.onLoad = Function;
        this.progress = 0;
        this.__loadedItemsCounter = 0;

        this.sounds = [];

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
    }

    async loadAssets() {
        this.sounds = await this.__loadSounds(this.soundsPaths);
        return { sounds: this.sounds }
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

    set loadedItemsCounter(value) {
        const itemsAmout = this.soundsPaths.length;
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