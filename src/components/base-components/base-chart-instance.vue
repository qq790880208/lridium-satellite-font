<template>
  <div class="chart-frame" ref="chartFrameRef" />
</template>

<script lang="ts" setup>
import { init as echartsInit, EChartsType } from "echarts";
import {
  onMounted,
  ref,
  Ref,
  defineExpose,
  defineEmits,
  onBeforeUnmount,
} from "vue";

defineExpose({
  init,
});

const emits = defineEmits<{ (e: "initCb", v: EChartsType): void }>();

let chart: EChartsType;
let resizeObserver: ResizeObserver;
const chartFrameRef: Ref<HTMLElement | null> = ref(null);

onMounted(() => {
  init();
  initResizeObserver();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

function init(): void {
  chart = echartsInit(chartFrameRef.value as HTMLElement);
  emits("initCb", chart);
}

function initResizeObserver(): void {
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(chartResize);
    resizeObserver.observe(chartFrameRef.value as HTMLElement);
  }
}

function chartResize() {
  chart.resize();
}
</script>

<style lang="less">
.chart-frame {
  width: 100%;
  height: 100%;
}
</style>
