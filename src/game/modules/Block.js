export default class Block {
    constructor(EMITTER, matrix, canvas) {
        this.EMITTER = EMITTER;

        this.createBlock = {
            1: () => new I_block(),
            2: () => new J_block(),
            3: () => new L_block(),
            4: () => new O_block(),
            5: () => new S_block(),
            6: () => new Z_block(),
            7: () => new T_block(),
        };

        const goToNextBlock = () => {
            this.currentBlockId++;
            this.currentBlock.drawBlock();
            this.EMITTER.emit('block:blockAppeared');
        }

        function BlockMethods() {
            this.drawBlock = () => {
                console.log('DRAW BLOCK');
                matrix.addPoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1], this.color);
                canvas.drawState(matrix.getMatrix());
            }
            this.eraseBlock = () => {
                matrix.removePoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1]);
            }
            this.moveDown = () => {
                //Если следующая линия свободна
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y + 1, this.pointsSet[this.rotation.state - 1])) {
                    this.eraseBlock();
                    this.position.y++;
                    this.drawBlock();
                } else if (this.position.y) { //Если следующая линия занята и он не на нулевой линии (this.position.y !== 0)
                    //Сообщить что блок упал
                    EMITTER.emit('block:blockFixed');
                    //Закрепить точки
                    matrix.fixPoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1]);

                    //Если поcле падения есть заполненные линии
                    if (matrix.getFullLines().length) {
                        //Добавить линии в статистику
                        EMITTER.emit('block:wipeLines', matrix.getFullLines().length);
                        // stats.addLines(matrix.getFullLines().length);
                        //Анимировать стирание линий: Canvas.wipeLinesAnimation(array[], callback());
                        canvas.wipeLinesAnimation(matrix.getFullLines(), () => {
                            matrix.removeFullLines();
                            canvas.drawState(matrix.getFixedMatrix());
                            goToNextBlock();
                        });
                    } else {
                        goToNextBlock();
                    }
                } else {
                    this.drawBlock();
                    //Сообщить о gameover
                    EMITTER.emit('block:gameOver');
                    //Воспроизвести анимацию gameOver
                    canvas.gameOverAnimation();
                }
            }
            this.moveLeft = () => {
                if (matrix.checkPointsIsEmpty(this.position.x - 1, this.position.y, this.pointsSet[this.rotation.state - 1])) {
                    this.eraseBlock();
                    this.position.x--;
                    // console.timeEnd('gamepadDelay');
                    this.drawBlock();
                    EMITTER.emit('block:moveLeft');
                }
            };
            this.moveRight = () => {
                if (matrix.checkPointsIsEmpty(this.position.x + 1, this.position.y, this.pointsSet[this.rotation.state - 1])) {
                    this.eraseBlock();
                    this.position.x++;
                    // console.timeEnd('gamepadDelay');
                    this.drawBlock();
                    EMITTER.emit('block:moveRight');
                }
            };
            this.rotateRight = () => {
                const newState = this.rotation.state === this.rotation.amount ? 1 : this.rotation.state + 1;
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y, this.pointsSet[newState - 1])) {
                    this.eraseBlock();
                    this.rotation.state = newState;
                    // console.timeEnd('gamepadDelay');
                    this.drawBlock();
                    EMITTER.emit('block:rotateRight');
                }
            }
            this.rotateLeft = () => {
                const newState = this.rotation.state === 1 ? this.rotation.amount : this.rotation.state - 1;
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y, this.pointsSet[newState - 1])) {
                    this.eraseBlock();
                    this.rotation.state = newState;
                    // console.timeEnd('gamepadDelay');
                    this.drawBlock();
                    EMITTER.emit('block:rotateLeft');
                }
            }
        }

        function I_block() {
            BlockMethods.call(this);
            this.name = 'i-block';
            this.color = 1;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 2,
                state: 1,
            }
            this.pointsSet = [
                [{
                    x: -2,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }],
                [{
                    x: 0,
                    y: -2
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }]
            ];
        }

        function J_block() {
            BlockMethods.call(this);
            this.name = 'j-block';
            this.color = 2;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 4,
                state: 1,
            }
            this.pointsSet = [
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 1,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 1
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: -1
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 1,
                    y: -1
                }],
            ];
        }

        function L_block() {
            BlockMethods.call(this);
            this.name = 'l-block';
            this.color = 3;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 4,
                state: 1,
            }
            this.pointsSet = [
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: -1,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: -1
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: -1
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 1,
                    y: 1
                }],
            ];
        }

        function O_block() {
            BlockMethods.call(this);
            this.name = 'o-block';
            this.color = 1;
            this.position = {
                x: 4,
                y: 0,
            }
            this.rotation = {
                amount: 1,
                state: 1,
            }
            this.pointsSet = [
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 1,
                    y: 1
                }]
            ];
        }

        function S_block() {
            BlockMethods.call(this);
            this.name = 's-block';
            this.color = 2;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 2,
                state: 1,
            }
            this.pointsSet = [
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: -1,
                    y: 1
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 1,
                    y: 1
                }],
            ];
        }

        function Z_block() {
            BlockMethods.call(this);
            this.name = 'z-block';
            this.color = 3;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 2,
                state: 1,
            }
            this.pointsSet = [
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 1,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 1,
                    y: -1
                }, {
                    x: 1,
                    y: 0
                }],
            ];
        }

        function T_block() {
            BlockMethods.call(this);
            this.name = 't-block';
            this.color = 1;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 4,
                state: 1,
            }
            this.pointsSet = [
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 1,
                    y: 0
                }],
            ];
        }
    }

    // Устанавливает новую очередь
    setNewQueue() {
        return new Promise(resolve => {
            this.queue = this.createRandomQueue();
            this.currentBlockId = 0;
            setTimeout(() => {
                resolve();
            }, 10);
        });
    }

    // Загружает очередь и устанавливает позицию в ней
    loadQueue(queue, i) {
        return new Promise(resolve => {
            this.queue = queue;
            this.currentBlockId = i;
            setTimeout(() => {
                resolve();
            }, 10);
        });
    }

    // Создает массив с рандомными числами 
    createRandomQueue() {
        return [...new Array(1000)].map(() => Math.floor(Math.random() * 7) + 1);
    }

    // Устанавливает новую очередь
    set queue(value) {
        this.__queue = value;
    }

    get queue() {
        return this.__queue;
    }

    // Устанавливает текущий блок + (устанавливает следующий блок)
    set currentBlockId(value) {
        this.__currentBlockId = value;
        this.__currentBlock = this.createBlock[this.queue[value]]();
        this.__nextBlock = this.createBlock[this.queue[value + 1]]();
        this.EMITTER.emit('block:blockAppeared');
    }

    get currentBlockId() {
        return this.__currentBlockId;
    }

    get currentBlock() {
        return this.__currentBlock;
    }

    get nextBlock() {
        return this.__nextBlock;
    }
}