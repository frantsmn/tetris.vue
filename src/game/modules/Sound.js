export default class Sound {
    constructor(EMITTER, $store) {

        this.resources = ['land', 'move', 'rotate', 'clearline', 'tetris', 'gameover', 'levelup', 'pause', 'option'];

        for (let i = 0; i < $store.state.loader.assets.sounds.length; i++) {
            this[this.resources[i]] = $store.state.loader.assets.sounds[i];
        }

        this.play = (name) => {
            if (localStorage['SOUND'] === 'true') {
                this[name].currentTime = 0;
                this[name].play();
            }
        }

        EMITTER.subscribe('control:pausePressed', () => {
            this.play('pause');
        });

        EMITTER.subscribe('control:pauseReleased', () => {
            this.play('pause');
        });

        EMITTER.subscribe('stats:newLevel', () => {
            this.play('levelup');
            window.navigator.vibrate([0, 200, 100, 100, 100]);
        });

        EMITTER.subscribe('stats:tetris', () => {
            this.play('tetris');
            window.navigator.vibrate([0, 100, 500]);
        });

        EMITTER.subscribe('stats:clearline', () => {
            this.play('clearline');
            window.navigator.vibrate([0, 200, 30, 30, 30, 30, 30, 30, 30]);
        });

        EMITTER.subscribe('block:blockFixed', () => {
            this.play('land');
            window.navigator.vibrate([0, 30]);
        });

        EMITTER.subscribe('block:gameOver', () => {
            this.play('gameover');
        });

        EMITTER.subscribe('block:rotateLeft', () => {
            this.play('rotate');
        });

        EMITTER.subscribe('block:rotateRight', () => {
            this.play('rotate');
        });

        EMITTER.subscribe('block:moveLeft', () => {
            this.play('move');
        });

        EMITTER.subscribe('block:moveRight', () => {
            this.play('move');
        });
    }
}