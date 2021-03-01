export default {
    namespaced: true,
    state: { gamepads: [] },
    mutations: {
        addGamepad(state, newGamepad) { state.gamepads.push(newGamepad) },
        removeGamepad(state, removedGamepadIndex) {
            state.gamepads = state.gamepads.filter(gamepad => gamepad.index !== removedGamepadIndex)
        }
    }
}