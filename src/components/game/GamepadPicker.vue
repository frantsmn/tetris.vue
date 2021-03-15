<template>
  <div>
    Pick gamepad
    <select v-model="gamepadIndex">
      <option
        v-for="gamepad in $store.state.controls.list"
        :key="gamepad.index"
        :value="gamepad.index"
        :selected="gamepadIndex === gamepad.index"
      >
        [{{ gamepad.index }}] {{ gamepad.id }}
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
        if (typeof this.$store.state.controls[this.playerIndex] === "number")
          return this.$store.state.controls[this.playerIndex];
        else return undefined;
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