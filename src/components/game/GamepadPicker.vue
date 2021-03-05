<template>
  <div v-if="gamepadIndex !== undefined">
    Pick gamepad
    <select v-model="gamepadIndex">
      <option
        v-for="gamepad in $store.state.gamepads.list"
        :key="gamepad.index"
        :value="gamepad.index"
        :selected="gamepadIndex === gamepad.index"
      >
        {{ gamepad.id }}
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
        if (typeof this.$store.state.gamepads[this.playerIndex] === "number")
          return this.$store.state.gamepads[this.playerIndex];
        else return undefined;
      },
      set(value) {
        this.$store.commit("gamepads/updateGamepadIndex", {
          playerIndex: this.playerIndex,
          gamepadIndex: value,
        });
      },
    },
  },
};
</script>

<style>
</style>