<script setup lang="ts">
// import { Swiper } from "swiper";
// import { Pagination } from "swiper/modules";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from "vue";
import anime from "animejs/lib/anime.es.js";

interface swiperProps {
  imageList: Array<string>;
  show: boolean;
  depth: number;
}

const props = withDefaults(defineProps<swiperProps>(), {
  imageList: () => {
    return [];
  },
  show: false,
  depth: 1
});

const { imageList, show } = toRefs(props);

const emits = defineEmits(["animationFinish"]);

defineExpose({
  startAnimation
});

// let swiper: Swiper;

// const swiperDom = ref();

const promiseAnimationList = ref([] as Array<Promise<boolean>>);
// let promiseAnimationTimeline = anime.timeline({
//   easing: "easeInOutExpo"
// });
const refImageDomList = ref([] as Array<HTMLImageElement>);
const refTitledImage = ref();
const tiledImageOpacity = ref(1);

const computedTitledImageStyle = computed(() => {
  const length = imageList.value.length;
  // const height = getHeight(length);
  const width = getWidth(length);
  const height = getHeight(length);
  return {
    height,
    width
  };
});

watch(
  () => imageList.value,
  (value) => {
    if (value.length > 0) {
      // nextTick(() => {
      // });
    } else {
      promiseAnimationList.value = [];
      tiledImageOpacity.value = 1;
      // promiseAnimationTimeline = anime.timeline({
      //   easing: "easeInOutExpo"
      // });
    }
  }
);

// onMounted(() => {
//
//   // swiper = new Swiper(swiperDom.value, {
//   //   autoplay: true,
//   //   modules: [Pagination],
//   //   pagination: {
//   //     el: swiperPaginationDom.value
//   //   }
//   // });
// });

// onBeforeUnmount(() => {
//   // swiper.destroy();
// });

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

function generateAnimationStep(dom: Element, index: number, duration?: number, opacity?: Array<number>) {
  return {
    targets: dom,
    translateX: (index * 10) - 20,
    translateY: (index * 10) - 20,
    opacity,
    duration,
    loop: false
  };
}

function generateAnimationTimeLine(time: number) {
  const promiseAnimationTimeline = anime.timeline({
    easing: "easeInOutExpo",
    loop: false
  })
  promiseAnimationTimeline.add(generateAnimationStep(refTitledImage.value as HTMLElement, 2, 3000, [1, 0]));
  const domList = refImageDomList.value; // document.querySelectorAll('.depth-img__image');
  // console.info(refImageDomList.value);
  if(domList.length === 1) {
    domList.forEach(item => {
      promiseAnimationTimeline.add(generateAnimationStep(item, 2, time, [0, 1]));
    });
  }else {
    domList.forEach((item, index) => {
      promiseAnimationTimeline.add(generateAnimationStep(item, index, time, [0, 1]));
    });
  }
  return promiseAnimationTimeline
}

function startAnimation(time: number) {
  // tiledImageOpacity.value = 0;
  const promiseAnimationTimeline = generateAnimationTimeLine(time)
  // return Promise.allSettled(promiseAnimationList)
  promiseAnimationTimeline.play();
  return promiseAnimationTimeline.finished;
}

// function setRefImageDomList(el: HTMLImageElement) {
//   refImageDomList.value.push(el);
// }

function getHeight(length: number) {
  let height: string;
  switch (length) {
    case 1:
      height = "100%";
      break;
    case 2:
    case 3:
      height = `calc((100% - 30px) / 2)`;
      break;
    case 4:
    case 5:
    case 6:
    case 7:
    default:
      height = `calc((100% - 30px) / 3)`;
      break;
  }
  return height
}

function getWidth(length: number) {
  let width = "100%";
  switch (length) {
    case 1:
      width = "100%";
      break;
    case 2:
    case 3:
      width = `calc((100% - 30px) / 2)`;
      break;
    case 4:
    case 5:
    case 6:
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
    <div class="tiled-img__gps" ref="refTitledImage" :style="{
      opacity: depth === 1 ? 0 : 1,
      flexWrap: imageList.length === 3 ? 'wrap-reverse' : 'warp',
      justifyContent: imageList.length === 7 ? 'start' : 'warp'
    }">
      <img
        v-for="(image, index) of imageList"
        :style="computedTitledImageStyle"
        :key="index"
        alt=""
        :src="image"
      />
    </div>
    <div class="depth-img__gps">
      <img
        ref="refImageDomList"
        class="depth-img__image"
        v-for="(image, index) of imageList"
        :key="index"
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
.tiled-img__gps {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 10px 10px 0 0;
  opacity: 1;

  & > img {
    margin: 0 0 10px 10px;
    object-fit: contain;
    // height: 100%;
    // position: absolute;
    // width: 100%;
  }
}

.depth-img__gps {
  height: 100%;
  width: 100%;

  & > img {
    height: 100%;
    position: absolute;
    width: 100%;
    opacity: 0;
  }
}
</style>
