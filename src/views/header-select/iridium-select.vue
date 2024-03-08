<script setup lang="ts">
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, ref } from "vue";
import { CircleCloseFilled, SuccessFilled } from "@element-plus/icons-vue";
import { useStore } from "@/store/modules";
import { useRouter } from "vue-router";

dayjs.extend(isoWeek);

const time = ref(dayjs().format("HH:mm:ss"));

const store = useStore();

const state = storeToRefs(store);

const router = useRouter();

const frameStatus = state.frameStatus;

const depth = state.depth;

const channel = state.channel;

const aDepthList = ref([
  {
    id: 1,
    label: 1,
    value: 1
  },
  {
    id: 2,
    label: 3,
    value: 3
  },
  {
    id: 2,
    label: 4,
    value: 4
  },
  {
    id: 4,
    label: 5,
    value: 5
  },
  {
    id: 5,
    label: 7,
    value: 7
  }
]);

const handleStartClick = () => {
  store.start();
};

const handleEndClick = () => {
  store.stop();
};
</script>

<template>
  <div class="app-iridium__select">
    <span class="app-header__desc">选择深度</span>
    <el-select
      :model-value="depth"
      placeholder="请选择数据深度"
      style="margin: 0 10px 0 0"
      :disabled="frameStatus !== 'stopped'"
      @change="store.changeDepth"
    >
      <el-option
        v-for="depth of aDepthList"
        :key="depth.id"
        :value="depth.value"
        :label="depth.label"
      ></el-option>
    </el-select>
    <el-button
      type="primary"
      :icon="SuccessFilled"
      :loading="frameStatus === 'pending'"
      :disabled="frameStatus !== 'stopped' || !depth"
      @click="handleStartClick"
    >开始
    </el-button>
    <el-button
      type="success"
      :icon="CircleCloseFilled"
      :disabled="frameStatus === 'stopped'"
      @click="handleEndClick"
    >结束
    </el-button>
  </div>
</template>

<style lang="less">
.app-iridium__select {
  right: 260px;
  position: absolute;
}
</style>
