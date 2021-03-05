<template>
  <div class="panel panel_status">
    <GamepadPicker :playerIndex="playerIndex" />
  </div>
</template>

<script>
import GamepadPicker from "./GamepadPicker";
export default {
  components: {
    GamepadPicker,
  },
  props: ["playerIndex"],
};
</script>