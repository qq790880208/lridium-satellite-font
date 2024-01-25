<script setup lang="ts">
import DynamicChart from "@/components/base-components/dynamic-chart.vue";
import BaseChartInstance from "@/components/base-components/base-chart-instance.vue";
import { shallowRef, toRefs, watch } from "vue";
import { EChartsType } from "echarts";
import { get } from 'lodash'
import { randomNumber } from "@/utils";


interface lineData {
  AuthCount: number
  Precision: number
  errorRate: number
}

interface lineChartProps {
  data: Array<lineData>
}

let chart: EChartsType;

const props = defineProps<lineChartProps>()

const { data } = toRefs(props)

const dataSet = shallowRef({});


const otherProps = shallowRef({
  "tooltip": { show: true, formatter: toolTipFormatter },
  "legend": { "top": 0, "show": true, textStyle: { color: '#FFFFFF' }, formatter: formatter  },
  "xAxis": { "type": "category", "name": "认证次数", "nameGap": 25, "nameLocation": "middle", axisLabel: { textStyle: { color: '#FFFFFF' } }, nameTextStyle: { color: '#FFFFFF' } },
  "yAxis": { "type": "value", "name": "百分比（%）", "nameLocation": "middle", "nameGap": 25, axisLabel: { textStyle: { color: '#FFFFFF' } } , nameTextStyle: { color: '#FFFFFF' } },
})

watch(() => data.value, (value) => {
  dataSet.value = {
    "source": value,
    "dimensions": ["AuthCount", "Precision", "errorRate"]
  }
  if(chart) {
    chart.setOption({
      dataset: dataSet.value
    })
  }
}, {
  immediate: true,
  deep: true
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
  return `认证次数: ${val.name}<br />${formatter(val.seriesName)}: ${getPercent(val)}%`
}

function getPercent(value: any) {
  return (value.value[value.seriesName] * 100).toFixed(3)
}

const handleChartInit = (val: EChartsType) => {
  chart = val;
  const option = Object.assign({}, {
    dataset: dataSet.value,
    series: new Array(2).fill({
      type: 'line',
      label: {
        show: true,
        formatter: (value: any) => `${getPercent(value)}%`
      },
      top: otherProps.value?.legend?.top + 30 || 0,
      // label: { show: chartType.value === 'line' }
    }),
    ...otherProps.value
  })
  chart.setOption(option);
};
</script>

<template>
  <base-chart-instance @init-cb="handleChartInit"></base-chart-instance>
<!--  <dynamic-chart :data-set="dataSet" :other-props="otherProps"></dynamic-chart>-->
</template>

<style lang="less"></style>
