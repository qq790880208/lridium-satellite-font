<script setup lang="ts">
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";
import animationData from "./animations/data.json";
import { onBeforeUnmount, onMounted, ref } from "vue";

const refDiv = ref();
let lottieInstance: AnimationItem

onMounted(() => {
  lottieInstance = lottie.loadAnimation({
    container: refDiv.value,
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: animationData
  });
  // setInterval(() => {
  //   lottieInstance.playSegments([0, 25], true)
  // }, 3000)
  // setInterval(() => {
  //   lottieInstance.playSegments([25, 37.5], true)
  // }, 3000)
});

onBeforeUnmount(() => {
  lottieInstance.destroy()
})


</script>

<template>
  <base-chart-background
    height="calc(100vh - 130px)"
    title="模型示意"
    width="410px"
  >
    <div ref="refDiv" class="left-animation"></div>
    <div class="left-progress">
      <el-progress
        :percentage="100"
        :stroke-width="15"
        status="success"
        striped
        striped-flow
        :duration="10"
      />
    </div>

    <!--      <three-component></three-component>-->
  </base-chart-background>
</template>

<style lang="less">
.left-animation {
  height: 100%;
  width: 100%;
}
.left-progress {
  bottom: 15px;
  position: absolute;
  width: 100%;
}
</style>
