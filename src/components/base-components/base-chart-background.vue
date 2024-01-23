<template>
  <div
    class="chart-background"
    :style="{
      height: computedHeight,
      width: computedWidth,
    }"
  >
    <header class="chart-background__header">
      <!--icon :name="iconName" class="text-icon"></icon-->
      <span>{{ props.title }}</span>
    </header>
    <main class="chart-background__main">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, computed } from "vue";

interface chartProps {
  iconName?: string;
  title: string;
  height: string;
  width?: string;
}

const props = withDefaults(defineProps<chartProps>(), {
  iconName: "el-left",
  title: "标题",
  height: "200px",
  width: "300px",
});

const computedHeight = computed(() => {
  return `${props.height}`;
});

const computedWidth = computed(() => {
  return `${props.width}`;
});
</script>

<style lang="less">
.chart-background {
  position: relative;
  //background-color: rgba(19, 25, 47, 0.6);
  //  backdrop-filter: blur(4px);
  border: 2px solid #20426a;
  //border-radius: 10px;
  margin: 7px 0;
  //padding: 12px;
  //  overflow: hidden;
  &__header {
    background: #20426a;
    color: #1dd4ff;
    line-height: 40px;
    height: 40px;
    span {
      margin: 0 0 0 12px;
    }
  }
  &__main {
    display: flex;
    padding: 12px;
    position: relative;
    height: calc(100% - 64px);
    flex-wrap: wrap;
    z-index: 2;
  }
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    transition: 0.3s ease-in-out;
  }
  &::before {
    top: -5px;
    left: -5px;
    border-top: 2px solid #1dd4ff;
    border-left: 2px solid #1dd4ff;
  }
  &::after {
    right: -5px;
    bottom: -5px;
    border-bottom: 2px solid #1dd4ff;
    border-right: 2px solid #1dd4ff;
  }
  &:hover::before,
  &:hover::after {
    width: calc(100% + 9px);
    height: calc(100% + 9px);
  }
  &:hover {
    backdrop-filter: blur(10px);
  }
}
</style>
