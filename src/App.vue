<template>
  <div id="nav" style="position: fixed; bottom: 0">
    <router-link to="/">Start</router-link> | 
    <router-link to="/game">Game</router-link> | 
    <router-link to="/about">About</router-link>
  </div>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script>
export default {};
</script>

<style>
.fade-enter-active {
  transition: opacity 0.3s ease;
  position: absolute;
}
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
