<script setup lang="ts">
import { EChartsType } from "echarts";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { useStore } from "@/store/modules";
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import Echart from "@/views/main-template/ehcart-3D.vue";
import SwiperDepth from "@/views/main-template/swiper-depth.vue";
import WebTerminal from "@/views/main-template/web-terminal.vue";
import VerifyResult from "@/views/main-template/verify-result.vue";

const store = useStore();

const state = storeToRefs(store);

const dosText = ref("测试开始");

const currentFrameList = reactive({
  value: "",
});

const oShowList = reactive({
  img: true,
  dos: false,
  depth: false,
  chart: false,
  result: false,
});

const aComponentInfo = ref([
  {
    id: "1",
    name: "BaseChartInstance",
    height: "calc((100vh - 118px))",
    title: "持续时间",
    data: [],
    width: "100%",
  },
]);

computed(() => {
  return currentFrameList;
});

// watch(state.frameList, () => {});

watch(state.frameStatus, (value) => {
  if (value === "stopped") {
    stop();
  } else {
    play();
  }
});

const play = () => {
  console.info("play");
  // currentFrameList.value = store.remove();
  oShowList.img = false;
  oShowList.dos = true;
  oShowList.depth = true;
  oShowList.chart = true;
};

const stop = () => {
  console.info("stop");
};

const clearDisplayStatus = () => {
  oShowList.depth = false;
  oShowList.chart = false;
  oShowList.result = false;
};

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
      class="main-template"
      :height="component.height"
      :title="component.title"
      :width="component.width"
    >
      <img class="main-template__image" v-show="oShowList.img" alt="" src="" />
      <transition name="el-fade-in">
        <div class="main-template__block" v-show="oShowList.dos">
          <web-terminal :data="dosText"></web-terminal>
        </div>
      </transition>
      <div class="main-template__block">
        <transition name="el-fade-in">
          <swiper-depth v-show="oShowList.depth"></swiper-depth>
        </transition>
      </div>
      <div class="main-template__block">
        <transition name="el-fade-in">
          <verify-result v-show="oShowList.result"></verify-result>
        </transition>
      </div>
      <div class="main-template__block">
        <transition name="el-fade-in">
          <echart v-show="oShowList.chart"></echart>
        </transition>
      </div>
    </base-chart-background>
  </template>
</template>

<style lang="less">
.main-template {
  &__image {
    height: 100%;
    width: 100%;
  }
  &__block {
    margin: 25px;
    position: relative;
    height: calc(50% - 50px);
    width: calc(50% - 50px);
    z-index: 2;
  }
}
</style>
