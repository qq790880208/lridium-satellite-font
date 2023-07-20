<script setup lang="ts">
import Terminal from "vue-web-terminal";
import { ref, watch } from "vue";

interface terminalProps {
  data: string;
}

const props = defineProps<terminalProps>();

const terminal = ref().value;

const handleTerminal = (name: string) => {
  console.info(name);
};

watch(
  () => props.data,
  () => {
    terminal && terminal.push("");
  }
);
</script>

<template>
  <terminal
    ref="terminal"
    name="my-terminal"
    title="dos"
    init-log="系统正在初始化，请稍候..."
    :show-header="false"
    @init-compolete="handleTerminal"
  ></terminal>
</template>

<style lang="less"></style>
