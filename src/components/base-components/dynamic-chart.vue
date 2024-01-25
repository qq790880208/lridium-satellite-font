<template>
	<div ref="dynamicChart" class="dynamic-chart"></div>
</template>

<script setup>
import * as Echart from 'echarts'
import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'
import { debounce as _debounce } from 'lodash'

const props = defineProps({
  dataSet: {
    type: Object,
    // default: () => ({
    //   dimensions: [],
    //   source: []
    // })
  },
  chartType: {
    type: String,
    default: 'line'
  },
  otherProps: {
    type: Object,
  },
  title: {
    type: String
  }
})

const { chartType, dataSet, otherProps } = toRefs(props)
const dynamicChart = ref(null)
let myChart = null
let option = null

onMounted(() => {
  myChart = Echart.init(dynamicChart.value)
  // myChart.init(option)
})

const handleChartResize = _debounce(() => {
 myChart?.resize()
}, 300)
window.addEventListener('resize', handleChartResize)

onBeforeUnmount(() => {
  myChart?.dispose()
  window.removeEventListener('resize', handleChartResize)
})

watch(() => dataSet.value, () => {
  myChart?.clear()
  // 长度需要减去y轴的维度，故-1
  const dimensionsLength = chartType.value === 'line' ?
      dataSet.value?.dimensions?.length - 1 || 0 :
      dataSet.value?.dimensions?.length
  option = Object.assign({}, {
    dataset: dataSet.value,
    series: new Array(dimensionsLength).fill({
      type: chartType.value,
      label: otherProps.value?.label || {
        show: true
      },
      top: otherProps.value?.legend?.top + 30 || 0,
      // label: { show: chartType.value === 'line' }
    }),
    ...otherProps.value
  })
  myChart?.setOption(option, { lazyUpdate: true })
})

</script>

<style lang="less" scoped>
.dynamic-chart {
  width: 100%;
  height: 36vh;
}
</style>
