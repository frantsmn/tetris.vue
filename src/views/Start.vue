<template>
  <div class="container">
    <h1><span style="font-size: 1.8em">Tetris</span>.js</h1>
    <button class="btn" @click="setGamemode('single')">1 player</button>
    <button class="btn" @click="setGamemode('pvp_local')">2 player local</button>
    <button class="btn" @click="setGamemode('pvp_internet')">2 player internet</button>
  </div>
</template>

<script>
export default {

  methods: {
    setGamemode(mode) {
      this.$store.commit("session/setGamemode", mode);
      this.$router.push("/game");
    },
  },
};
</script>

<style>
</style>