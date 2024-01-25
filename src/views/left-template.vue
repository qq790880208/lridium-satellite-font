<script setup lang="ts">
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";
import animationData from "./animations/data.json";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Ref } from "vue";

defineExpose({
  startAnimation
})

const refDiv = ref();
const percentage = ref();
const status = ref('');
const timeOut = ref(0);
let lottieInstance: AnimationItem;

const progressDuration = computed(() => Math.floor(percentage.value / timeOut.value))

onMounted(() => {
  lottieInstance = lottie.loadAnimation({
    container: refDiv.value,
    renderer: "svg",
    loop: true,
    autoplay: false,
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

function startAnimation(step: number, timeout: number, result = '') {
  console.info(step);
  console.info(timeout);
  modifyProcessStatus(step, timeout, result);
  modifyLottieStatus(step);
}

function modifyProcessStatus(step: number, timeout: number, result: string) {
  percentage.value = step < 5 ? step * 25 : 100;
  status.value = result;
  timeOut.value = timeout;
}

function modifyLottieStatus(step: number) {
  switch (step) {
    case 1:
      lottieInstance.playSegments([0, 25], true);
      break;
    case 2:
      lottieInstance.playSegments([25, 37.5], true);
      break;
    case 3:
    case 4:
      lottieInstance.playSegments([37.5, 50], true);
      break;
    default:
      lottieInstance.stop();
      break;
  }
}


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
        indeterminate
        :percentage="percentage"
        :stroke-width="15"
        :status="status"
        striped
        striped-flow
        :duration="progressDuration"
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
