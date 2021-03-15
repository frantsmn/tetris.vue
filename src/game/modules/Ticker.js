export default class Ticker {
	constructor() {
		this._isRunning = false;
		this.sleepTimeout = null;
		this._startTime = performance.now();
		this._time = 0;
		this._delay = 1000;
		this._tickNumber = 0;

		this.onTick = (/* ticker */) => {/* console.log('Ticker time', ticker._time) */ };

		const run = () => {
			requestAnimationFrame(() => {

				this._time = performance.now() - this._startTime;
				const requestTickNumber = ~~(this._time / this._delay);

				if (this._isRunning && requestTickNumber > this._tickNumber) {

					this._tickNumber = requestTickNumber;
					this.onTick();

					// console.table({
					// 	'Ticker time': this._time,
					// 	'Ticker delay': this._delay,
					// 	'Tick number': this._tickNumber,
					// 	'Lag': this._time % this._delay
					// });
				}

				run();
			});
		}
		run();

	}

	set delay(value) {
		// console.log('Setting delay to:', value);
		this._startTime = performance.now();
		this._time = 0;
		this._delay = value;
		this._tickNumber = 0;
	}

	get running() {
		return this._isRunning;
	}

	stop() {
		this._isRunning = false;
	}

	start(delay) {
		this.delay = delay || this._delay;
		this._isRunning = true;
	}

	sleep(ms) {
		return new Promise(resolve => {
			clearTimeout(this.sleepTimeout);
			this.stop();
			this.sleepTimeout = setTimeout(() => {
				this.start();
				resolve();
			}, ms);
		})
	}

}