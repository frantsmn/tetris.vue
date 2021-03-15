import Tetris from '../game/tetris'

let tetris1 = {};
let tetris2 = {};
const LEVELS_COLOR_MAP = [
    { primary: '#6e5df3', secondary: '#77c8ff' },
    { primary: '#06B72F', secondary: '#7EEE49' },
    { primary: '#DF2FB7', secondary: '#FF76FE' },
    { primary: '#6E5DF3', secondary: '#4EFE77' },
    { primary: '#F33177', secondary: '#3AFCB6' },
    { primary: '#3AFCB6', secondary: '#B6A5FF' },
    { primary: '#E44437', secondary: '#808080' },
    { primary: '#AF3FE4', secondary: '#CA084E' },
    { primary: '#6E5DF3', secondary: '#E44437' },
    { primary: '#E44437', secondary: '#FEAC4E' },
]

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
            wrapperElement: {},
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
            wrapperElement: {},
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

        setPauseState(state, { playerIndex, isPaused }) {
            state[playerIndex].isPaused = isPaused;
        },
        setGameoverState(state, { playerIndex, isGameover }) { state[playerIndex].isGameover = isGameover },
        tetrisAnimation(state, { playerIndex }) { return { state, playerIndex } },

        // Stats
        countBlock(state, { playerIndex, blockName }) { state[playerIndex].blocks[blockName]++ },
        setNextBlock(state, { playerIndex, blockName }) { state[playerIndex].nextBlock = blockName },

        setLevel(state, { playerIndex, level }) {
            state[playerIndex].level = level;
        },

        setTetraminoColor(state, { playerIndex, level }) {
            state[playerIndex].wrapperElement.style.setProperty('--primary-tetramino-color', LEVELS_COLOR_MAP[level].primary);
            state[playerIndex].wrapperElement.style.setProperty('--secondary-tetramino-color', LEVELS_COLOR_MAP[level].secondary);
        },

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

        async refreshStats({ commit }, { playerIndex, level, lines, score }) {
            await new Promise(() => {
                commit('setTetraminoColor', { playerIndex, level });
                commit('setLevel', { playerIndex, level });
                commit('setScore', { playerIndex, score });
                commit('setLines', { playerIndex, lines });
            })
        },

        async refreshBlocksInfo({ commit }, { playerIndex, currentBlockName, nextBlockName }) {
            await new Promise(() => {
                commit('countBlock', { playerIndex, blockName: currentBlockName });
                commit('setNextBlock', { playerIndex, blockName: nextBlockName });
            })
        },

        createGame({ state }, { canvasElement1, wrapperElement1, canvasElement2, wrapperElement2 }) {
            switch (state.mode) {
                case 'single':
                    tetris1 = new Tetris({
                        playerIndex: 1,
                        canvasElement1,
                        $store: this,
                    });
                    state[1].wrapperElement = wrapperElement1;
                    break;

                default:
                    tetris1 = new Tetris({
                        playerIndex: 1,
                        canvasElement: canvasElement1,
                        $store: this,
                    });
                    state[1].wrapperElement = wrapperElement1;
                    tetris2 = new Tetris({
                        playerIndex: 2,
                        canvasElement: canvasElement2,
                        $store: this,
                    });
                    state[2].wrapperElement = wrapperElement2;
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