<template>
  <div>
    <Header />
    <Main />
    <Controller />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Main from "@/components/Main.vue";
import Controller from "@/components/Controller.vue";

export default {
  name: "Game",
  components: {
    Header,
    Main,
    Controller,
  },
};
</script>
