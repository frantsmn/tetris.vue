
// export default class Textures {
//     constructor(EMITTER, $store) {
//         this.$store = $store;
//         this[1] = {};
//         this[2] = {};
//         this[3] = {};

//         this._level = 0;
//         this.level = 0;

//         EMITTER.subscribe('stats:newLevel', (level) => {
//             this.level = level % 10; //Нужен только остаток, т.к. текстур 10, а уровней 20
//         });
//     }

//     set level(level) {
//         this._level = level;
//         this[1] = this.$store.state.loader.assets.textures[level][0];
//         this[2] = this.$store.state.loader.assets.textures[level][1];
//         this[3] = this.$store.state.loader.assets.textures[level][2];
//     }

//     get level() {
//         return this._level;
//     }
// }

export default class Canvas {
    constructor(EMITTER, element) {
        this.context = element.getContext('2d', { alpha: false });
        this.EMITTER = EMITTER;
        this.sprite = document.querySelector('#sprite');

        this.cellSize = 20;

        this.matrixRowAmount = 20;
        this.matrixColumnAmount = 10;
    }

    drawState(matrix) {
        for (let i = 0; i < this.matrixRowAmount; i++) {
            for (let j = 0; j < this.matrixColumnAmount; j++) {
                if (matrix[i][j]) {
                    this.context.drawImage(
                        this.sprite,
                        0, 0, this.cellSize, this.cellSize,
                        j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize
                    );
                } else {
                    this.context.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }
        // matrix.forEach((row, y) => {
        //     row.forEach((cell, x) => {
        //         if (cell) {
        //             //Color
        //             // context.fillStyle = cell.color;
        //             // context.fillRect(x * 20, y * 20, 20, 20);
        //             //Texture
        //             // context.drawImage(this.textures[cell.color], x * 20, y * 20, 20, 20);
        //             context.drawImage(
        //                 this.sprite,
        //                 0, 0, this.spriteW, this.spriteH,
        //                 x * 20, y * 20, 20, 20
        //             );
        //         } else {
        //             context.fillRect(x * 20, y * 20, 20, 20);
        //             // context.clearRect(x * 20, y * 20, 20, 20);
        //         }
        //     });
        // });
    }

    drawBlock(xPos, yPos, points, color) {
        // this.context.fillStyle = color;
        for (let i = 0; i < points.length; i++) {
            //Color
            // context.fillRect((points[i].x + xPos) * 20, (points[i].y + yPos) * 20, 20, 20);
            //Texture
            this.context.drawImage(this.textures[color], (points[i].x + xPos) * this.cellSize, (points[i].y + yPos) * this.cellSize, this.cellSize, this.cellSize);
        }
    }

    eraseBlock(x, y, points) {
        for (let i = 0; i < points.length; i++) {
            this.context.fillRect((points[i].x + x) * this.cellSize, (points[i].y + y) * this.cellSize, this.cellSize, this.cellSize);
            // context.clearRect((points[i].x + x) * 20, (points[i].y + y) * 20, 20, 20);
        }
    }

    wipeLinesAnimation(lineNumbers, callback) {
        //Трансляция события начала анимации
        this.EMITTER.emit('canvas:wipeAnimationStart');

        let columNumber = 0;
        const interval = setInterval(() => {
            for (let i = 0; i < lineNumbers.length; i++) {
                this.context.fillRect((4 - columNumber) * this.cellSize, lineNumbers[i] * this.cellSize, this.cellSize, this.cellSize);
                this.context.fillRect((5 + columNumber) * this.cellSize, lineNumbers[i] * this.cellSize, this.cellSize, this.cellSize);
            }
            columNumber++;
            if (columNumber > 5) {
                clearInterval(interval);
                callback();

                //Трансляция события окончания анимации
                this.EMITTER.emit('canvas:wipeAnimationEnd');
            }
        }, 60);
    }

    gameOverAnimation() {
        this.context.fillStyle = 'rgba(0, 0, 0, .25)';
        let n = 0
        let interval = setInterval(() => {
            for (let j = 0; j < 100; j++) {
                let i = j % 2 ? 1 : 0
                for (i; i < 50; i++) {
                    this.context.fillRect(i * 4, j * 4, 4, 4);
                    i++;
                    // console.log(i);
                }
            }
            // console.log('n ------------------> ', n);
            if (n >= 6) {
                clearInterval(interval);
                return; //callback();
            }
            n++;
        }, 200);
    }
}