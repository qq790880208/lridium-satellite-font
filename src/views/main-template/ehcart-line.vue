<script setup lang="ts">
import DynamicChart from "@/components/base-components/dynamic-chart.vue";
import BaseChartInstance from "@/components/base-components/base-chart-instance.vue";
import { shallowRef, toRefs, watch } from "vue";
import { EChartsType } from "echarts";

interface lineData {
  AuthCount: number
  Precision: number
  errorRate: number
}

interface lineChartProps {
  data: Array<lineData>
}


const props = defineProps<lineChartProps>()

const { data } = toRefs(props)

const dataSet = shallowRef({} );

setTimeout(() => {
  dataSet.value = {
    "source": [],
    //   .map(item => {
    //   return {
    //     AuthCount: item.AuthCount,
    //     Precision: item.Precision * 100,
    //     errorRate: item.errorRate * 100
    //   }
    // }),
    "dimensions": ["AuthCount", "Precision", "errorRate"]
  }
}, 500)

const otherProps = shallowRef({})

watch(() => data.value, (val) => {
  dataSet.value = {
    "source": val,
    "dimensions": ["AuthCount", "Precision", "errorRate"]
  }
})

setTimeout(() => {
  otherProps.value = {
    "tooltip": { show: true, formatter: toolTipFormatter },
    "legend": { "top": 30, "show": true, textStyle: { color: '#FFFFFF' }, formatter: formatter  },
    "xAxis": { "type": "category", "name": "认证次数", "nameLocation": "middle", axisLabel: { textStyle: { color: '#FFFFFF' } }, nameTextStyle: { color: '#FFFFFF' } },
    "yAxis": { "type": "value", "name": "百分比（%）", "nameLocation": "middle", "nameGap": 25, axisLabel: { textStyle: { color: '#FFFFFF' } } , nameTextStyle: { color: '#FFFFFF' } },
    // "title": { "text": "实时回充", "textAlign": "auto", "left": "center" }
  }
})

function formatter(name: keyof lineData) {
  const english2Chinese = {
    AuthCount: '认证次数',
    Precision: '准确率',
    errorRate: '误报率'
  }
  return english2Chinese[name]
}
function toolTipFormatter(val: any) {
  // console.info(val)
  return `认证次数: ${val.name}<br />${formatter(val.seriesName)}: ${val.value[val.seriesName]}%`
}
</script>

<template>
  <dynamic-chart :data-set="dataSet" :other-props="otherProps"></dynamic-chart>
</template>

<style lang="less"></style>
