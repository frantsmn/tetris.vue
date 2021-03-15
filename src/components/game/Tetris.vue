<template>
  <div class="game-container" :class="this.$store.state.game.mode">
    <div ref="player1" class="game">
      <StatsPanel :playerIndex="1" />
      <GlassPanel :playerIndex="1" />
      <InfoPanel :playerIndex="1" />
      <StatusPanel :playerIndex="1" />
    </div>

    <div
      ref="player2"
      class="game"
      v-if="this.$store.state.game.mode !== 'single'"
    >
      <StatsPanel :playerIndex="2" />
      <GlassPanel :playerIndex="2" />
      <InfoPanel :playerIndex="2" />
      <StatusPanel :playerIndex="2" />
    </div>
  </div>
</template>

<script>
import StatsPanel from "./StatsPanel";
import GlassPanel from "./GlassPanel";
import InfoPanel from "./InfoPanel";
import StatusPanel from "./StatusPanel";

export default {
  components: {
    StatsPanel,
    GlassPanel,
    InfoPanel,
    StatusPanel,
  },
  async mounted() {
    this.$store.dispatch("game/createGame", {
      canvasElement1: this.$refs.player1.querySelector("canvas"),
      canvasElement2: this.$refs.player2?.querySelector("canvas"),
    });

    this.$store.dispatch("game/startNewGame");

    // Tetris animation
    this.$store.subscribe((mutation) => {
      if (mutation.type === "game/tetrisAnimation") {
        const node = this.$refs[`player${mutation.payload.playerIndex}`];
        node.classList.add("tetris-animation");
        setTimeout(() => node.classList.remove("tetris-animation"), 400);
      }
    });
  },
};
</script>