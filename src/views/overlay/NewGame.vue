<template>
  <div class="overlay">
    <div class="overlay__header">
      <p class="overlay__title">Start new game</p>
    </div>
    <div class="overlay__body">
      <button class="btn" @click="setGamemode('single')">1 player</button>
      <button class="btn" @click="setGamemode('pvp_local')">
        2 player local
      </button>
      <button class="btn" @click="setGamemode('pvp_internet')">
        2 player internet
      </button>

      <p>Pick level</p>

      <p>
        <select v-model="$store.state.game[1].level">
          <option v-for="index in 20" :value="index - 1" :key="index - 1">
            {{ index - 1 }}
          </option>
        </select>
      </p>
    </div>
    <!-- <button id="SaveGameBtn" class="btn">Save game</button> -->
  </div>
</template>

<script>
export default {
  methods: {
    setGamemode(mode) {
      this.$store.commit("game/setMode", mode);
      this.$store.dispatch("game/startNewGame", {
        playerIndex: 1,
      });

      this.$router.push("/game");
    },
  },
};
</script>