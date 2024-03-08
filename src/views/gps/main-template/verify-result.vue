<script setup lang="ts">
import anime from "animejs/lib/anime.es.js";
import { computed, onMounted, ref, watch } from "vue";

interface verifyResultProps {
  result: string;
}

defineExpose({
  startAnimation
});

const refAnimateFinger = ref();

const props = withDefaults(defineProps<verifyResultProps>(), {
  result: ''
});

const computedFillColor = computed(() => {
  return props.result === 'success' ? 'green' : 'red'
})

// let promiseAnimationTimeline = anime.timeline({
//   easing: "easeOutExpo"
// });

watch(() => props.result, () => {
  // promiseAnimationTimeline = anime.timeline({
  //   easing: "easeOutExpo"
  // });
  // promiseAnimationTimeline.add({
  //   targets: refAnimateFinger.value,
  //   delay: 1200,
  //   translateX: [500, 0],
  //   opacity: [0, 1],
  //   duration: 3000
  // });

})

// onMounted(() => {});

function generateAnimationTimeLine(time: number) {
  const promiseAnimationTimeline = anime.timeline({
    easing: "easeOutExpo"
  });
  promiseAnimationTimeline.add({
    targets: refAnimateFinger.value,
    delay: 1200,
    translateX: [500, 0],
    opacity: [0, 1],
    duration: time
  });
  return promiseAnimationTimeline
}

function startAnimation(time: number) {
  const promiseAnimationTimeline = generateAnimationTimeLine(time);
  promiseAnimationTimeline.play();
  return promiseAnimationTimeline.finished;
}

</script>

<template>
  <div>
    <div></div>
    <svg class="icon verify-result__gps" aria-hidden="true" fill="#f2f2f2">
      <use xlink:href="#icon-finger6"></use>
    </svg>
    <svg
      ref="refAnimateFinger"
      class="icon verify-result__gps active"
      aria-hidden="true"
      :fill="computedFillColor"
    >
      <use xlink:href="#icon-finger6"></use>
    </svg>
  </div>

  <!--    <img alt="" :src="props.result ? require('../../assets/success.jpg') : require('../../assets/fail.jpg')" class="verify-result" />-->
</template>

<style lang="less" scoped>
.verify-result__gps {
  height: 50%;
  width: 50%;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}


</style>
