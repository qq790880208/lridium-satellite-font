<script setup lang="ts">
import Terminal from "vue-web-terminal";
import { ref, watch } from "vue";

interface terminalProps {
  data: string;
}

const props = defineProps<terminalProps>();

const terminalInstance = ref();

const handleTerminal = (name: string) => {
  console.info(name);
};

watch(
  () => props.data,
  (val) => {
    // console.info(terminalInstance.value);
    // terminalInstance.value.pushMessage(val);
    terminalInstance.value.execute(val);
    if('end'.includes(val)) {
      terminalInstance.value.clearLog()
    }
  }
);
</script>

<template>
  <terminal
    ref="terminalInstance"
    name="my-terminal"
    title="dos"
    context="dos"
    :init-log="[
      { type: 'normal', class: 'info', content: '系统正在初始化，请稍候...' },
    ]"
    :show-header="false"
    @initComplete="handleTerminal"
  ></terminal>
</template>

<style lang="less"></style>
