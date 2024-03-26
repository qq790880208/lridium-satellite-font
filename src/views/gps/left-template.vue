<script setup lang="ts">
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import Terminal from "vue-web-terminal";
import { onBeforeUnmount, ref, watch } from "vue";
import { useStore } from "@/store/modules";
import { storeToRefs } from "pinia";
import IridiumSocket from "@/plugins/websocket/class-socket";

const store = useStore();

const state = storeToRefs(store);

const oConnectWebSocket = state.oConnectWebSocket;

const terminalInstance = ref();

let webSocketInstance: IridiumSocket;

watch(() => oConnectWebSocket.value, (value: connectWebsocket) => {
  const url = `ws://${process.env.NODE_ENV === "production" ? window.location.host : ""}${process.env.VUE_APP_WS_API}ws/gnss/`;
  if (!value.status) {
    webSocketInstance?.dispose();
  } else {
    webSocketInstance = new IridiumSocket(url, (e: MessageEvent) => {
      handleWebsocketMessage(e);
    }, 1)
  }
});

onBeforeUnmount(() => {
  webSocketInstance?.dispose();
})

function handleWebsocketMessage(e: MessageEvent) {
  try {
    const message = JSON.parse(e.data);
    terminalInstance.value.execute(message.message);
  }catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <base-chart-background
    height="calc(100vh - 120px)"
    title="DOS"
    width="100%"
  >
    <terminal
      ref="terminalInstance"
      name="linux-dos"
      title="dos"
      context="dos"
      :init-log="[
        { type: 'normal', class: 'info', content: '系统正在等待启动' },
      ]"
      :log-size-limit="50"
      :show-header="false"
    ></terminal>
  </base-chart-background>
</template>

<style lang="less">

</style>
