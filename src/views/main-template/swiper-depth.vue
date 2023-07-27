<script setup lang="ts">
import { Swiper } from "swiper";
import { Pagination } from "swiper/modules";
import { onBeforeUnmount, onMounted, ref } from "vue";

interface swiperProps {
  imageList: Array<string>;
}

const props = withDefaults(defineProps<swiperProps>(), {
  imageList: () => {
    return ["/app-bg.png", "/app-bg.png"];
  },
});

let swiper: Swiper;

const swiperDom = ref();

const swiperPaginationDom = ref();

onMounted(() => {
  swiper = new Swiper(swiperDom.value, {
    autoplay: true,
    modules: [Pagination],
    pagination: {
      el: swiperPaginationDom.value,
    },
  });
});

onBeforeUnmount(() => {
  swiper.destroy();
});
</script>
<template>
  <div class="swiper" ref="swiperDom">
    <div class="swiper-wrapper">
      <img
        v-for="image of props.imageList"
        :key="image"
        class="swiper-slide"
        alt=""
        src="../../assets/logo.png"
      />
    </div>
    <!--分页器。如果放置在swiper外面，需要自定义样式。-->
    <div class="swiper-pagination" ref="swiperPaginationDom"></div>
  </div>
</template>

<style lang="less">
.swiper {
  width: 100%;
  height: 100%;
}
</style>
