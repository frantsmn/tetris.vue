<template>
  <div>
    Pick gamepad
    <select v-model="gamepadIndex">
      <option
        v-for="device in $store.state.controls.deviceList"
        :key="device.index"
        :value="device.index"
        :selected="gamepadIndex === device.index"
      >
        [{{ device.index % 100 }}] {{ device.id }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: ["playerIndex"],
  computed: {
    gamepadIndex: {
      get() {
        return this.$store.state.controls[this.playerIndex].deviceIndex;
      },
      set(value) {
        this.$store.commit("controls/updateGamepadIndex", {
          playerIndex: this.playerIndex,
          gamepadIndex: value,
        });
      },
    },
  },
};
</script>