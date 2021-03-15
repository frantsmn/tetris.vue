<template>
  <div class="panel panel_stats">
    <p>stats</p>
    <div
      v-for="(value, index) in $store.state.game[playerIndex].blocks"
      :key="value"
      class="panel__stats-row"
    >
      <img
        :src="`./assets/game/svg/blocks/level_${
          $store.state.game[playerIndex].level % 10
        }/${index}.svg`"
        class="panel__block-image"
      />
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["playerIndex"],
};
</script>