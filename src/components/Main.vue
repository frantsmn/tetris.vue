<template>
  <main class="main">
    <Game />
    <Overlay />
  </main>
</template>

<script>
import Game from "@/components/game/Game.vue";
import Overlay from "@/components/Overlay.vue";

export default {
  components: {
    Game,
    Overlay,
  },
};
</script>

<style>
</style>