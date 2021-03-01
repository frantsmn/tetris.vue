<template>
  <div>
    Pick gamepad
    <select v-model="activeGamepad">
      <option
        v-for="gamepad in $store.state.gamepads.gamepads"
        :key="gamepad.index"
        :value="gamepad.index"
      >
        {{ gamepad.id }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeGamepad: "",
    };
  },
  mounted() {
    // this.$store.subscribe((mutation, state) => {
    //   if (mutation.type === "gamepads/addGamepad") {
    //     console.log("PAYLOAD", mutation.payload);
    //   }
    // });
  },
};
</script>

<style>
</style>