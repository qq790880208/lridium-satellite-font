<script setup lang="ts">
import CustomHeader from "@/views/custom-header.vue";
</script>

<template>
  <img alt="" src="@/assets/app-bg.png" class="img-bg" />
  <custom-header></custom-header>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<style lang="less">
.img-bg {
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}
</style>
