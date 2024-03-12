<script setup lang="ts">
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { CircleCloseFilled, SuccessFilled } from "@element-plus/icons-vue";
import { useStore } from "@/store/modules";
import { useRouter } from "vue-router";

dayjs.extend(isoWeek);

const time = ref(dayjs().format("HH:mm:ss"));
const date = ref(dayjs().format("YYYY-MM-DD"));
const weekDay = ref(dayjs().format("dddd"));

const store = useStore();

const state = storeToRefs(store);

const router = useRouter();

const frameStatus = state.GPSFrameStatus;

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

const aChannelList = new Array(8).fill(0).map((item, index) => index + 1);

const handleStartClick = () => {
  store.startGPS();
};

const handleEndClick = () => {
  store.stopGPS();
};
</script>

<template>
  <div class="app-gps__select">
    <div>
      <div>
        <span class="app-gps__select__desc">选择前导码数量</span>
        <el-select
          :model-value="depth"
          placeholder="请选择前导码数量"
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
      </div>
      <div>
        <span class="app-gps__select__desc">选择channel个数</span>
        <el-select
          :model-value="channel"
          placeholder="请选择channel个数"
          style="margin: 0 10px 0 0"
          :disabled="frameStatus !== 'stopped'"
          @change="store.changeChannel"
        >
          <el-option
            v-for="channel of aChannelList"
            :key="channel"
            :value="channel"
            :label="channel"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div>
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
  </div>
</template>

<style lang="less">
.app-gps__select {
  align-items: center;
  display: flex;
  right: 260px;
  line-height: 35px;
  position: absolute;
  &__desc {
    display: inline-block;
    color: #FFFFFF;
    width: 100px;
    font-size: 12px;
  }
  .el-select {
    top: 0 !important;
  }
  .el-button {
    top: 0 !important;
  }
}
</style>
