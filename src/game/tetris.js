import EventEmitter from './modules/Emitter'

import Textures from './modules/Textures'
import Sound from './modules/Sound'

import Matrix from './modules/Matrix'
import Canvas from './modules/Canvas'
import Block from './modules/Block'
import Controls from './modules/controls/Controls'
import Stats from './modules/Stats'
import Ticker from './modules/Ticker'

import Settings from './modules/Settings'

//=======================================================
// const matrixState = '[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3}]]';

export default class Tetris {
    constructor({ playerIndex, canvasElement, $store }) {
        const LEVEL_DELAYS = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67, 50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17];

        this.playerIndex = playerIndex;
        const EMITTER = new EventEmitter();

        const textures = new Textures(EMITTER);
        new Sound(EMITTER);

        const matrix = new Matrix();
        const canvas = new Canvas(EMITTER, canvasElement, textures);
        const block = new Block(EMITTER, matrix, canvas);
        const controls = new Controls(EMITTER, block);
        const stats = new Stats(EMITTER);
        const ticker = new Ticker();

        new Settings();


        EMITTER.subscribe('stats:newLevel', (level) => {
            ticker.start(LEVEL_DELAYS[level]);
            $store.commit('game/setLevel', level)                                   //? [VUEX] Обновить уровень (определяет цвет блоков)
        });
        EMITTER.subscribe('stats:refresh', ({ score, lines }) => {
            $store.commit('game/stats/setScore', score)                             //? [VUEX] Обновить уровень (определяет цвет блоков)
            $store.commit('game/stats/setLines', lines)                             //? [VUEX] Обновить уровень (определяет цвет блоков)
        });
        EMITTER.subscribe('stats:tetris', () => {
            $store.commit('game/tetrisAnimation');                                  //? [VUEX] Анимация тетриса
        });
        EMITTER.subscribe('block:blockAppeared', () => {
            console.log('blockAppeared');
            $store.commit('game/stats/countBlock', block.currentBlock.name);        //? [VUEX] Подсчет появившихся блоков
            $store.commit('game/stats/setNextBlock', block.nextBlock.name);         //? [VUEX] Установить след. блок
        });
        EMITTER.subscribe('block:gameOver', () => {
            ticker.stop();
            $store.commit('game/setGameoverState', true);                           //? [VUEX] Установить Gameover
        });
        EMITTER.subscribe('block:blockFixed', () => ticker.sleep(60));
        EMITTER.subscribe('canvas:wipeAnimationStart', () => ticker.sleep(360));
        EMITTER.subscribe('control:pausePressed', () => {
            ticker.stop();
            $store.commit('game/setPauseState', true);                              //? [VUEX] Установить паузу
        });
        EMITTER.subscribe('control:pauseReleased', () => {
            ticker.start();
            $store.commit('game/setPauseState', false);                             //? [VUEX] Снять паузу
        });

        controls.gamepad.listener.on('gamepad:connected', function (event) {
            /**
             * event:
             *   detail: {
             *       index: 0, // Gamepad index [0-3]
             *       gamepad, // Native Gamepad object
             *   }
             */
            console.log(`connected >>`, event.detail.gamepad);
            $store.commit('gamepads/addGamepad', event.detail.gamepad)              //? [VUEX] Добавить геймпад
        });

        controls.gamepad.listener.on('gamepad:disconnected', function (event) {
            /**
             * event:
             *   detail: {
             *       index: 0,
             *       // Native Gamepad object is no longer available
             *   }
             */
            console.log(`disconnected >>`, event);
            $store.commit('gamepads/removeGamepad', event.detail.index)             //? [VUEX] Удалить геймпад
        });

        $store.subscribe((mutation) => {
            if (mutation.type === "gamepads/updateGamepadIndex") {                  //? [VUEX] Обновить id геймпада
                if (mutation.payload.playerIndex === this.playerIndex) {
                    controls.gamepad.gamepadIndex = mutation.payload.gamepadIndex;
                }
            }
        });


        this.startGame = ({ level }) => {
            // Определить цвет текстур
            textures.level = level; //! ТОРМОЗИТ

            setTimeout(() => {
                matrix.clearMatrix();
                canvas.drawState(matrix.getFixedMatrix());
                stats.init();
                block.setNewQueue();
                block.currentBlock.drawBlock();
                ticker.onTick = () => block.currentBlock.moveDown();
                ticker.start(LEVEL_DELAYS[level]);
                ticker.sleep(1000).then(() => controls.isAvailable = true)
            }, 100);
        }

        this.saveGame = () => {
            localStorage.setItem('state', JSON.stringify({
                matrix: matrix.getFixedMatrix(),
                stats: {
                    score: stats.score,
                    lines: stats.lines,
                    level: stats.level,
                    blockStatistics: stats.blockStatistics,
                },
                block: {
                    queue: block.queue,
                    activeBlockId: block.activeBlockId,
                }
            }));
        }

        this.loadGame = () => {
            const state = JSON.parse(localStorage.getItem('state'));

            //Сбросить статистику и присвоить значения из state
            stats.init();
            stats.score = state.stats.score;
            stats.lines = state.stats.lines;
            stats.level = state.stats.level;
            stats.blockStatistics = state.stats.blockStatistics;
            stats.refreshBlockImages();
            stats.refresh();

            //Определяем цвет у текстур
            textures.level = state.stats.level;

            //Восстановить и отрисовать матрицу
            matrix.setMatrix(state.matrix);
            canvas.drawState(matrix.getFixedMatrix());

            //Восстановление последовательности блоков
            if (state.block.activeBlockId - 1 > 0) {
                block.loadQueue(state.block.queue, --state.block.activeBlockId);
            } else {
                block.loadQueue(state.block.queue, state.block.activeBlockId);
            }
            block.activeBlock.drawBlock();

            //Сделать активными контролы
            controls.isAvailable = true;

            // Оживляем по тикеру
            ticker.onTick = () => block.activeBlock.moveDown();
            ticker.start(LEVEL_DELAYS[state.stats.level]);
            ticker.sleep(800);
        }

    }
}