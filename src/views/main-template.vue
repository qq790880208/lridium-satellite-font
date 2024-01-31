<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineEmits, nextTick, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useStore } from "@/store/modules";
import BaseChartBackground from "@/components/base-components/base-chart-background.vue";
import Echart from "@/views/main-template/ehcart-three.vue";
import SwiperDepth from "@/views/main-template/swiper-depth.vue";
import WebTerminal from "@/views/main-template/web-terminal.vue";
import VerifyResult from "@/views/main-template/verify-result.vue";
import { ceil } from "lodash";

const emits = defineEmits(["frameStep"]);

const store = useStore();

const result = ref("");

const state = storeToRefs(store);

const order = ref(1);

const dosText = ref("测试开始");

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

const aComponentInfo = ref([
  {
    id: "1",
    name: "BaseChartInstance",
    height: "calc((100vh - 118px))",
    title: "系统概述",
    data: [],
    width: "100%"
  }
]);

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

onBeforeUnmount(() => {
  stop();
});

watch(state.frameStatus, (value) => {
  if (value === "stopped") {
    stop();
  } else {
    play();
  }
});

let interval1 = -1;
let stopTimeoutId = -1;
const play = () => {
  oShowList.depth = false;
  oShowList.chart = false;
  oShowList.result = false;
  // currentFrameList.value = store.remove();
  oShowList.img = false;
  oShowList.dos = true;
  clearDisplayStatus();
  dosText.value = `开始, 第${order.value}帧`;
  animation();
  // TODO 临时展示
  // interval1 = setInterval(animation, 11000);
};

const stop = () => {
  order.value = 1;
  dosText.value = "结束";
  // clearDisplayStatus();
  // clearTimeout(stopTimeoutId);
};

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
          resolve(true);
        }, 9000);
        break;
    }
  });
};

const clearDisplayStatus = () => {
  oShowList.depth = false;
  oShowList.chart = false;
  oShowList.result = false;
  result.value = "";
  depthImageList.value = [];
  eChart3Data.value = [];
};

function animation() {
  try {
    clearTimeout(stopTimeoutId);
    const currentFrame = store.remove();
    // 如果点击了停止按钮且播放完了当前片段
    if (state.frameStatus.value === "stopped" && currentFrame?.Step === 5) {
      emits("frameStep", 5, oStepConsumesTime.value[currentFrame.Step], result.value);
      return;
    }
    if (currentFrame) {
      const text = `${currentFrame.Description}: ${currentFrame?.Body || ''}`;
      handleDosText(text);
      setStepData(currentFrame.Step, currentFrame);
      const animationTime = oStepConsumesTime.value[currentFrame.Step];
      // nCurrentAnimationTime.value = animationTime * currentFrame.Step;
      emits("frameStep", currentFrame.Step, animationTime, result.value);
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

function handleDosText(text: string) {
  let maxLength = 1000;
  // dos显示内容超过1000个字符，添加防抖，每5000字符加一次
  if (text.length > maxLength) {
    const number = ceil(text.length / maxLength);
    // for (let i = 0; i < number; i++) {
    //   setTimeout(() => {
    //     setDosText(text.substring(i * maxLength, i * maxLength + maxLength));
    //   }, i * 100);
    // }
    setDosText(text.substring(0, maxLength));
  } else {
    setDosText(text);
  }
}

// TODO
function setStepData(step: number, data: any) {
  switch (step) {
    case 1:
      break;
    case 2:
      // `${process.env.VUE_APP_HTTP_API}/${data.image_dict}` TODO
      // depthImageList.value = depthImageList.value.concat([`${data.image_dict}`]);
      if(depth.value > depthImageList.value.length) {
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
      order.value += 1;
      break;
  }
}
</script>

<template>
  <base-chart-background
    class="main-template"
    height="calc((100vh - 120px))"
    title="系统概述"
    width="100%"
  >
    <div class="main-template__image" v-show="oShowList.img">
        <span
          style="margin: 0 0 0 48px">本系统基于USRP和软件无线电平台GNU Radio实现对铱星星座66颗卫星的实时射频认证。</span><br />
      <span style="margin: 0 0 0 48px">该系统无需上层密码学认证机制，
        与铱星通信过程中提取铱星的下行信号IQ采样，
        利用IQ星座图的时间和空间特性，
        基于3D卷积神经网络实现对铱星的射频指纹认证，
        具有通信开销低、计算开销小等优点。</span><br />
      <span style="margin: 0 0 0 48px">该系统及其关键支撑技术有望在未来卫星互联网时代为用户提供信号层面的带内无感持续卫星认证，
        作为密码学认证机制的有效补充解决卫星信号伪装带来的安全问题，
        同时可以解决GPS等全球导航卫星信号的欺骗和重放等攻击，
        具有广泛的军用和民用前景。</span>
    </div>
    <transition name="el-fade-in">
      <div class="main-template__block" v-show="oShowList.dos">
        <web-terminal :data="dosText"></web-terminal>
      </div>
    </transition>
    <div class="main-template__block">
      <swiper-depth
        v-show="oShowList.depth"
        ref="refDepthImage"
        :image-list="depthImageList"
      ></swiper-depth>
    </div>
    <div class="main-template__block">
      <verify-result
        v-show="oShowList.result"
        ref="refVerifyResult"
        :result="result"
      ></verify-result>
    </div>
    <transition name="el-fade-in">
      <div class="main-template__block">
        <echart v-show="oShowList.chart" :data-set="eChart3Data"></echart>
      </div>
    </transition>
  </base-chart-background>
</template>

<style lang="less">
.main-template {
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
