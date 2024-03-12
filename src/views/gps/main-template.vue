<script setup lang="ts">
import { ceil, get as _get } from "lodash";
import { storeToRefs } from "pinia";
import { defineEmits, nextTick, onBeforeUnmount, reactive, ref, watch, toRefs, onMounted } from "vue";
import { useStore } from "@/store/modules";
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import Echart from "@/views/gps/main-template/ehcart-three.vue";
import SwiperDepth from "@/views/gps/main-template/swiper-depth.vue";
import WebTerminal from "@/views/gps/main-template/web-terminal.vue";
import VerifyResult from "@/views/gps/main-template/verify-result.vue";
// import { ceil } from "lodash";

interface gpsMainProps {
  index: number;
}

const emits = defineEmits(["frameStep", "frameStepEnd"]);

const props = defineProps<gpsMainProps>();

const { index } = toRefs(props);

const store = useStore();

const result = ref("");

const state = storeToRefs(store);

const order = ref(1);

const dosText = ref("");

const dosIQText = ref("");

const refDepthImage = ref();

const refVerifyResult = ref();

const depth = state.depth;

const oStepConsumesTime = state.oStepConsumesTime;

const nCurrentAnimationTime = ref(0);

// const frameList = state.frameList

// const currentFrameList = reactive({
//   value: "",
// });

const oShowList = reactive({
  img: true,
  dos: false,
  depth: false,
  chart: false,
  result: false
});

const eChart3Data = ref([] as number[][]);

// computed(() => {
//   return currentFrameList;
// });

// watch(() => depth, () => {})

const depthImageList = ref([] as Array<string>);


// 该生命周期基本用于测试使用 TODO
// onMounted(() => {
//   setTimeout(() => {
//     oShowList.img = false;
//     depthImageList.value = new Array(5).fill(
//       "https://th.bing.com/th/id/R.b0ea268fa1be279d112489ce83ad4696?rik=qItsh%2fBiy33hlg&riu=http%3a%2f%2fwww.quazero.com%2fuploads%2fallimg%2f140303%2f1-140303215009.jpg&ehk=S6PLWamt%2bMzQV8uO9ugcU5d5M19BpXtCpNz2cRJ7q9M%3d&risl=&pid=ImgRaw&r=0"
//     );
//     oShowList.depth = true;
//     oShowList.result = true;
//     result.value = randomNumber(1, 5) > 3;
//     nextTick(() => {
//       // console.info(refDepthImage.value.startAnimation())
//       refDepthImage.value.startAnimation().then(() => {
//         oShowList.depth = false;
//       });
//       refVerifyResult.value.startAnimation().then(() => {
//         oShowList.result = false;
//       });
//     });
//   }, 1000);
// });

onMounted(() => {
  if(state.GPSFrameStatus.value === 'pending') {
    play();
  }
})

onBeforeUnmount(() => {
  stop();
});

watch(state.GPSFrameStatus, (value) => {
  if (value === "stopped") {
    stop();
  } else {
    play();
  }
});

let interval1 = -1;
let stopTimeoutId = -1;

function play() {
  oShowList.depth = false;
  oShowList.chart = false;
  oShowList.result = false;
  // currentFrameList.value = store.remove();
  oShowList.img = false;
  oShowList.dos = true;
  clearDisplayStatus();
  // dosText.value = `开始, 第${order.value}帧`;
  animation();
  // TODO 临时展示
  // interval1 = setInterval(animation, 11000);
}

function stop() {
  // order.value = 1;
  dosText.value = "结束";
  // clearDisplayStatus();
  // clearTimeout(stopTimeoutId);
}

const playStep = (step: number, timeout: number) => {
  return new Promise((resolve) => {
    switch (step) {
      case 1:
        stopTimeoutId = setTimeout(() => {
          resolve(true);
        }, timeout);
        break;
      case 2:
        oShowList.depth = true;
        nextTick(() => {
          if (depth.value === depthImageList.value.length) {
            refDepthImage.value.startAnimation(timeout).then(() => {
              resolve(true);
            });
          } else if(depth.value > depthImageList.value.length) {
            stopTimeoutId = setTimeout(() => {
              resolve(true);
            }, timeout);
          }
        });
        break;
      case 3:
        oShowList.chart = true;
        stopTimeoutId = setTimeout(() => {
          resolve(true);
        }, timeout);
        break;
      case 4:
        oShowList.result = true;
        nextTick(() => {
          refVerifyResult.value.startAnimation(timeout).then(() => {
            resolve(true);
          });
        });
        break;
      default:
        stopTimeoutId = setTimeout(() => {
          clearDisplayStatus();
          emits('frameStepEnd')
          resolve(true);
        }, 9000);
        break;
    }
  });
};

