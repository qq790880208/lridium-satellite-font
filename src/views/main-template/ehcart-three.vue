<script setup lang="ts">
import BaseChartInstance from "@/components/base-components/base-chart-instance.vue";
import { EChartsType } from "echarts";
import { randomNumber } from "@/utils";
import { onMounted, toRefs, watch } from "vue";

let chart: EChartsType;
// const data: Array<number> = [];

// onMounted(() => {});

interface threeChartProps {
  dataSet: number[][]
}

const props = defineProps<threeChartProps>()

const { dataSet } = toRefs(props)

watch(() => dataSet.value, (val) => {
  if(chart) {
    chart.setOption({
      dataset: {
        dimensions: ["Q", "I", "Time"],
        source: val,
      },
    })
  }
})

const handleChartInit = (val: EChartsType) => {
  console.info("handleChartInit");
  chart = val;
  chart.setOption({
    dataset: {
      dimensions: ["Q", "I", "Time"],
      source: [
        [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
        [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
        [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
        [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
        [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
        [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
        [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
        [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
      ],
    },
    visualMap: {
      type: "piecewise",
      pieces: [
        { lte: 0, color: "#336882", colorAlpha: 0.3 },
        { gt: 0, lte: 10, color: "#b5e4ff", colorAlpha: 0.5 },
        { gt: 10, lte: 50, color: "#d7ffcf", colorAlpha: 0.6 },
        { gt: 50, lte: 100, color: "#ffcf78", colorAlpha: 0.8 },
        { gt: 100, lte: 255, color: "#ffb79a", colorAlpha: 1 },
      ],
    },
    tooltip: {
      show: true,
    },
    xAxis3D: {
      name: "In-phase",
      type: "value",
    },
    yAxis3D: {
      name: "Quadrature",
      type: "value",
    },
    zAxis3D: {
      name: "Layer",
      type: "value",
    },
    grid3D: {
      axisLine: {
        lineStyle: { color: "#fff" },
      },
      axisPointer: {
        lineStyle: { color: "#fff" },
      },
      viewControl: {
        // autoRotate: true
      },
    },
    series: [
      {
        type: "scatter3D",
        symbol: "circle",
      },
    ],
  });
};
</script>

<template>
  <base-chart-instance @init-cb="handleChartInit"></base-chart-instance>
</template>

<style lang="less"></style>
