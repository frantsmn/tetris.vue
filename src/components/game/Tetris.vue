<template>
  <div class="game-container" :class="this.$store.state.session.gamemode">
    <div ref="game" class="game">
      <StatsPanel />
      <GlassPanel />
      <InfoPanel />
      <StatusPanel :playerIndex="1" />

      <PauseOverlay v-if="$store.state.game.isPaused" />
      <GameoverOverlay v-if="$store.state.game.isGameover" />
    </div>
  </div>
</template>

<script>
import StatsPanel from "./StatsPanel";
import GlassPanel from "./GlassPanel";
import InfoPanel from "./InfoPanel";
import StatusPanel from "./StatusPanel";

import PauseOverlay from "./PauseOverlay";
import GameoverOverlay from "./GameoverOverlay";

import AssetsLoader from "@/game/assetsLoader";
import Tetris from "@/game/tetris";

export default {
  components: {
    StatsPanel,
    GlassPanel,
    InfoPanel,
    StatusPanel,
    PauseOverlay,
    GameoverOverlay,
  },
  async mounted() {
    const loader = new AssetsLoader();
    await loader.loadAssets();

    const game = new Tetris({
      playerIndex: 1,
      canvasElement: this.$refs.game.querySelector("canvas"),
      $store: this.$store,
    });
    game.startGame({
      level: this.$store.state.game.level,
    });

    this.$store.subscribe((mutation) => {
      if (mutation.type === "game/tetrisAnimation") {
        this.$el.classList.add("tetris-animation");
        setTimeout(() => this.$el.classList.remove("tetris-animation"), 400);
      }
    });
  },
};
</script>