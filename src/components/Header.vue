<template>
  <header class="header">
    <div class="header__left">
      <router-link to="/" class="btn">Home</router-link>
      <router-link to="/game/new" @click.prevent="toggleOverlay" class="btn"
        >New game</router-link
      >
      <router-link
        to="/game/settings"
        @click.prevent="toggleOverlay"
        class="btn"
        >Settings</router-link
      >
      <router-link to="/game/scores" @click.prevent="toggleOverlay" class="btn"
        >Scores</router-link
      >
      <router-link to="/game/help" @click.prevent="toggleOverlay" class="btn"
        >Help</router-link
      >
    </div>

    <div class="header__right">
      <button
        id="ControllerToggler"
        class="btn btn_green"
        title="Mobile controller"
      >
        + oo
      </button>
      <button id="SoundToggler" class="btn btn_green" title="Sound">
        {&#060;
      </button>
      <button id="FullScreenToggler" class="btn btn_green" title="Fullscreen">
        []
      </button>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    toggleOverlay(e) {
      if (this.$router.currentRoute.value.path === e.target.pathname) {
        this.$router.push("/game");
      } else {
        this.$router.push(e.target.pathname);
      }
    },
  },
};
</script>

<style>
</style>