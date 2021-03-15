<template>
  <div class="panel-overlay panel-overlay_gameover">
    <p class="panel-overlay__title">GAME OVER</p>
    <p>
      Your score:
      <span>{{ $store.state.game[playerIndex].score }}</span>
    </p>

    <!-- <p>Enter your name</p>
    <input class="input" placeholder="noname" />
    <button class="btn">Save score</button> -->

  </div>
</template>

<script>
export default {
  props: ["playerIndex"],
};
</script>