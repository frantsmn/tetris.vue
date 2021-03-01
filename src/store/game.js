export default {
    namespaced: true,
    state: {
        level: 5,
    },
    mutations: {
        setLevel(state, level) { state.level = level }
    },
    modules: {
        stats: {
            namespaced: true,
            state: {
                blocks: {
                    't-block': 0,
                    'j-block': 0,
                    'z-block': 0,
                    'o-block': 0,
                    's-block': 0,
                    'l-block': 0,
                    'i-block': 0,
                },
                nextBlock: "",
                score: 0,
                lines: 0,
            },
            mutations: {
                countBlock(state, blockName) { state.blocks[blockName]++ },
                setNextBlock(state, blockName) { state.nextBlock = blockName },
                setScore(state, score) { state.score = score },
                setLines(state, lines) { state.lines = lines },
                clear(state) {
                    for (const key in state.blocks) state.blocks[key] = 0;
                    state.nextBlock = "";
                    state.score = 0;
                    state.lines = 0;
                }
            }
        }
    }
}