import Gamepad from './controls/Gamepad'
import Keyboard from './controls/Keyboard'

export default {
    namespaced: true,
    state: {

        list: [{ index: 10, playerIndex: 0, type: 'keyboard', id: 'Keyboard' }],
        1: {
            deviceIndex: Number,
            onKeyDown: () => { },
            onKeyUp: () => { }
        },
        2: {
            deviceIndex: Number,
            onKeyDown: () => { },
            onKeyUp: () => { }
        },
        map: {
            10: 1,
            // 0: 1
            // 1: 2
        }
    },
    mutations: {
        init(state) {
            new Gamepad({
                onConnect: (event) => { this.commit('controls/addGamepad', event.detail.gamepad) },
                onDisconnect: (event) => { this.commit('controls/removeGamepad', event.detail.index) },

                onKeyDown: (KEY, event) => { state[state.map[event.detail.gamepad.index]]?.onKeyDown(KEY) },
                onKeyUp: (KEY, event) => { state[state.map[event.detail.gamepad.index]]?.onKeyUp(KEY) },
            });

            new Keyboard({
                onKeyDown: (KEY) => { state[state.map[10]].onKeyDown(KEY) },
                onKeyUp: (KEY) => { state[state.map[10]].onKeyUp(KEY) }
            });
        },

        addGamepad(state, newGamepad) {
            if (newGamepad.id.includes('Tyon')) return;

            // Присвоить index подключенного геймпада игроку, у которого он не выставлен 
            if (typeof state[1].deviceIndex !== 'number') {
                this.commit('controls/updateGamepadIndex', { playerIndex: 1, gamepadIndex: newGamepad.index })
                state.list.push({
                    index: newGamepad.index,
                    playerIndex: 1,
                    type: 'gamepad',
                    id: newGamepad.id
                });
                state.map[newGamepad.index] = 1
                return
            }
            if (typeof state[2].deviceIndex !== 'number') {
                this.commit('controls/updateGamepadIndex', { playerIndex: 2, gamepadIndex: newGamepad.index })
                state.list.push({
                    index: newGamepad.index,
                    playerIndex: 2,
                    type: 'gamepad',
                    id: newGamepad.id
                });
                state.map[newGamepad.index] = 2
                return
            }
        },
        removeGamepad(state, removedGamepadIndex) {
            state.list = state.list.filter(device => device.index !== removedGamepadIndex)
        },
        // Переопределить index геймпада для игрока 
        updateGamepadIndex(state, { playerIndex, gamepadIndex }) {
            state[playerIndex].deviceIndex = gamepadIndex;
            state.map[gamepadIndex] = playerIndex;
        },
    }
}