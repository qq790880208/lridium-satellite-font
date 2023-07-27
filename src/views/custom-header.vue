<script setup lang="ts">
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref } from "vue";
import { SuccessFilled, CircleCloseFilled } from "@element-plus/icons-vue";
import { useStore } from "@/store/modules";

dayjs.extend(isoWeek);

const time = ref(dayjs().format("HH:mm:ss"));
const date = ref(dayjs().format("YYYY-MM-DD"));
const weekDay = ref(dayjs().format("dddd"));

const store = useStore();

const state = storeToRefs(store);

const frameStatus = state.frameStatus;

const depth = ref<number>();

const selectMenuID = ref(1);

const aMenuList = ref([
  {
    id: 1,
    name: "数据大屏",
  },
  {
    id: 2,
    name: "菜单1",
  },
  {
    id: 4,
    name: "菜单2",
  },
  {
    id: 5,
    name: "菜单3",
  },
]);

const aDepthList = ref([
  {
    id: 1,
    label: 1,
    value: 1,
  },
  {
    id: 2,
    label: 3,
    value: 3,
  },
  {
    id: 4,
    label: 5,
    value: 5,
  },
  {
    id: 5,
    label: 7,
    value: 7,
  },
]);
const clock = () => {
  time.value = dayjs().format("HH:mm:ss");
};

const intervalId = setInterval(clock, 1000);

onBeforeUnmount(() => {
  intervalId && clearInterval(intervalId);
});

const handleMenuClick = (val: number) => {
  console.info(val);
};
const handleStartClick = () => {
  store.start();
};

const handleEndClick = () => {
  store.stop();
};
</script>

<template>
  <header class="app-header">
    <p class="app-header__title">可视化平台</p>
    <div
      class="app-header__menu"
      v-for="menu of aMenuList"
      :key="menu.id"
      :class="{ active: menu.id === selectMenuID }"
      @click="handleMenuClick(menu.id)"
    >
      <span>{{ menu.name }}</span>
    </div>
    <el-select
      v-model="depth"
      placeholder="请选择数据深度"
      style="margin: 0 10px 0 0"
      :disabled="frameStatus !== 'stopped'"
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
      >开始</el-button
    >
    <el-button
      type="success"
      :icon="CircleCloseFilled"
      :disabled="frameStatus === 'stopped'"
      @click="handleEndClick"
      >结束</el-button
    >
    <div class="app-header__right">
      <p class="app-header__right__time">{{ time }}</p>
      <div class="app-header__right__date">
        <p>{{ weekDay }}</p>
        <p>{{ date }}</p>
      </div>
    </div>
  </header>
</template>

<style lang="less">
.app {
  &-header {
    align-items: baseline;
    background: url("~@/assets/header-bg.png") no-repeat;
    background-size: 100% 90%;
    display: flex;
    height: 70px;
    line-height: 70px;
    position: relative;
    z-index: 2;
    &__title {
      background: linear-gradient(0deg, #1dd4ff 8%, #ffffff 99%);
      background-clip: text;
      -webkit-text-fill-color: #00000000;
      font-size: 34px;
      margin: 0;
      text-align: center;
      width: 33%;
    }
    &__menu {
      cursor: pointer;
      font-size: 20px;
      color: #1dd4ff;
      margin: 0 43px 0 0;
      span {
        position: relative;
        top: 5px;
      }
      &:hover,
      &.active {
        color: #fdb504;
      }
    }
    &__button {
    }
    &__right {
      align-self: end;
      display: flex;
      margin-left: auto;
      &__time {
        font-size: 30px;
        line-height: 40px;
        margin: 0 10px 0 0;
      }

      &__date {
        line-height: 20px;
        margin: 0 29px 0 0;
        p {
          margin: 0;
        }
      }
      &__date,
      &__time {
        color: #1dd4ff;
      }
    }

    .el-select {
      position: relative;
      top: 3px;
    }
    .el-button {
      position: relative;
      top: 5px;
    }
  }
}
</style>
