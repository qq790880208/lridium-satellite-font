<script setup lang="ts">
import Terminal, { TerminalApi } from "vue-web-terminal";
import 'vue-web-terminal/lib/theme/dark.css'
import { onMounted, ref, toRefs, watch } from "vue";

interface terminalProps {
  data: string;
  index: number;
  initText?: string
}

const props = defineProps<terminalProps>();

const { initText } = toRefs(props);

const terminalInstance = ref();

const handleTerminal = (name: string) => {
  console.info(name);
};

onMounted(() => {
  // terminalInstance.value.execute('系统正在初始化，请稍候...');
})

watch(
  () => props.data,
  (val) => {
    // console.info(TerminalApi)
    // terminalInstance.value.pushMessage({
    //   type: 'normal',
    //   class: 'info',
    //   content: val
    // });
    terminalInstance.value.execute(val);
    if(val.includes('end')) {
      // TerminalApi.clearLog('my-terminal', true);
      terminalInstance.value.clearLog(false);
      terminalInstance.value.clearLog(true);
      terminalInstance.value.pushMessage({ type: 'normal', class: 'info', content: initText?.value || '系统正在收集信号，请稍候...' });
    }
  }
);
</script>

<template>
  <terminal
    ref="terminalInstance"
    :name="index.toString()"
    title="dos"
    context="dos"
    :init-log="[
      { type: 'normal', class: 'info', content: initText || '系统正在收集信号，请稍候...' },
    ]"
    :log-size-limit="50"
    :show-header="false"
    @initComplete="handleTerminal"
  ></terminal>
</template>

<style lang="less"></style>
