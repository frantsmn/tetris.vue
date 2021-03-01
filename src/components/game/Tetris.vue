<template>
  <div class="game-container" :class="$store.state.session.gamemode">
    <div ref="game" class="game">
      <StatsPanel />
      <GlassPanel />
      <InfoPanel />
      <StatusPanel />

      <Pause v-if="isPause" />
      <GameoverOverlay v-if="isGameover" />
    </div>
  </div>
</template>

<script>
import StatsPanel from "./StatsPanel";
import GlassPanel from "./GlassPanel";
import InfoPanel from "./InfoPanel";
import StatusPanel from "./StatusPanel";

import Pause from "./Pause.vue";
import GameoverOverlay from "./GameoverOverlay.vue";

import AssetsLoader from "@/game/assetsLoader";
import Tetris from "@/game/tetris";

export default {
  components: {
    StatsPanel,
    GlassPanel,
    InfoPanel,
    StatusPanel,
    Pause,
    GameoverOverlay,
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
  async mounted() {
    const loader = new AssetsLoader();
    const game = new Tetris({
      canvasElement: this.$refs.game.querySelector("canvas"),
      $store: this.$store,
    });

    await loader.loadAssets();
    game.startGame({
      level: this.$store.state.game.level,
    });
  },
};
</script>