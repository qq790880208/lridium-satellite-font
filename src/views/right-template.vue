<script setup lang="ts">
import { EChartsType } from "echarts";
import { markRaw, ref, shallowRef, toRefs, watch } from "vue";
import { getBarData, getLineData } from "@/api";
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import BaseChartInstance from "@/components/base-components/base-chart-instance.vue";
import EChartLine from "@/views/main-template/ehcart-line.vue";
import EChartBar from "@/views/main-template/ehcart-bar.vue"

interface rightChartProps {
  lineData: Array<lineData>
  barSingleData: barSingleData
}

interface lineData {
  AuthCount: number
  Precision: number
  errorRate: number
}

const props = defineProps<rightChartProps>()

const { lineData, barSingleData } = toRefs(props)


const aComponentInfo = ref([
  {
    id: "1",
    component: markRaw(EChartLine),
    name: 'line',
    height: "calc((100vh - 130px) / 2)",
    title: "认证次数",
    data: lineData.value,
    width: "410px",
  },
  {
    id: "2",
    component: markRaw(EChartBar),
    name: 'bar',
    height: "calc((100vh - 130px) / 2)",
    title: "IRA帧个数",
    data: barSingleData.value,
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
        :ref="component.name"
        :is="component.component"
        :data="component.data"
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
