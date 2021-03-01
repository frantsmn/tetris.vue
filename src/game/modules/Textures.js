export default class Textures {
    constructor(EMITTER) {
        this[1] = new Image();
        this[2] = new Image();
        this[3] = new Image();

        this._level = 0;
        this.level = 0;

        EMITTER.subscribe('stats:newLevel', (level) => {
            this.level = level % 10; //Нужен только остаток, т.к. текстур 10, а уровней 20
        });
    }

    set level(value) {
        this._level = value;
        this[1].src = `./assets/game/svg/textures/level_${value}/type_1.svg`;
        this[2].src = `./assets/game/svg/textures/level_${value}/type_2.svg`;
        this[3].src = `./assets/game/svg/textures/level_${value}/type_3.svg`;
    }

    get level() {
        return this._level;
    }
}