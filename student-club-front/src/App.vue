<script setup lang="ts">
import Login from "./pages/login.vue";
import { useUserStore } from "@store";
const userStore = useUserStore();
userStore.refreshData();
</script>

<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
</style>
