export default {
    namespaced: true,
    state: {
        list: [],
        1: Number,
        2: Number
    },
    mutations: {
        addGamepad(state, newGamepad) {
            state.list.push(newGamepad);

            // Присвоить index подключенного геймпада игроку, у которого он не выставлен 
            if (typeof state[1] !== 'number') {
                this.commit('gamepads/updateGamepadIndex', { playerIndex: 1, gamepadIndex: newGamepad.index })
                return
            }
            if (typeof state[2] !== 'number') {
                this.commit('gamepads/updateGamepadIndex', { playerIndex: 2, gamepadIndex: newGamepad.index })
                return
            }
        },
        removeGamepad(state, removedGamepadIndex) {
            state.list = state.list.filter(gamepad => gamepad.index !== removedGamepadIndex)
        },

        // Переопределить index геймпада для игрока 
        updateGamepadIndex(state, { playerIndex, gamepadIndex }) {
            state[playerIndex] = gamepadIndex;
        }
    }
}