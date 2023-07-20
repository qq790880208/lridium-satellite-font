<script setup lang="ts">
import { ref } from "vue";
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import BaseChartInstance from "@/components/base-components/base-chart-instance.vue";
import { EChartsType } from "echarts";

const aComponentInfo = ref([
  {
    id: "1",
    name: "BaseChartInstance",
    height: "calc((100vh - 140px) / 3)",
    title: "持续时间",
    data: [],
    width: "410px",
  },
  {
    id: "2",
    name: "BaseChartInstance",
    height: "calc((100vh - 140px) / 3)",
    title: "IRA帧个数",
    data: [],
    width: "410px",
  },
  {
    id: "3",
    name: "BaseChartInstance",
    height: "calc((100vh - 140px) / 3)",
    title: "3D样本数",
    data: [],
    width: "410px",
  },
]);

const handleChartInit = (
  chart: EChartsType,
  data: chartDataset,
  otherOptions?: Record<string, any>
) => {
  chart.setOption({
    dataset: data,
    series: [{ type: "" }],
    ...otherOptions,
  });
};
</script>

<template>
  <template v-for="component of aComponentInfo" :key="component.id">
    <base-chart-background
      :height="component.height"
      :title="component.title"
      :width="component.width"
    >
      <component
        :is="component.name"
        @initCb="
          (chart) => {
            handleChartInit(chart, component.data as chartDataset);
          }
        "
      />
    </base-chart-background>
  </template>
</template>

<style lang="less"></style>
