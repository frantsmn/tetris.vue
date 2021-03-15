<template>
  <div class="panel panel_stats">
    <p>stats</p>
    <div
      v-for="(value, index) in $store.state.game[playerIndex].blocks"
      :key="value"
      class="panel__stats-row"
    >
      <svg class="panel__block-image">
        <use :xlink:href="`#${index}-svg`"></use>
      </svg>
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["playerIndex"],
};
</script>