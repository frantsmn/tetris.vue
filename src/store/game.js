import Tetris from '../game/tetris'

let tetris1 = {};
let tetris2 = {};

export default {
    namespaced: true,
    state: {
        mode: '', // single, pvp_local, pvp_internet
        1: {
            level: 0,
            score: 0,
            lines: 0,
            isPaused: false,
            isGameover: false,
            nextBlock: "",
            blocks: {
                't-block': 0,
                'j-block': 0,
                'z-block': 0,
                'o-block': 0,
                's-block': 0,
                'l-block': 0,
                'i-block': 0,
            },
        },
        2: {
            level: 0,
            score: 0,
            lines: 0,
            isPaused: false,
            isGameover: false,
            nextBlock: "",
            blocks: {
                't-block': 0,
                'j-block': 0,
                'z-block': 0,
                'o-block': 0,
                's-block': 0,
                'l-block': 0,
                'i-block': 0,
            },
        }
    },
    mutations: {
        setMode(state, mode) { state.mode = mode },

        setLevel(state, { playerIndex, level }) { state[playerIndex].level = level },
        setPauseState(state, { playerIndex, isPaused }) {
            state[playerIndex].isPaused = isPaused;
        },
        setGameoverState(state, { playerIndex, isGameover }) { state[playerIndex].isGameover = isGameover },
        tetrisAnimation(state, { playerIndex }) { return { state, playerIndex } },

        // Stats
        countBlock(state, { playerIndex, blockName }) { state[playerIndex].blocks[blockName]++ },
        setNextBlock(state, { playerIndex, blockName }) { state[playerIndex].nextBlock = blockName },
        setScore(state, { playerIndex, score }) { state[playerIndex].score = score },
        setLines(state, { playerIndex, lines }) { state[playerIndex].lines = lines },

        clear(state, { playerIndex }) {
            for (const key in state[playerIndex].blocks) state[playerIndex].blocks[key] = 0;
            state[playerIndex].nextBlock = "";
            state[playerIndex].score = 0;
            state[playerIndex].lines = 0;
        }
    },
    actions: {

        refreshStats({ commit }, { playerIndex, block }) {

        },

        createGame({ state }, { canvasElement1, canvasElement2 }) {
            switch (state.mode) {
                case 'single':
                    tetris1 = new Tetris({
                        playerIndex: 1,
                        canvasElement1,
                        $store: this,
                    });
                    break;

                default:
                    tetris1 = new Tetris({
                        playerIndex: 1,
                        canvasElement: canvasElement1,
                        $store: this,
                    });
                    tetris2 = new Tetris({
                        playerIndex: 2,
                        canvasElement: canvasElement2,
                        $store: this,
                    });
                    break;
            }


        },

        startNewGame({ state }) {
            switch (state.mode) {
                case 'single':
                    tetris1.startNewSingleGame({ level: state[1].level });
                    break;

                default: {
                    const queue = tetris1.createQueue();
                    const startTime = performance.now();
                    tetris1.startNewPvpGame({ level: state[1].level, queue, startTime });
                    tetris2.startNewPvpGame({ level: state[2].level, queue, startTime });
                    break;
                }
            }
        }
    }
}