import { get as _get } from "lodash";
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
    };
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

      this.frameList = index > -1 ? this.frameList.slice(0, index) : [];
    },
    push(val: frame) {
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
