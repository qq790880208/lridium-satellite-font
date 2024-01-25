<script setup lang="ts">
import CustomHeader from "@/views/custom-header.vue";
import LeftTemplate from "@/views/left-template.vue";
import MainTemplate from "@/views/main-template.vue";
import RightTemplate from "@/views/right-template.vue";
import IridiumSocket from "@/plugins/websocket/class-socket";
import { getBarData, getLineData, getWebSocketAddress } from "@/api";
import { useStore } from "@/store/modules";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref, shallowRef, watch } from "vue";
import type { Ref } from "vue";

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

async function handleStatusChange(status: string, modelSize: number) {
  try {
    const url = `${process.env.VUE_APP_WS_API}`;
    if (status === "false") {
      getWebsocketAddress(status)
      webSocketInstance?.dispose();
      return;
    }else {
      getWebsocketAddress(status).finally(() => {
        // TODO
        webSocketInstance = new IridiumSocket(url, handleWebsocketMessage, depth.value);
      })
    }
  } catch (e) {
    console.error(e);
  }
}

async function getBar() {
  try {
    const response = await getBarData({});
    barSingleData.value = JSON.parse(response).data;
  } catch (e) {
    console.error(e);
    barSingleData.value = [];
  }
}

async function getLine() {
  try {
    const response = await getLineData();
    lineListData.value = lineListData.value.concat([response]);
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

</script>

<template>
  <img alt="" src="@/assets/app-bg.png" class="img-bg" />
  <custom-header></custom-header>
  <main class="app-main">
    <aside class="app-main__left">
      <left-template ref="refLeftAnimation"></left-template>
    </aside>
    <main class="app-main__body">
      <main-template @frame-step="handleFrameStart"></main-template>
    </main>
    <aside class="app-main__right">
      <right-template :bar-single-data="barSingleData" :line-list-data="lineListData"></right-template>
    </aside>
  </main>
</template>

<style lang="less">
.img-bg {
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}

.app {
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
