<template>
  <div class="panel panel_info">
    <!-- <div>
      <p>top</p>
      <span id="topScoreStat">0</span>
    </div> -->
    <div>
      <p>score</p>
      <span>{{ $store.state.game.stats.score }}</span>
    </div>
    <div>
      <p>next</p>
      <div class="panel__img-wrap">
        <img
          v-if="$store.state.game.stats.nextBlock"
          class="panel__block-image"
          :src="`./assets/game/svg/blocks/level_${
            $store.state.game.level % 10
          }/${$store.state.game.stats.nextBlock}.svg`"
        />
      </div>
    </div>
    <div>
      <p>lines</p>
      <span>{{ $store.state.game.stats.lines }}</span>
    </div>
    <div>
      <p>level</p>
      <span>{{ $store.state.game.level }}</span>
    </div>
  </div>
</template>