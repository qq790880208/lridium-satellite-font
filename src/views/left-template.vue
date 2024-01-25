<script setup lang="ts">
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";
import animationData from "./animations/data.json";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/store/modules";

defineExpose({
  startAnimation
})

const refDiv = ref();
const percentage = ref(0);
const status = ref('');
const store = useStore();
const state = storeToRefs(store);
const oStepConsumesTime = state.allConsumesTime;
// const timeOut = ref(0);
let lottieInstance: AnimationItem;
let intervalId = -1;


onMounted(() => {
  lottieInstance = lottie.loadAnimation({
    container: refDiv.value,
    renderer: "svg",
    loop: true,
    autoplay: false,
    animationData: animationData
  });
});

onBeforeUnmount(() => {
  lottieInstance.destroy();
  clearInterval(intervalId);
})

function startAnimation(step: number, timeout: number, result = '') {
  modifyProcessStatus(step, timeout, result);
  modifyLottieStatus(step);
}

function modifyProcessStatus(step: number, timeout: number, result: string) {
  clearInterval(intervalId);
  status.value = result;
  if(step === 5) {
    percentage.value = 0;
    status.value = '';
  } else {
    intervalId = setInterval(() => {
      if(percentage.value < 100) {
        percentage.value ++
      }
    }, Math.floor((oStepConsumesTime.value) / 100));
  }
  // const percentageValue = step < 5 ? step * 25 : 100;
  // status.value = result;
  // intervalId = setInterval(() => {
  //   if(percentage.value < percentageValue) {
  //     percentage.value ++
  //   }
  // }, Math.floor(timeout / percentageValue));
  // timeOut.value = timeout;
}

function modifyLottieStatus(step: number) {
  // lottieInstance.stop();
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
      lottieInstance.playSegments([0, 0.001], true);
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
