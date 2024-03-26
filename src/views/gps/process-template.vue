<script setup lang="ts">
import { onBeforeUnmount, onDeactivated, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { getGPSWebSocketAddress } from "@/api";
import { useStore } from "@/store/modules";
import IridiumSocket from "@/plugins/websocket/class-socket";
import MainTemplate from "@/views/gps/main-template.vue";
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";

const store = useStore();

const state = storeToRefs(store);

const body = ref("body");

const modal = ref(false);

const webSocketInstance: Array<IridiumSocket> = [];

const frameStatus = state.GPSFrameStatus;

const depth = state.depth;

const channel = state.channel;

const emit = defineEmits(["frame-end"]);

const oStepConsumesTime = state.allConsumesTime;

const channelList = ref(new Array(channel.value).fill(0).map((item, index) => {
  return {
    index,
    show: false,
    percentage: 0,
    status: "" as "success" | "exception" | "warning",
    prn: ""
  };
}));

const oResult2Text = {
  "success": "合法",
  "exception": "非法",
  "warning": "警告"
};

watch(() => frameStatus.value, (value: string) => {
  // console.info(handleStatusChange(value !== "pending" ? "false" : "true", depth.value, channel.value));
  handleStatusChange(value !== "pending" ? "false" : "true", depth.value, channel.value)
    .finally(() => {
      store.changeCanConnectWebSocket({
        status: value === "pending"
      })
      if (value !== "pending") {
        disconnectAllWebsocket();
        channelList.value = [];
      } else {
        channelList.value = new Array(channel.value).fill(0).map((item, index) => {
          return {
            index,
            show: false,
            percentage: 0,
            status: "" as "success" | "exception" | "warning",
            prn: ""
          };
        });
        createWebSocket();
        // channelList.value.forEach(item => {
        //
        // });
      }
    });
});

onBeforeUnmount(() => {
  clearAllInterval();
  disconnectAllWebsocket();
});

onDeactivated(() => {
  clearAllInterval();
  disconnectAllWebsocket();
});

async function handleStatusChange(Status: string, modelSize: number, channel: number) {
  try {
    // TODO
    // const url = `ws://${process.env.NODE_ENV === "production" ? '' : ''}${process.env.VUE_APP_WS_API}ws/iridium_group/`;
    // const url = `ws://${process.env.NODE_ENV === "production" ? window.location.host : ""}${process.env.VUE_APP_WS_API}ws/channel${channel}/`;
    if (Status === "false") {
      await getWebsocketAddress(Status, channel);
      return true;
    } else {
      await getWebsocketAddress(
        Status,
        channel
      );
      return true;
      //   .finally(() => {
      //   webSocketInstance.push(new IridiumSocket(url, (e: MessageEvent) => {
      //     handleWebsocketMessage(e, channel);
      //   }, depth.value));
      // });
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

function createWebSocket() {
  // channel: number
  // const url = `ws://${process.env.NODE_ENV === "production" ? window.location.host : ""}${process.env.VUE_APP_WS_API}ws/channel${channel}/`;
  const url = `ws://${process.env.NODE_ENV === "production" ? window.location.host : ""}${process.env.VUE_APP_WS_API}ws/Auth/`;
  webSocketInstance.push(new IridiumSocket(url, (e: MessageEvent) => {
    handleWebsocketMessage(e);
  }, depth.value));
}


function handleWebsocketMessage(e: MessageEvent) {
  try {
    // index: number
    const message = JSON.parse(e.data);
    const index = message.message?.Channel;
    store.multiplePush(message.message, index);
    // 如果是验证结果这一步，增加一个第5步，结束帧
    if (message.message.Step === 4) {
      store.multiplePush({
        ID: "",
        Type: "",
        Body: "",
        Description: "end",
        Step: 5,
        timeout: 6000
      }, index);
    }
  } catch (error) {
    console.error(error);
  }
}

function disconnectAllWebsocket() {
  webSocketInstance.forEach(item => {
    item.dispose();
  });
}

function clearAllInterval() {
  Object.values(oIntervalId).forEach(intervalId => clearInterval(intervalId));
}

function handleFrameStart(step: number, result: "success" | "exception" | "warning", index: number, id: string) {
  if (step === 5) {
    emit("frame-end");
  }
  modifyProcessStatus(step, result, index, id);
}

let oIntervalId = {} as Record<number, number>;

function modifyProcessStatus(step: number, result: "success" | "exception" | "warning", index: number, id: string) {
  clearInterval(oIntervalId[index]);
  const process = channelList.value[index];
  process.status = result;
  process.prn = id || "";
  if (step === 5) {
    process.percentage = 0;
    process.status = "" as "success" | "exception" | "warning";
  } else {
    oIntervalId[index] = setInterval(() => {
      if (process.percentage < 100) {
        process.percentage++;
      }
    }, Math.floor((oStepConsumesTime.value) / 100));
  }
}

async function getWebsocketAddress(status: string, index: number) {
  try {
    await getGPSWebSocketAddress({
      Status: status,
      modelSize: depth.value,
      channel: index
    });
  } catch (e) {
    console.error(e);
  }
}

function handleProcessClick(index: number) {
  hideAllChannel();
  channelList.value[index].show = true;
  modal.value = true;
}

function hideAllChannel() {
  channelList.value.forEach(item => item.show = false);
}

function closeModal() {
  modal.value = false;
  hideAllChannel();
}
</script>

<template>
  <base-chart-background
    class="process__gps"
    height="calc((100vh - 120px))"
    title="系统概述"
    width="100%"
  >
    <div class="process__gps__image" v-show="frameStatus === 'stopped'">
        <span
          style="margin: 0 0 0 48px">本系统基于USRP和软件无线电平台GNU Radio利用gnss-sdr软件定义接收机实现对GPS卫星的实时射频指纹认证。</span><br />
      <span style="margin: 0 0 0 48px">该系统无需上层密码学认证机制，首先提取GPS导航数据中每个子帧的前导码对应的跟踪阶段的prompt相关器输出的I和Q两路相关结果，然后将I和Q两路结果做成IQ星座图，之后将星座图转换成灰度图，基于GPS信号I/Q星座图的空间分布特征（加时序变化特征）利用变分自编码器（VAE）实现对GPS卫星的实时射频指纹认证。</span><br />
      <span style="margin: 0 0 0 48px">该系统及其关键支撑技术有望在未来卫星互联网时代为用户提供信号层面的带内无感持续GPS卫星认证，作为密码学认证机制的有效补充解决GPS卫星信号欺骗带来的安全问题，具有广泛的民用前景。</span>
    </div>
    <div class="process__gps__header" v-show="frameStatus === 'pending'">
      <div>channels</div>
      <div>prn</div>
      <div>step1</div>
      <div>step2</div>
      <div>step3</div>
      <div>step4</div>
      <div>认证结果</div>
    </div>
    <div
      class="process__gps__process"
      v-show="frameStatus === 'pending'"
      v-for="channel of channelList"
      :key="channel.index"
      @click="handleProcessClick(channel.index)"
    >
      <div class="process__gps__process__text">{{ `channel${channel.index}` }}</div>
      <div class="process__gps__process__text" style="text-align: center">{{ channel.prn }}</div>
      <el-progress
        indeterminate
        :percentage="channel.percentage"
        :stroke-width="15"
        :status="channel.status"
        striped
        striped-flow
      />
      <div class="process__gps__process__text" style="text-align: right;">{{ oResult2Text[channel.status] || "" }}</div>
    </div>
    <teleport :to="body">
      <template v-for="channel of channelList" :key="channel.index">
        <transition name="el-fade-in" v-show="channel.show">
          <main-template :index="channel.index" @frame-step="handleFrameStart"></main-template>
        </transition>
      </template>
    </teleport>
    <teleport :to="body">
      <div class="process__gps__modal" v-show="modal" @click="closeModal">
      </div>
    </teleport>
  </base-chart-background>
</template>

<style lang="less">
.process__gps {
  .chart-background__main {
    display: block;
  }

  .el-progress__text {
    color: #FFFFFF;
  }

  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    background: #000000;
    opacity: 0.5;
    height: 100vh;
    width: 100vw;
    z-index: 999;
    backdrop-filter: blur(10px);
  }

  &__image {
    color: #FFFFFF;
    font-size: 24px;
    height: 100%;
    width: 100%;
    //    & > span {
    //      white-space: pre-wrap;
    //    }
  }

  &__header {
    display: flex;
    color: #FFFFFF;
    font-size: 24px;
    justify-content: space-between;
  }

  &__process {
    display: flex;
    margin: 5px 0;

    &__text {
      color: #FFFFFF;
      font-size: 24px;
      flex: 1 1 192px;
    }

    .el-progress {
      flex: 1 1 700px;
    }
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
