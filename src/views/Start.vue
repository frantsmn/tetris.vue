<template>
  <div class="container">
    <h1><span style="font-size: 1.8em">Tetris</span>.js</h1>
    <p>{{ $store.state.loader.progress }}</p>
    <button class="btn" @click="setGamemode('single')">1 player</button>
    <button class="btn" @click="setGamemode('pvp_local')">
      2 player local
    </button>
    <button class="btn" @click="setGamemode('pvp_internet')">
      2 player internet
    </button>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("loader/preloadAssets");
    this.$store.commit("controls/init");
  },
  methods: {
    setGamemode(mode) {
      this.$store.commit("game/setMode", mode);
      this.$router.push("/game");
    },
  },
};
</script>