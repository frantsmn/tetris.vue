export default class Stats {
    constructor(EMITTER) {
        this.EMITTER = EMITTER;
        // this.topScores = 0;
        // this.topScore = 0;
        this.score = 0;
        this.lines = 0;
        this.level = 0;

        //Счетчик высоты падения блоxка
        let fallLinesCounter = 0;
        //Подсчет высоты падения блока с зажатой кнопкой вниз
        EMITTER.subscribe('control:downPressed', () => { fallLinesCounter++; });
        EMITTER.subscribe('control:downReleased', () => { fallLinesCounter = 0; });

        //Добавить к очкам высоту падения
        EMITTER.subscribe('block:blockFixed', () => {
            this.score += fallLinesCounter;
            fallLinesCounter = 0;
            this.refresh();
        });
        //Добавить линии
        EMITTER.subscribe('block:wipeLines', (n) => this.addLines(n));
    }

    init() {
        // this.loadTopscores();
        this.score = 0;
        this.lines = 0;
        this.level = 0;
        this.refresh()
    }

    addLines(n) {
        this.lines += n;

        //Если переход на следующий уровень
        if (this.level < Math.floor(this.lines / 10)) {
            //Добавить уровень
            this.level = Math.floor(this.lines / 10);
            //Оповестить (класс Текстур для смены спрайтов, и класс Sound для воспроизведения звука)
            this.EMITTER.emit('stats:newLevel', this.level);
            //Если просто очищены линии, то
        } else {
            if (n === 4) {
                // В случае тетриса
                this.EMITTER.emit('stats:tetris', this.level);
            } else {
                //В случае одиночной (двойной или тройной)
                this.EMITTER.emit('stats:clearline', this.level);
            }
        }

        switch (n) {
            case 1:
                this.score += 40 * (this.level + 1);
                break;
            case 2:
                this.score += 100 * (this.level + 1);
                break;
            case 3:
                this.score += 300 * (this.level + 1);
                break;
            case 4:
                this.score += 1200 * (this.level + 1);
                break;
            default:
                break;
        }

        this.refresh();
    }

    refresh() {
        //Рекорд очков
        // element.querySelector(`#topScoreStat`).textContent = this.topScore;

        this.EMITTER.emit('stats:refresh', {
            score: this.score,
            lines: this.lines,
        })
    }

    //Подгрузка рекордов
    //=======================================================
    // loadTopscores() {
    //     this.topScores = JSON.parse(localStorage.getItem('topScores'));
    //     let sortedTopScores = [];
    //     if (this.topScores) {
    //         sortedTopScores = this.topScores.sort((a, b) => { return b.score - a.score })
    //         this.topScore = sortedTopScores[0].score;

    //         //Отрисовка в таблице рекордов
    //         let table = document.querySelector('#scoresTable');
    //         table.innerHTML = '';

    //         sortedTopScores.forEach((item, i) => {
    //             if (i <= 9) {
    //                 table.innerHTML += `<div>${item.name}</div> <div>${item.score}</div>`
    //             }
    //         });

    //     } else {
    //         console.log('Scores empty: ', this.topScores);
    //         this.topScore = 0;
    //     }
    //     this.refresh();

    //     return this.topScores;
    // }
}