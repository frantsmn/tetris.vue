import Gamepad from './controls/Gamepad'
import Keyboard from './controls/Keyboard'

export default {
    namespaced: true,
    state: {
        deviceList: [],
        deviceIndexMap: new Map(),
        1: {
            deviceIndex: undefined,
            onKeyDown: () => { },
            onKeyUp: () => { }
        },
        2: {
            deviceIndex: undefined,
            onKeyDown: () => { },
            onKeyUp: () => { }
        },
    },
    mutations: {
        init(state) {
            new Gamepad({
                onConnect: (event) => { this.commit('controls/addGamepad', event.detail.gamepad) },
                onDisconnect: (event) => { this.commit('controls/removeGamepad', event.detail.index) },

                onKeyDown: (KEY, event) => { state[state.deviceIndexMap.get(event.detail.gamepad.index)]?.onKeyDown(KEY) },
                onKeyUp: (KEY, event) => { state[state.deviceIndexMap.get(event.detail.gamepad.index)]?.onKeyUp(KEY) },
            });


            // Добавить клавиатуру в список подключенных устройств (контроллеров)
            const keyboardIndex = +new Date();
            this.commit('controls/addGamepad', { index: keyboardIndex, id: 'Keyboard' })
            new Keyboard({
                onKeyDown: (KEY) => { state[state.deviceIndexMap.get(keyboardIndex)]?.onKeyDown(KEY) },
                onKeyUp: (KEY) => { state[state.deviceIndexMap.get(keyboardIndex)]?.onKeyUp(KEY) }
            });
        },

        addGamepad(state, newGamepad) {
            // Игнорировать мышь
            if (newGamepad.id.includes('Tyon')) return;
            // console.info('Gamepad: ', newGamepad);

            // Если этот геймпад еще не добавлен
            if (state.deviceIndexMap.has(newGamepad.index) === false) {
                // Добавить геймпад в список устройств
                state.deviceList.push(newGamepad);
                // Добавить геймпад в карту устройств 
                state.deviceIndexMap.set(newGamepad.index, undefined);

                // Проверить для каждого игрока
                for (let playerIndex = 1; playerIndex <= 2; playerIndex++) {
                    // console.log('CONNECTED', state.deviceIndexMap.has(newGamepad.index));

                    // Если за игроком не закреплены геймпады
                    if (state[playerIndex].deviceIndex === undefined) {
                        // Связать игрока с геймпадом
                        state[playerIndex].deviceIndex = newGamepad.index;
                        state.deviceIndexMap.set(newGamepad.index, playerIndex);

                        return;
                    }

                }


                const keyboardIndex = state.deviceList.find(device => device.id === 'Keyboard').index;
                // Проверить для каждого игрока
                for (let playerIndex = 1; playerIndex <= 2; playerIndex++) {
                    // console.log('CONNECTED', state.deviceIndexMap.has(newGamepad.index));

                    // Если за игроком закреплена клавиатура
                    if (state[playerIndex].deviceIndex === keyboardIndex &&
                        // и добавляется не эта же клавиатура, (а геймпад)
                        keyboardIndex !== newGamepad.index
                    ) {
                        // Связать игрока с геймпадом
                        state[playerIndex].deviceIndex = newGamepad.index;
                        state.deviceIndexMap.set(newGamepad.index, playerIndex);
                        return;
                    }

                }

                console.log('AFTER GAMEPAD ADD', state.deviceIndexMap, state.deviceList);
            }


        },
        removeGamepad(state, gamepadIndex) {
            const playerIndex = state.deviceIndexMap.get(gamepadIndex)
            // Если отключено устройство (типа gamepad), которое не было добавлено в список 
            if (!!playerIndex === false) return;
            // console.log('GAMEPAD FOR REMOVE >>', gamepadIndex);
            // console.log('CLEAR PLAYER INDEX >>', playerIndex);

            // Удайлить геймпад из списка устройств
            state.deviceList = state.deviceList.filter(device => device.index !== gamepadIndex)
            // Удаление геймпада из карты устройств
            state.deviceIndexMap.delete(gamepadIndex);
            // Очистка устройства у игрока
            state[playerIndex].deviceIndex = undefined;

            //TODO Установка оставшегося контроллера вместо отключенного
        },

        // Переопределить index геймпадов для игроков 
        updateGamepadIndex(state, { playerIndex, gamepadIndex: nextDeviceIndex }) {
            const previousDeviceIndex = state[playerIndex].deviceIndex;
            const oppositePlayerIndex = playerIndex === 1 ? 2 : 1;

            // Связать выбранный геймпад с игроком
            state.deviceIndexMap.set(nextDeviceIndex, playerIndex);     // [controls]
            state[playerIndex].deviceIndex = nextDeviceIndex;           // [vue]

            // Если oppositePlayer остался с таким же девайсом
            if (state[oppositePlayerIndex].deviceIndex === state[playerIndex].deviceIndex) {

                if (previousDeviceIndex !== undefined) {
                    // связать его с контроллером от которого отказался игрок
                    state[oppositePlayerIndex].deviceIndex = previousDeviceIndex;       // [controls]
                    state.deviceIndexMap.set(previousDeviceIndex, oppositePlayerIndex); // [vue]
                } else {
                    // или убрать у него девайс
                    state[oppositePlayerIndex].deviceIndex = undefined; // [controls]
                    state.deviceIndexMap.set(previousDeviceIndex, oppositePlayerIndex);       // [vue]
                }
            }

        },
    }
}