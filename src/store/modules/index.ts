import { get as _get } from "lodash";
import { defineStore } from "pinia";

type frameStatus = "stopped" | "pending";

export const useStore = defineStore("main", {
  state: () => {
    return {
      frameStatus: "stopped", // 帧序列目前状态 stopped -- 停止 pending -- 进行
      frameList: [], // 帧的list，先进先出
    };
  },
  actions: {
    clear() {
      this.frameList = [];
    },
    push() {
      // if (this.frameStatus === "pending") {
      //   this.frameList = this.frameList.concat(val);
      // }
    },
    remove() {
      const removedFrame = _get(this.frameList.slice(0, 1), "0", null);
      this.frameList = this.frameList.slice(1);
      return removedFrame;
    },
    start() {
      this._changeFrameStatus("pending");
    },
    stop() {
      this._changeFrameStatus("stopped");
    },
    _changeFrameStatus(val: frameStatus) {
      this.frameStatus = val;
    },
  },
});
