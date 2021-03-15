<template>
  <div class="panel panel_info">
    <!-- <div>
      <p>top</p>
      <span id="topScoreStat">0</span>
    </div> -->
    <div>
      <p>score</p>
      <span>{{ $store.state.game[playerIndex].score }}</span>
    </div>
    <div>
      <p>next</p>
      <div class="panel__img-wrap">
        <svg
          class="panel__block-image"
          v-if="$store.state.game[playerIndex].nextBlock"
        >
          <use
            :xlink:href="`#${$store.state.game[playerIndex].nextBlock}-svg`"
          ></use>
        </svg>
      </div>
    </div>
    <div>
      <p>lines</p>
      <span>{{ $store.state.game[playerIndex].lines }}</span>
    </div>
    <div>
      <p>level</p>
      <span>{{ $store.state.game[playerIndex].level }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["playerIndex"],
};
</script>