<template>
  <div class="overlay">
    <div class="content">
      <h2>GAME OVER</h2>
      <p>
        Your score:
        <span>{{ $store.state.game.stats.score }}</span>
        <br />
        Enter your name
      </p>

      <div>
        <input id="nameInput" type="text" maxlength="8" placeholder="player" />
      </div>

      <button class="btn">Save score</button>
    </div>
  </div>
</template>