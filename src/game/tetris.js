import EventEmitter from './modules/Emitter'

import Textures from './modules/Textures'
import Sound from './modules/Sound'

import Block from './modules/Block'
import Canvas from './modules/Canvas'

import Controls from './modules/Controls/Controls'
import Matrix from './modules/Matrix'
import Stats from './modules/Stats'

import Ticker from './modules/Ticker'
import UI from './modules/UI'
import Settings from './modules/Settings'

//=======================================================
// const matrixState = '[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3}]]';

export default class Tetris {
    constructor({ canvasElement, $store }) {
        const EMITTER = new EventEmitter();

        const textures = new Textures(EMITTER);
        new Sound(EMITTER);

        const ticker = new Ticker();
        const matrix = new Matrix();
        const canvas = new Canvas(EMITTER, canvasElement, textures);
        const stats = new Stats(EMITTER);
        const block = new Block(EMITTER, matrix, canvas);
        const controls = new Controls(EMITTER, block);

        new Settings();
        new UI(stats, EMITTER);

        const LEVEL_DELAYS = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67, 50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17];

        EMITTER.subscribe('stats:newLevel', (level) => {
            ticker.start(LEVEL_DELAYS[level]);
            $store.commit('game/setLevel', level)                                   //? [VUEX] Обновить уровень (определяет цвет блоков)
        });
        EMITTER.subscribe('stats:refresh', ({ score, lines }) => {
            $store.commit('game/stats/setScore', score)                             //? [VUEX] Обновить уровень (определяет цвет блоков)
            $store.commit('game/stats/setLines', lines)                             //? [VUEX] Обновить уровень (определяет цвет блоков)
        });

        EMITTER.subscribe('block:blockAppeared', () => {
            $store.commit('game/stats/countBlock', block.currentBlock.name);        //? [VUEX] Подсчет появившихся блоков
            $store.commit('game/stats/setNextBlock', block.nextBlock.name);         //? [VUEX] Установить след. блок
        });
        EMITTER.subscribe('block:gameOver', () => ticker.stop());
        EMITTER.subscribe('block:blockFixed', () => ticker.sleep(60));

        EMITTER.subscribe('canvas:wipeAnimationStart', () => ticker.sleep(360));

        EMITTER.subscribe('control:pausePressed', () => ticker.stop());
        EMITTER.subscribe('control:pauseReleased', () => ticker.start());

        this.startGame = ({ level }) => {
            // Определить цвет текстур
            textures.level = level;

            stats.init();
            matrix.clearMatrix();
            canvas.drawState(matrix.getFixedMatrix());

            block.setNewQueue()
                .then(() => {
                    block.currentBlock.drawBlock();
                    ticker.onTick = () => block.currentBlock.moveDown();
                    ticker.start(LEVEL_DELAYS[level]);
                    ticker.sleep(1000).then(() => controls.isAvailable = true)
                });
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