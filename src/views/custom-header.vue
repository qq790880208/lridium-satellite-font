<script setup lang="ts">
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { SuccessFilled, CircleCloseFilled } from "@element-plus/icons-vue";
import { useStore } from "@/store/modules";
import { useRoute, useRouter } from "vue-router";
import IridiumSelect from "@/views/header-select/iridium-select.vue";
import GpsSelect from "@/views/header-select/gps-select.vue";

dayjs.extend(isoWeek);

const time = ref(dayjs().format("HH:mm:ss"));
const date = ref(dayjs().format("YYYY-MM-DD"));
const weekDay = ref(dayjs().format("dddd"));

const store = useStore();

const state = storeToRefs(store);

const router = useRouter();

const frameStatus = state.frameStatus;

const depth = state.depth;

const channel = state.channel;

const selectMenuID = ref(1);

const aMenuList = ref([
  {
    id: 1,
    name: "铱星系统",
    route: "/iridium"
  },
  {
    id: 2,
    name: "GPS认证",
    route: "/gps"
  },
  {
    id: 4,
    name: "5G认证",
    route: "/iridium"
  },
  // {
  //   id: 5,
  //   name: "菜单3",
  // },
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
    id: 2,
    label: 4,
    value: 4,
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

const aChannelList = new Array(8).fill(0).map((item, index) => index + 1);

const selectMenuName = computed(() => {
  return aMenuList.value.find(item => item.id === selectMenuID.value)?.name
})

const clock = () => {
  time.value = dayjs().format("HH:mm:ss");
};

const intervalId = setInterval(clock, 1000);

onBeforeUnmount(() => {
  intervalId && clearInterval(intervalId);
});

// watch(() => selectMenuID.value, (value) => {
//   if(value === 1) {
//
//   }else {
//
//   }
// })

const handleMenuClick = (val: number, path: string) => {
  selectMenuID.value = val;
  handleEndClick();
  router.push(path);
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
    <p class="app-header__title">{{ selectMenuName }}</p>
    <div
      class="app-header__menu"
      v-for="menu of aMenuList"
      :key="menu.id"
      :class="{ active: menu.id === selectMenuID }"
      @click="() => { handleMenuClick(menu.id, menu.route) }"
    >
      <span>{{ menu.name }}</span>
    </div>
    <gps-select v-if="selectMenuID === 2"></gps-select>
    <iridium-select v-else></iridium-select>
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
    align-items: center;
    background: url("~@/assets/header-bg.png") no-repeat;
    background-size: 100% 90%;
    display: flex;
    height: 70px;
    line-height: 70px;
    position: relative;
    z-index: 2;
    &__desc {
      top: 10px;
      position: relative;
      color: #ffffff;
      margin: 0 10px 0 0;
    }
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
      width: 100px;
      top: 10px;
    }
    .el-button {
      position: relative;
      top: 10px;
    }
  }
}

@media screen and (min-width: 1024px) and (max-width: 1440px) {
  .app {
    &-header {
      &__menu {
        font-size: 16px;
      }
    }
  }
}
</style>
