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

watch(() => dataSet.value, (value) => {
  if(chart) {
    // console.info(value)
    chart.setOption({
      dataset: {
        dimensions: ["Quadrature", "In-phase","Layer",  'Color'],
        source: value,
      },
    })
  }
})

const handleChartInit = (val: EChartsType) => {
  chart = val;
  chart.setOption({
    dataset: {
      dimensions: [ "Quadrature", "In-phase","Layer", 'Color'],
      source: [],
      // source: [
      //   [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10), randomNumber(100, 255)],
      //   [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
      //   [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
      //   [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
      //   [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
      //   [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
      //   [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
      //   [randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10), randomNumber(1, 10)],
      // ],
    },
    visualMap: {
      type: "piecewise",
      show: false,
      pieces: [
        { lte: 0, color: "#336882", colorAlpha: 0 },
        { gt: 0, lte: 10, color: "#b5e4ff", colorAlpha: 0.2 },
        { gt: 10, lte: 20, color: "#d7ffcf", colorAlpha: 0.4 },
        { gt: 20, lte: 60, color: "#ffcf78", colorAlpha: 0.6 },
        { gt: 30, color: "#ffb79a", colorAlpha: 0.8 },
        // { gt: 80, lte: 100, color: "#ffb79a", colorAlpha: 1 },
      ],
      textStyle: {
        color: '#FFFFFF'
      }
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
        distance: 160,
        alpha: -70,
        beta: 90,
        center: [10, 0, 10],
        // autoRotate: true
      },
    },
    series: [
      {
        type: "scatter3D",
        symbol: "circle",
        symbolSize: 6
      },
    ],
  });
};
</script>

<template>
  <base-chart-instance @init-cb="handleChartInit"></base-chart-instance>
</template>

<style lang="less"></style>
