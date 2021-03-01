<template>
  <div class="panel panel_stats">
    <p>stats</p>
    <div
      v-for="(value, key) in $store.state.game.stats.blocks"
      :key="key"
      class="panel__stats-row"
    >
      <img
        :src="`./assets/game/svg/blocks/level_${
          $store.state.game.level % 10
        }/${key}.svg`"
        class="panel__block-image"
      />
      <span>{{ value }}</span>
    </div>
  </div>
</template>