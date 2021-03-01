<template>
  <main class="main">
    <Tetris />
    <Overlay />
  </main>
</template>

<script>
import Tetris from "@/components/game/Tetris.vue";
import Overlay from "@/components/Overlay.vue";

export default {
  components: {
    Tetris,
    Overlay,
  },
};
</script>