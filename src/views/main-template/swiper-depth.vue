<script setup lang="ts">
// import { Swiper } from "swiper";
// import { Pagination } from "swiper/modules";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import anime from "animejs/lib/anime.es.js";

interface swiperProps {
  imageList: Array<string>;
}

const props = withDefaults(defineProps<swiperProps>(), {
  imageList: () => {
    return [];
  },
  show: false
});

const emits = defineEmits(["animationFinish"]);

defineExpose({
  startAnimation
});

// let swiper: Swiper;

// const swiperDom = ref();


const opacity = ref(0);
const promiseAnimationList = ref([] as Array<Promise<boolean>>);
// let promiseAnimationTimeline = anime.timeline({
//   easing: "easeInOutExpo"
// });
const refImageDomList = ref([] as Array<HTMLImageElement>);
const refTitledImage = ref();

const computedTitledImageStyle = computed(() => {
  const length = props.imageList.length;
  // const height = getHeight(length);
  const width = getWidth(length);
  return {
    // height: `calc(100% / ${length})`,
    width
  };
});

watch(
  () => props.imageList,
  (value) => {
    console.info(value)
    if (value.length > 0) {
      nextTick(() => {
        // promiseAnimationList.value = refImageDomList.value.map((item, index) => {
        //   // 希望在3s内完成所有动画
        //   return generateAnimationPromise(item, index, 3000);
        // })
        // promiseAnimationTimeline = anime.timeline({
        //   easing: "easeInOutExpo"
        // })
        // promiseAnimationTimeline.add(generateAnimationStep(refTitledImage.value as HTMLElement, 2, 3000, 0));
        // refImageDomList.value.forEach((item, index) => {
        //   promiseAnimationTimeline.add(generateAnimationStep(item, index, 1000, 1));
        // });
      });
    } else {
      promiseAnimationList.value = [];
      // promiseAnimationTimeline = anime.timeline({
      //   easing: "easeInOutExpo"
      // });
    }
  }
);

watch(
  () => props.show,
  (value) => {
    if (!value) {
      refImageDomList.value = [];
      opacity.value = 0;
    }
  }
);

onMounted(() => {

  // swiper = new Swiper(swiperDom.value, {
  //   autoplay: true,
  //   modules: [Pagination],
  //   pagination: {
  //     el: swiperPaginationDom.value
  //   }
  // });
});

onBeforeUnmount(() => {
  // swiper.destroy();
});

function generateAnimationPromise(dom: HTMLElement, index: number, duration?: number): Promise<boolean> {
  return new Promise((resolve) => {
    anime({
      targets: dom,
      translateX: (index * 10),
      translateY: (index * 10),
      duration,
      opacity: 1,
      complete: () => {
        resolve(true);
      }
    });
  });
}

function generateAnimationStep(dom: HTMLElement, index: number, duration?: number, opacity?: number) {
  return {
    targets: dom,
    translateX: (index * 10) - 20,
    translateY: (index * 10) - 20,
    opacity: opacity,
    duration
  };
}

function generateAnimationTimeLine() {
  const promiseAnimationTimeline = anime.timeline({
    easing: "easeInOutExpo"
  })
  promiseAnimationTimeline.add(generateAnimationStep(refTitledImage.value as HTMLElement, 2, 3000, 0));
  refImageDomList.value.forEach((item, index) => {
    promiseAnimationTimeline.add(generateAnimationStep(item, index, 1000, 1));
  });
  return promiseAnimationTimeline
}

function startAnimation() {
  const promiseAnimationTimeline = generateAnimationTimeLine()
  // return Promise.allSettled(promiseAnimationList)
  promiseAnimationTimeline.play();
  return promiseAnimationTimeline.finished;
}

function setRefImageDomList(el: HTMLImageElement) {
  refImageDomList.value.push(el);
}

function getHeight(length: number) {
  let height = "100%";
  switch (length) {
    case 3:
      height = `calc(100% / 2)`;
      break;
    case 5:
    case 7:
      height = `calc(100% / 3)`;
      break;
  }
}

function getWidth(length: number) {
  let width = "100%";
  switch (length) {
    case 1:
      width = "100%";
      break;
    case 3:
      width = `calc((100% - 30px) / 2)`;
      break;
    case 5:
    case 7:
    default:
      width = `calc((100% - 30px) / 3)`;
      break;
  }
  return width
}

</script>
<template>
  <!--  <div class="swiper" ref="swiperDom">-->
  <!--    <div class="swiper-wrapper">-->
  <div style="height: 100%;width: 100%">
    <div class="tiled-img" ref="refTitledImage" :style="{
      flexWrap: props.imageList.length === 3 ? 'wrap-reverse' : 'warp',
      justifyContent: props.imageList.length === 7 ? 'start' : 'warp'
    }">
      <img
        v-for="(image, index) of props.imageList"
        :style="computedTitledImageStyle"
        :key="index"
        alt=""
        :src="image"
      />
    </div>
    <div class="depth-img">
      <img
        v-for="(image, index) of props.imageList"
        :key="index"
        :ref="setRefImageDomList"
        :style="{ opacity }"
        alt=""
        :src="image"
      />
    </div>
  </div>
  <!--    </div>-->
  <!--    &lt;!&ndash;分页器。如果放置在swiper外面，需要自定义样式。&ndash;&gt;-->
  <!--    <div class="swiper-pagination" ref="swiperPaginationDom"></div>-->
  <!--  </div>-->

</template>

<style lang="less">
.tiled-img {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100%;
  width: 100%;
  opacity: 1;
  padding: 10px 10px 0 0;

  & > img {
    margin: 0 0 10px 10px;
    // height: 100%;
    // position: absolute;
    // width: 100%;
  }
}

.depth-img {
  height: 100%;
  width: 100%;

  & > img {
    opacity: 0;
    height: 100%;
    position: absolute;
    width: 100%;
  }
}
</style>
