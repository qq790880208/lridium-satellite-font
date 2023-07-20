import { chain, get } from "lodash";
// import store from "@/store";
// import {
//   getCountDataAddr,
//   getObjectMessage,
//   getRadarOnlineAddr,
//   getTrailPoint,
// } from "@/api/websocket-address";
import Worker from "./child-process.worker";

const handleReceiveChildProcessMessage = (e) => {
  // console.info(e);
  // store.commit("test", e)
};

const transformAddr2WorkerMessage = (list) => {
  return list.map((item) => {
    const url = get(item, "value.data.msg", "");
    // url转换程name For Example：
    // ws://172.18.25.223:8081/msg/counts_data => countsData
    const name = chain(url).split("/").last().camelCase().value();
    return {
      name,
      url,
    };
  });
};

(function (window) {
  try {
    if (window.Worker) {
      const worker = new Worker();
      worker.onmessage = handleReceiveChildProcessMessage;
      // Promise.allSettled([
      //   getCountDataAddr(),
      //   getObjectMessage(),
      //   getRadarOnlineAddr(),
      //   getTrailPoint(),
      // ])
      //   .then((result) => {
      //     const socketInfo = transformAddr2WorkerMessage(result);
      //     console.info(socketInfo);
      //     worker.postMessage({
      //       type: "createSocket",
      //       socketInfo,
      //     });
      //   })
      //   .catch((e) => {
      //     console.error(e);
      //   });
    } else {
      throw new Error("您的浏览器暂不支持该应用，请升级浏览器");
    }
  } catch (e) {
    console.error(e);
  }
})(window);
