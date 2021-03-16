import { GamepadListener } from 'gamepad.js'

export default class Gamepad {

    constructor({ onConnect = Function, onDisconnect = Function, onKeyDown = Function, onKeyUp = Function }) {
        this.gamepadListener = new GamepadListener();
        this.gamepadListener.start();
        this.pressedKeys = {};

        this.gamepadListener.on('gamepad:connected', (event) => {
            // console.log(`connected >>`, event.detail.gamepad);
            onConnect(event);
            this.pressedKeys[event.detail.gamepad.index] = {};
        });
        this.gamepadListener.on('gamepad:disconnected', (event) => {
            // console.log(`disconnected >>`, event);
            onDisconnect(event);
            delete this.pressedKeys[event.detail.index];
        });

        this.onKeyDown = onKeyDown;
        this.onKeyUp = onKeyUp;

        this.MAP = {
            0: { button: 'A' },
            1: { button: 'B' },
            14: { button: 'Left' },
            13: { button: 'Down' },
            15: { button: 'Right' },
            9: { button: 'Pause' },
        }

        this.gamepadListener.on('gamepad:button', (event) => {
            if (event.detail.pressed)
                this.keydown(event);
            else
                this.keyup(event);
        });

    }

    keydown(event) {
        const button = event.detail.button;
        if (
            this.MAP[button] && 			// Если такая кнопка в карте есть и
            !this.pressedKeys[event.detail.gamepad.index][button] 		// Если такая кнопка еще не нажата (защита от системных нажатий клавиши)
        ) {
            this.onKeyDown(this.MAP[button], event);
            this.pressedKeys[event.detail.gamepad.index][button] = this.MAP[button];
        }
    }

    keyup(event) {
        const button = event.detail.button;
        if (this.MAP[button]) {
            this.onKeyUp(this.MAP[button], event);
            delete this.pressedKeys[event.detail.gamepad.index][button];
        }
    }

}