function clearDisplayStatus() {
  oShowList.depth = false;
  oShowList.chart = false;
  oShowList.result = false;
  result.value = "";
  depthImageList.value = [];
  eChart3Data.value = [];
}

function animation() {
  try {
    clearTimeout(stopTimeoutId);
    const currentFrame = store.multipleRemove(index.value);
    // 如果点击了停止按钮且播放完了当前片段
    if (state.GPSFrameStatus.value === "stopped" && currentFrame?.Step === 5) {
      emits("frameStep", 5, result.value, index.value);
      return;
    }
    if (currentFrame) {
      const text = `${currentFrame.Description}: ${currentFrame?.Body || ''}`;
      handleDosText(currentFrame.Step, currentFrame?.Body, text);
      setStepData(currentFrame.Step, currentFrame);
      const animationTime = oStepConsumesTime.value[currentFrame.Step];
      // nCurrentAnimationTime.value = animationTime * currentFrame.Step;
      emits("frameStep", currentFrame.Step, result.value, index.value, currentFrame?.ID);
      playStep(currentFrame.Step, animationTime).finally(animation);
    } else {
      stopTimeoutId = setTimeout(animation, 3000);
    }
  } catch (e) {
    console.error(e);
    clearTimeout(stopTimeoutId);
  }
}

// const throttleSetDosText = debounce(setDosText, 2000);

function setDosText(text: string) {
  dosText.value = text;
}

function handleDosText(step: number, data: any, text: string) {
  const oStep2Text = {
    1: "正在收集信号",
    2: "正在解析数据",
    3: "正在处理数据",
    4: data === 0 ? "验证失败" : "验证成功",
    5: text
  }
  setDosText(_get(oStep2Text, step.toString(), ""));
}

function dealtTextLimitLength(text: string) {
  let maxLength = 1000;
  // dos显示内容超过1000个字符，添加防抖，每5000字符加一次
  if (text.length > maxLength) {
    const number = ceil(text.length / maxLength);
    // for (let i = 0; i < number; i++) {
    //   setTimeout(() => {
    //     setDosText(text.substring(i * maxLength, i * maxLength + maxLength));
    //   }, i * 100);
    // }
    return text.substring(0, maxLength);
  } else {
    return text;
  }
}

// TODO
function setStepData(step: number, data: any) {
  switch (step) {
    case 1:
      dosIQText.value = dealtTextLimitLength(data.Body);
      break;
    case 2:
      // depthImageList.value = depthImageList.value.concat([`${data.image_dict}`]);
      if(depth.value > depthImageList.value.length) {
        // depthImageList.value = depthImageList.value.concat("/images/grayScale.jpg")
        depthImageList.value = depthImageList.value.concat([`${process.env.VUE_APP_HTTP_API}${data.Body}`]);
      }
      break;
    case 3:
      eChart3Data.value = data.Body;
      break;
    case 4:
      result.value = data.Body === 0 ? "exception" : "success";
      break;
    default:
      dosIQText.value = 'end';
      order.value += 1;
      break;
  }
}
</script>

<template>
  <base-chart-background
    class="main-template__gps"
    height="calc((100vh - 120px))"
    title=""
    width="50%"
  >
    <transition name="el-fade-in">
      <div class="main-template__gps__block" v-show="oShowList.dos">
        <web-terminal :data="dosText" :index="index"></web-terminal>
      </div>
    </transition>
    <transition name="el-fade-in">
      <div class="main-template__gps__block" v-show="oShowList.dos">
        <web-terminal :data="dosIQText" :index="(index + 1) * 10" init-text="IQ sequence"></web-terminal>
      </div>
    </transition>
    <div class="main-template__gps__block">
      <verify-result
        v-show="oShowList.result"
        ref="refVerifyResult"
        :result="result"
      ></verify-result>
    </div>
    <div class="main-template__gps__block">
      <swiper-depth
        v-show="oShowList.depth"
        ref="refDepthImage"
        :image-list="depthImageList"
        :depth="depth"
      ></swiper-depth>
    </div>
    <!--transition name="el-fade-in">
      <div class="main-template__gps__block">
        <echart v-show="oShowList.chart" :data-set="eChart3Data"></echart>
      </div>
    </transition-->
  </base-chart-background>
</template>

<style lang="less">
.main-template__gps {
  background: #000000;
  height: calc(-120px + 100vh);
  width: 60%;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  &__image {
    color: #FFFFFF;
    font-size: 24px;
    height: 100%;
    width: 100%;
    //    & > span {
    //      white-space: pre-wrap;
    //    }
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
