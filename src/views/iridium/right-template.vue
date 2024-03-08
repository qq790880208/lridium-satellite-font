<script setup lang="ts">
import { EChartsType } from "echarts";
import { markRaw, ref, shallowRef, toRefs, watch } from "vue";
import { getBarData, getLineData } from "@/api";
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import BaseChartInstance from "@/components/base-components/base-chart-instance.vue";
import EChartLine from "@/views/gps/main-template/ehcart-line.vue";
import EChartBar from "@/views/gps/main-template/ehcart-bar.vue"

interface lineData {
  AuthCount: number
  Precision: number
  errorRate: number
}

interface rightChartProps {
  lineListData: Array<lineData>
  barSingleData: Array<Array<number>>
}


const props = defineProps<rightChartProps>()

const { lineListData, barSingleData } = toRefs(props)



</script>

<template>
  <base-chart-background
    height="calc((100vh - 130px) / 2)"
    title="实时认证结果"
    width="auto"
  >
    <e-chart-line :data="lineListData"></e-chart-line>
  </base-chart-background>
  <base-chart-background
    height="calc((100vh - 130px) / 2)"
    title="历史认证结果"
    width="auto"
  >
    <e-chart-bar :data="barSingleData"></e-chart-bar>
  </base-chart-background>
</template>

<style lang="less"></style>
