<template>
  <div class="overlay-gameover swiper-slide">
    <div class="content">
      <h2>GAME OVER</h2>
      <p>
        Your score:
        <span id="finalScore">0</span>
        <br />
        Enter your name
      </p>

      <div>
        <input id="nameInput" type="text" maxlength="8" placeholder="player" />
      </div>

      <button id="SaveScoreBtn" class="btn">Save score</button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>