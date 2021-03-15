import EventEmitter from './modules/Emitter'

import Matrix from './modules/Matrix'
import Canvas from './modules/Canvas'
import Block from './modules/Block'
import Controls from './modules/controls/Controls'
import Stats from './modules/Stats'
import Ticker from './modules/Ticker'

import Settings from './modules/Settings'
import Sound from './modules/Sound'

//=======================================================
// const matrixState = '[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3}]]';

export default class Tetris {
    constructor({ playerIndex, canvasElement, $store }) {
        this.playerIndex = playerIndex;
        this.LEVEL_DELAYS = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67, 50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17];
        this.EMITTER = new EventEmitter();

        this.matrix = new Matrix();
        this.canvas = new Canvas(this.EMITTER, canvasElement);
        this.block = new Block(this.EMITTER, this.matrix, this.canvas);
        this.controls = new Controls(this.EMITTER, this.block, playerIndex, $store);
        this.stats = new Stats(this.EMITTER);
        this.ticker = new Ticker();
        this.ticker._startTime = Math.floor(performance.now());

        new Sound(this.EMITTER, $store);
        new Settings();

        this.EMITTER.subscribe('stats:newLevel', (level) => {
            this.ticker.start(this.LEVEL_DELAYS[level]);
            $store.commit('game/setLevel', { playerIndex, level })                                   //? [VUEX] Обновить уровень (определяет цвет блоков)
        });
        this.EMITTER.subscribe('stats:refresh', ({ level, score, lines }) => {
            $store.dispatch('game/refreshStats', {
                playerIndex,
                level,
                score,
                lines
            })  //? [VUEX] Обновить уровень (определяет цвет блоков)
        });
        this.EMITTER.subscribe('stats:tetris', () => {
            $store.commit('game/tetrisAnimation', { playerIndex });                                  //? [VUEX] Анимация тетриса
        });
        this.EMITTER.subscribe('block:blockAppeared', () => {
            $store.dispatch('game/refreshBlocksInfo', {
                playerIndex,
                currentBlockName: this.block.currentBlock.name,
                nextBlockName: this.block.nextBlock.name
            });
        });
        this.EMITTER.subscribe('block:gameOver', () => {
            this.ticker.stop();
            $store.commit('game/setGameoverState', { playerIndex, isGameover: true });                           //? [VUEX] Установить Gameover
        });
        this.EMITTER.subscribe('block:blockFixed', () => this.ticker.sleep(60));
        this.EMITTER.subscribe('canvas:wipeAnimationStart', () => this.ticker.sleep(360));
        this.EMITTER.subscribe('control:pausePressed', () => {
            this.ticker.stop();
            $store.commit('game/setPauseState', { playerIndex, isPaused: true });                              //? [VUEX] Установить паузу
        });
        this.EMITTER.subscribe('control:pauseReleased', () => {
            this.ticker.start();
            $store.commit('game/setPauseState', { playerIndex, isPaused: false });                             //? [VUEX] Снять паузу
        });

        $store.subscribe((mutation) => {
            if (mutation.type === "gamepads/updateGamepadIndex") {                  //? [VUEX] Обновить id геймпада
                if (mutation.payload.playerIndex === this.playerIndex) {
                    this.controls.gamepad.gamepadIndex = mutation.payload.gamepadIndex;
                }
            }
        });

        // this.saveGame = () => {
        //     localStorage.setItem('state', JSON.stringify({
        //         matrix: this.matrix.getFixedMatrix(),
        //         stats: {
        //             score: this.stats.score,
        //             lines: this.stats.lines,
        //             level: this.stats.level,
        //             blockStatistics: this.stats.blockStatistics,
        //         },
        //         block: {
        //             queue: this.block.queue,
        //             activeBlockId: this.block.activeBlockId,
        //         }
        //     }));
        // }

        // this.loadGame = () => {
        //     const state = JSON.parse(localStorage.getItem('state'));

        //     //Сбросить статистику и присвоить значения из state
        //     stats.init();
        //     stats.score = state.stats.score;
        //     stats.lines = state.stats.lines;
        //     stats.level = state.stats.level;
        //     stats.blockStatistics = state.stats.blockStatistics;
        //     stats.refreshBlockImages();
        //     stats.refresh();

        //     //Восстановить и отрисовать матрицу
        //     matrix.setMatrix(state.matrix);
        //     canvas.drawState(matrix.getFixedMatrix());

        //     //Восстановление последовательности блоков
        //     if (state.block.activeBlockId - 1 > 0) {
        //         block.loadQueue(state.block.queue, --state.block.activeBlockId);
        //     } else {
        //         block.loadQueue(state.block.queue, state.block.activeBlockId);
        //     }
        //     block.activeBlock.drawBlock();

        //     //Сделать активными контролы
        //     controls.isAvailable = true;

        //     // Оживляем по тикеру
        //     ticker.onTick = () => block.activeBlock.moveDown();
        //     ticker.start(LEVEL_DELAYS[state.stats.level]);
        //     ticker.sleep(800);
        // }

    }

    createQueue = () => this.block.createRandomQueue();

    startNewSingleGame = ({ level }) => {
        this.block.setNewQueue();
        this.stats.init();
        this.matrix.clearMatrix();
        this.canvas.drawState(this.matrix.getFixedMatrix());
        this.block.currentBlock.drawBlock();
        this.ticker.onTick = () => this.block.currentBlock.moveDown();
        this.ticker.start(this.LEVEL_DELAYS[level]);
        this.ticker.sleep(500).then(() => this.controls.isAvailable = true)
    }


    startNewPvpGame = ({ level, queue, startTime }) => {
        this.block.loadQueue(queue, 0);
        this.stats.init();
        this.matrix.clearMatrix();
        this.canvas.drawState(this.matrix.getFixedMatrix());
        this.block.currentBlock.drawBlock();
        this.ticker.onTick = () => this.block.currentBlock.moveDown();
        this.ticker.start(this.LEVEL_DELAYS[level], startTime);
        this.ticker.sleep(1000).then(() => this.controls.isAvailable = true)
    }
}