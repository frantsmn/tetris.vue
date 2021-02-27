<template>
  <div class="game-container" :class="$store.state.session.gamemode">
    <div id="game1" class="game">
      <div class="panel panel_stats">
        <p>stats</p>
        <div class="panel__stats-row">
          <img data-blockName="t-block" class="panel__block-image" />
          <span id="t-block-stat">0</span>
        </div>
        <div class="panel__stats-row">
          <img data-blockName="j-block" class="panel__block-image" />
          <span id="j-block-stat">0</span>
        </div>
        <div class="panel__stats-row">
          <img data-blockName="z-block" class="panel__block-image" />
          <span id="z-block-stat">0</span>
        </div>
        <div class="panel__stats-row">
          <img data-blockName="o-block" class="panel__block-image" />
          <span id="o-block-stat">0</span>
        </div>
        <div class="panel__stats-row">
          <img data-blockName="s-block" class="panel__block-image" />
          <span id="s-block-stat">0</span>
        </div>
        <div class="panel__stats-row">
          <img data-blockName="l-block" class="panel__block-image" />
          <span id="l-block-stat">0</span>
        </div>
        <div class="panel__stats-row">
          <img data-blockName="i-block" class="panel__block-image" />
          <span id="i-block-stat">0</span>
        </div>
      </div>

      <div class="panel panel_glass">
        <canvas id="canvas1" width="200" height="400"></canvas>
      </div>

      <div class="panel panel_info">
        <div>
          <p>top</p>
          <span id="topScoreStat">0</span>
        </div>
        <div>
          <p>score</p>
          <span id="scoreStat">0</span>
        </div>
        <div>
          <p>next</p>
          <div class="panel__img-wrap">
            <img id="nextBlock" class="panel__block-image" src="#" />
          </div>
        </div>
        <div>
          <p>lines</p>
          <span id="linesStat">0</span>
        </div>
        <div>
          <p>level</p>
          <span id="levelStat">0</span>
        </div>
      </div>

      <div class="panel panel_status">status</div>

      <Pause v-if="isPause" />
      <GameOver v-if="isGameover" />
    </div>
  </div>
</template>

<script>
import Pause from "./Pause.vue";
import GameOver from "./GameOver.vue";

import Game from "@/game/tetris";

export default {
  components: {
    Pause,
    GameOver,
  },
  data() {
    return {
      isGameover: false,
      isPause: false,
    };
  },
  activated() {
    // console.log("Activated", this.$store.state.session.gamemode);
  },
  mounted() {
    console.log("Mounted");
    setTimeout(() => {
      const game = new Game({
        canvasElement: document.getElementById("canvas1"),
        statsElement: document.getElementById("game1"),
      });

      setTimeout(() => {
        game.startGame();
      }, 1000);
    }, 1000);
  },
};
</script>

<style>
</style>