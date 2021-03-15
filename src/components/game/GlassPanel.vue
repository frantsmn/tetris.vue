<template>
  <div class="panel panel_glass">
    <canvas width="200" height="400"></canvas>

    <PauseOverlay
      :playerIndex="playerIndex"
      v-if="$store.state.game[playerIndex].isPaused"
    />
    <GameoverOverlay
      :playerIndex="playerIndex"
      v-if="$store.state.game[playerIndex].isGameover"
    />
  </div>
</template>

<script>
import PauseOverlay from "./PauseOverlay";
import GameoverOverlay from "./GameoverOverlay";

export default {
  components: {
    PauseOverlay,
    GameoverOverlay,
  },
  props: ["playerIndex"],
};
</script>