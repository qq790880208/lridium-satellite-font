import { forOwn as _forOwn, get as _get } from "lodash";
import { defineStore } from "pinia";

type frameStatus = "stopped" | "pending";

interface frame {
  ID: number;
  Type: string;
  Body: any;
  Description: string;
  Step: number;
  extra?: string;
  timeout?: number;
}

export const useStore = defineStore("main", {
  state: () => {
    return {
      depth: 1, // 深度
      frameStatus: "stopped", // 帧序列目前状态 stopped -- 停止 pending -- 进行,
      GPSFrameStatus: "stopped",
      frameList: [] as Array<frame>, // 帧的list，先进先出
      mulFrameList: {} as Record<number, Array<frame>>,
      oStepConsumesTime: {
        "1": 1500,
        "2": 3000,
        "3": 1500,
        "4": 1500
      } as Record<any, number>,
      channel: 1
    };
  },
  getters: {
    allConsumesTime() {
      let time = 0;
      _forOwn(this.actuallyConsumesTime, (value) => {
        time += value;
      });
      return time;
    },
    actuallyConsumesTime() {
      const actuallyConsumesTime = {} as Record<string, number>;
      _forOwn(this.oStepConsumesTime, (value, key) => {
        if (key === "1" || key === "2") {
          actuallyConsumesTime[key] = (value * this.depth) * parseInt(key, 10);
        } else {
          actuallyConsumesTime[key] = value;
        }
      });
      return actuallyConsumesTime;
    }
  },
  actions: {
    _changeFrameStatus(val: frameStatus) {
      this.frameStatus = val;
    },
    _changeGPSFrameStatus(val: frameStatus) {
      this.GPSFrameStatus = val;
    },
    clearFrameList() {
      this.frameList = [];
    },
    clearMulFrameList() {
      this.mulFrameList = {};
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
    multiplePush(val: frame, index: number) {
      if (this.mulFrameList[index]) {
        this.mulFrameList[index].push(val);
      } else {
        this.mulFrameList[index] = [val];
      }
    },
    remove() {
      const removedFrame = _get(this.frameList, "0", null);
      if (this.frameList.length > 0) {
        this.frameList = this.frameList.slice(1);
      }
      return removedFrame;
    },
    multipleRemove(index: number) {
      const frameList = this.mulFrameList[index];
      const removedFrame = _get(frameList, "0", null);
      if (frameList?.length > 0) {
        this.mulFrameList[index] = frameList.slice(1);
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
    startGPS() {
      this.clearMulFrameList();
      this._changeGPSFrameStatus("pending");
    },
    stopGPS() {
      this.clearMulFrameList();
      this._changeGPSFrameStatus("stopped");
    },
    changeDepth(val: number) {
      this.depth = val;
    },
    changeChannel(val: number) {
      this.channel = val;
    }
  }
});
