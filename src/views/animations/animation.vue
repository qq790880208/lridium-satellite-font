<script setup lang="ts">
// import CustomHeader from "@/views/gps/custom-header.vue";
import LeftTemplate from "@/views/gps/left-template.vue";
import MainTemplate from "@/views/gps/main-template.vue";
import RightTemplate from "@/views/gps/right-template.vue";
import IridiumSocket from "@/plugins/websocket/class-socket";
import { getBarData, getLineData, getWebSocketAddress } from "@/api";
import { useStore } from "@/store/modules";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref, shallowRef, watch } from "vue";
import type { Ref } from "vue";
import { randomNumber } from "@/utils";
import { random as _random } from "lodash";

// import { get } from "lodash";

interface lineData {
  AuthCount: number;
  Precision: number;
  errorRate: number;
}

interface frame {
  ID: number;
  Type: string;
  Body: string;
  Description: string;
  Step: number;
  extra?: string;
}

const store = useStore();

const { frameStatus, depth } = storeToRefs(store);

const refLeftAnimation = ref() as Ref<typeof LeftTemplate>;

let webSocketInstance: null | IridiumSocket = null;

const barSingleData = ref({} as Array<Array<number>>);
const lineListData = ref([] as Array<lineData>);
// let AuthCount = 1;

getBar();
getLine();

watch(() => frameStatus.value, (value) => {
  if (value === "pending") {
    // webSocketInstance = new IridiumSocket
    handleStatusChange("true", depth.value);
  } else {
    handleStatusChange("false", depth.value);
  }
});

onBeforeUnmount(() => {
  webSocketInstance?.dispose();
});



async function getBar() {
  try {
    const response = await getBarData({});
    barSingleData.value = JSON.parse(response).data;
    // TODO 数据展示用
    // barSingleData.value = new Array(66).fill([]).map(() => {
    //   return [
    //     randomNumber(200, 300),
    //     randomNumber(1, 2),
    //   ]
    // })
  } catch (e) {
    console.error(e);
    barSingleData.value = [];
  }
}

async function getLine() {
  try {
    const response = await getLineData();
    // const Precision = _random(0.9, 1, true);
    // TODO 数据展示用
    // const response = {
    //   AuthCount: AuthCount++,
    //   Precision: Precision,
    //   errorRate: 1 - Precision
    // }
    if(lineListData.value.length < 100) {
      lineListData.value = lineListData.value.concat([response]);
    }else {
      // AuthCount = 1;
      lineListData.value = lineListData.value.slice(50).concat([response])
    }
  } catch (e) {
    console.error(e);
  }
}

async function getWebsocketAddress(status: string) {
  try {
    await getWebSocketAddress({
      Status: status,
      modelSize: depth.value
    });
  } catch (e) {
    console.error(e);
  }
}

function handleWebsocketMessage(e: MessageEvent) {
  try {
    const message = JSON.parse(e.data);
    store.push(message.message);
    // 如果是验证结果这一步，增加一个第5步，结束帧
    if (message.message.Step === 4) {
      store.push({
        ID: -1,
        Type: "",
        Body: "",
        Description: "end",
        Step: 5,
        timeout: 6000
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function handleFrameStart(step: number, timeout: number, result: string) {
  if (step === 5) {
    getBar();
    getLine();
  }
  refLeftAnimation.value.startAnimation(step, timeout, result)
}

// function handleFrameEnd() {
//   refLeftAnimation.value.startAnimation(step, timeout, result)
// }

</script>

<template>
  <main class="gps-main">
    <aside class="gps-main__left">
      <left-template ref="refLeftAnimation"></left-template>
    </aside>
    <main class="gps-main__body">

      <!-- main-template @frame-step="handleFrameStart"></main-template -->
    </main>
    <aside class="gps-main__right">
      <right-template :bar-single-data="barSingleData" :line-list-data="lineListData"></right-template>
    </aside>
  </main>
</template>

<style lang="less">

.gps {
  &-main {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url("~@/assets/app-bg-wave.png"),
    url("~@/assets/main-bg-line.png");
    display: flex;
    height: calc(100vh - 70px);
    // padding: 20px 29px;
    &__body {
      padding: 0 29px;
      flex: 1 0 50%;
      max-width: 1420px;
    }

    &__left {
      background: url("~@/assets/main-bg-left.png") no-repeat;
      background-size: cover;
      // left: 0;
    }

    &__right {
      background: url("~@/assets/main-bg-right.png") no-repeat;
      background-size: cover;
      // right: 0;
    }

    &__body,
    &__right,
    &__left {
      padding: 20px 0 20px 29px;
      z-index: 2;
    }

    &__right,
    &__left {
      padding: 20px 29px;
    }
  }
}
</style>
