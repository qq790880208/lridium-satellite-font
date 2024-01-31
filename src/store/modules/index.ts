import { get as _get, forOwn as _forOwn } from "lodash";
import { defineStore } from "pinia";

type frameStatus = "stopped" | "pending";

interface frame {
  ID: number
  Type: string
  Body: any
  Description: string
  Step: number
  extra?: string
  timeout?: number
}

export const useStore = defineStore("main", {
  state: () => {
    return {
      depth: 1, // 深度
      frameStatus: "stopped", // 帧序列目前状态 stopped -- 停止 pending -- 进行
      frameList: [] as Array<frame>, // 帧的list，先进先出
      oStepConsumesTime: {
        '1': 1500,
        '2': 3000,
        '3': 1500,
        '4': 1500,
      } as Record<any, number>
    };
  },
  getters: {
    allConsumesTime() {
      let time = 0;
      _forOwn(this.actuallyConsumesTime, (value) => {
          time += value
      })
      return time
    },
    actuallyConsumesTime() {
      const actuallyConsumesTime = {} as Record<string, number>;
      _forOwn(this.oStepConsumesTime, (value, key) => {
        if(key === '1' || key === '2') {
          actuallyConsumesTime[key] = (value * this.depth) * parseInt(key, 10)
        }else {
          actuallyConsumesTime[key] = value
        }
      })
      return actuallyConsumesTime
    },
  },
  actions: {
    _changeFrameStatus(val: frameStatus) {
      this.frameStatus = val;
    },
    clearFrameList() {
      this.frameList = [];
    },
    stopFrameList() {
      // 清理第一个5之后的步骤
      const index = this.frameList.findIndex(item => item.Step === 5);

      this.frameList = index > -1 ? this.frameList.slice(0, index + 1) : [];
    },
    push(val: frame) {
      // 如果超过100个
      // if(this.frameList.length > 100) {
      //   const newFrameList = this.frameList.slice(50);
      //   const startIndex = newFrameList.findIndex(item => item.Step === 1);
      //   this.frameList = newFrameList.slice(startIndex);
      // }
      this.frameList.push(val);
    },
    remove() {
      const removedFrame = _get(this.frameList, "0", null);
      if(this.frameList.length > 0) {
        this.frameList = this.frameList.slice(1);
      }
      return removedFrame;
    },
    start() {
      this.clearFrameList();
      this._changeFrameStatus("pending");
    },
    stop() {
      this.stopFrameList();
      this._changeFrameStatus("stopped");
    },
    changeDepth(val: number) {
      this.depth = val;
    },
  },
});
