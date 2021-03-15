export default class Control {
	constructor(EMITTER, block, playerIndex, $store) {
		this.EMITTER = EMITTER;

		let shiftRepeatTimeoutID = 0;		// ID таймаута повтора движения блока влево/вправо, при зажатой кнопке
		let downRepeatTimeoutID = 0;		// ID таймаута повтора движения блока вниз, при зажатой кнопке

		this._isPaused = false;				// Состояние паузы
		this._isAvailable = false;			// Состояние блокировки управления 

		const downHold = function () {
			block.currentBlock.moveDown();
			EMITTER.emit('control:downPressed');								// Сообщить о нажатой клавише 'down' (необходимо для подсчета строк, которые пролетит блок)
			downRepeatTimeoutID = setTimeout(downHold, 37);			// Рекурсивно вызывать таймаут
		}

		const downRelease = function () {
			EMITTER.emit('control:downReleased');								// Сообщить об отпущенной клавише 'down' (необходимо для подсчета строк, которые пролетел блок)
			clearTimeout(downRepeatTimeoutID);
		}

		const KEYDOWN_VOC = {
			'Pause': () => {
				this.isPaused = !this.isPaused;
				clearTimeout(shiftRepeatTimeoutID);
				downRelease();
			},
			'A': () => block.currentBlock.rotateLeft(),
			'B': () => block.currentBlock.rotateRight(),
			'Left': () => {
				clearTimeout(shiftRepeatTimeoutID);								// Обнулить повторы нажатия (устранение конфликта при одновременном нажатии 'left' и 'right')
				block.currentBlock.moveLeft();
				shiftRepeatTimeoutID = setTimeout(function tick() {
					block.currentBlock.moveLeft();
					shiftRepeatTimeoutID = setTimeout(tick, 100);		// Рекурсивно вызывать таймаут
				}, 260);
			},
			'Right': () => {
				clearTimeout(shiftRepeatTimeoutID);								// Обнулить повторы нажатия (устранение конфликта при одновременном нажатии 'left' и 'right')
				block.currentBlock.moveRight();
				shiftRepeatTimeoutID = setTimeout(function tick() {
					block.currentBlock.moveRight();
					shiftRepeatTimeoutID = setTimeout(tick, 100);		// Рекурсивно вызывать таймаут
				}, 260);
			},
			'Down': () => {
				downHold();
			}
		}

		const KEYUP_VOC = {
			'Left': () => clearTimeout(shiftRepeatTimeoutID),
			'Right': () => clearTimeout(shiftRepeatTimeoutID),
			'Down': () => requestAnimationFrame(downRelease),
		}

		const onKeyDown = (e) => {
			if (
				this.isAvailable ||														// Если управление не заблокировано или
				(e.button === 'Pause' && this.isPaused)				// была отжата 'Пауза'
			)
				if (KEYDOWN_VOC[e.button]) { 									// Проверить в словаре наличие такой кнопки
					KEYDOWN_VOC[e.button](); 										// Отработать функцию для этой кнопки
				}
		}

		const onKeyUp = (e) => {
			if (KEYUP_VOC[e.button]) {
				KEYUP_VOC[e.button]();
			}
		}

		$store.state.controls[playerIndex].onKeyDown = onKeyDown;
		$store.state.controls[playerIndex].onKeyUp = onKeyUp;

		EMITTER.subscribe('canvas:wipeAnimationStart', () => this.isAvailable = false); 	// Блокировка управления на время анимации
		EMITTER.subscribe('canvas:wipeAnimationEnd', () => this.isAvailable = true); 		// Восстановление управления после анимации
		EMITTER.subscribe('block:gameOver', () => this.isAvailable = false); 				// Блокировка управление по gameover
		EMITTER.subscribe('block:blockFixed', () => requestAnimationFrame(downRelease));	// При фиксации блока программно отжимаем клавишу "вниз"
	}


	set isPaused(state) {
		this._isPaused = state;
		if (this._isPaused) {
			this.isAvailable = false;
			this.EMITTER.emit('control:pausePressed');
		} else {
			this.isAvailable = true;
			this.EMITTER.emit('control:pauseReleased');
		}
	}

	get isPaused() {
		return this._isPaused;
	}

	set isAvailable(state) {
		this._isAvailable = state;
	}

	get isAvailable() {
		return this._isAvailable;
	}
}