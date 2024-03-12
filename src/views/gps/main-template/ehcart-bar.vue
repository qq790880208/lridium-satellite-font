<script setup lang="ts">
import BaseChartInstance from "@/components/base-components/base-chart-instance.vue";
import { EChartsType } from "echarts";
import { randomNumber } from "@/utils";
import { onMounted, toRefs, watch } from "vue";
interface data {
  id: string,
  result: boolean
}

interface resultData {
  id: string,
  resultSuccess: number
  resultFailure: number
}

interface barChartProps {
  data: Array<Array<number>>
}

const props = defineProps<barChartProps>()
const { data } = toRefs(props)

let chart: EChartsType;
// const data: Array<number> = [];

// onMounted(() => {});

const ids = new Array(32).fill(0).map((item, index) => index + 1);

let satelliteList: Array<resultData> = ids.map((item, index) => {
  return {
    id: item.toString(),
    resultSuccess: 0,
    resultFailure: 0,
  }
})



watch(() => data.value, (value) => {
  modifyResult()
}, {
  immediate: true,
  deep: true
})

// const resultSuccessList: Array<number> = new Array(66).fill(0)
// const resultFailureList: Array<number> = new Array(66).fill(0)

function getModifiedSatelliteList() {
  return satelliteList.map((item, index) => {
    return Object.assign({}, item, {
      resultSuccess: data.value?.[index]?.[0] || 0,
      resultFailure: data.value?.[index]?.[1] || 0
    })
  })
}

function modifyResult() {
  satelliteList = getModifiedSatelliteList();
  if(chart) {
    chart.setOption({
      series: [{
        name: '成功次数',
        type: 'bar',
        // emphasis: {
        //   focus: 'series'
        // },
        data: satelliteList.map(item => item.resultSuccess)
      }, {
        name: '失败次数',
        type: 'bar',
        // emphasis: {
        //   focus: 'series'
        // },
        data: satelliteList.map(item => item.resultFailure)
      }]
    })
  }
}


const handleChartInit = (val: EChartsType) => {
  chart = val;
  chart.setOption({
    tooltip: {
      show: true,
    },
    xAxis: [
      {
        type: 'category',
        data: satelliteList.map(item => item.id),
        name: "卫星ID",
        nameGap: 20,
        nameLocation: "middle",
        axisLabel: { textStyle: { color: '#FFFFFF' } },
        nameTextStyle: { color: '#FFFFFF' }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: "",
        nameGap: 25,
        nameLocation: "middle",
        axisLabel: { textStyle: { color: '#FFFFFF' } },
        nameTextStyle: { color: '#FFFFFF' }
      }
    ],
    series: [{
      name: '验证成功',
      type: 'bar',
      stack: 'result',
      emphasis: {
        focus: 'series'
      },
      data: satelliteList.map(item => item.resultSuccess)
    }, {
      name: '验证失败',
      type: 'bar',
      stack: 'result',
      emphasis: {
        focus: 'series'
      },
      data: satelliteList.map(item => item.resultFailure)
    }],
    dataZoom: [{
      type: "slider", // 滑动条型数据区域缩放组件
      show: true, // 是否显示组件(用于 x 轴使用)
      start: 0, // 数据窗口范围的起始百分比(范围是：0 ~ 100。表示 0% ~ 100%)
      end: 10, // 数据窗口范围的结束百分比(范围是：0 ~ 100。表示 0% ~ 100%)
      // height: 30, // 组件的高度(水平布局默认 30，竖直布局默认自适应)
      // handleSize: '30%', // 控制手柄的尺寸，可以是像素大小，也可以是相对于 dataZoom 组件宽度的百分比，默认跟 dataZoom 宽度相同
      handleStyle: {
        // color: '#fff', // 图形的颜色
        // borderColor: 'red', // 图形的描边颜色
        // borderWidth: 1, // 描边线宽。为 0 时无描边
        borderType: 'solid' // 描边类型 solid.实线(默认) dashed.虚线 dotted.点虚线
      }, // 两侧缩放手柄的样式配置
      showDataShadow: false, // 是否在 dataZoom-silder 组件中显示数据阴影。数据阴影可以简单地反应数据走势
      zoomLock: true
    }, {
      type: "inside", // 内置型数据区域缩放组件(即在坐标系内平移与缩放)
      start: 0, // 数据窗口范围的起始百分比(范围是：0 ~ 100。表示 0% ~ 100%)
      end: 100 // 数据窗口范围的结束百分比(范围是：0 ~ 100。表示 0% ~ 100%)
    }], // 区域缩放
  });
};
</script>

<template>
  <base-chart-instance @init-cb="handleChartInit"></base-chart-instance>
</template>

<style lang="less"></style>
