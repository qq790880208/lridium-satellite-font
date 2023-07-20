<script setup lang="ts">
import CustomHeader from "@/views/custom-header.vue";
// import LeftTemplate from "@/views/left-template.vue";
import MainTemplate from "@/views/main-template.vue";
import RightTemplate from "@/views/right-template.vue";
</script>

<template>
  <img alt="" src="@/assets/app-bg.png" class="img-bg" />
  <custom-header></custom-header>
  <main class="app-main">
    <!--aside class="app-main__left">
      <left-template></left-template>
    </aside-->
    <main class="app-main__body"><main-template></main-template></main>
    <aside class="app-main__right">
      <right-template></right-template>
    </aside>
  </main>
</template>

<style lang="less">
.img-bg {
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}
.app {
  &-main {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url("~@/assets/app-bg-wave.png"),
      url("~@/assets/main-bg-line.png");
    display: flex;
    height: calc(100vh - 70px);
    // padding: 20px 29px;
    &__body {
      padding: 0 29px;
      flex: 1 0 50%;
    }
    &__left {
      background: url("~@/assets/main-bg-left.png") no-repeat;
      background-size: cover;
      // left: 0;
    }
    &__right {
      background: url("~@/assets/main-bg-right.png") no-repeat;
      background-size: cover;
      // right: 0;
    }

    &__body,
    &__right,
    &__left {
      padding: 20px 0 20px 29px;
      z-index: 2;
    }

    &__right,
    &__left {
      padding: 20px 29px;
    }
  }
}
</style>
