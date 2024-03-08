import request from "@/utils/http";
import { transformObject2FormData } from "@/utils";
interface requestBarData {
  IAAuthID?: number;
  IARes?: number;
}

interface requestWebsocketData {
  Status: string;
  modelSize?: number;
  channel?: number;
}

// 查询深度列表
export const requestDepthList = () => {
  return request({});
};

export const getLineData = () => {
  return request({
    url: "/IridiumAuthentication/getPrecision",
    // params
  });
};

export const getBarData = (params: requestBarData) => {
  return request({
    url: "/IridiumAuthentication/getIACount",
    params,
  });
};

export const getWebSocketAddress = (data: requestWebsocketData) => {
  const FormData = transformObject2FormData(data)
  return request({
    url: "/WebSocketAddr/IridiumStr",
    method: "post",
    data: FormData,
  });
};

export const getGPSLineData = () => {
  return request({
    url: "/GpsAuthentication/getPrecision",
    // params
  });
};

export const getGPSBarData = (params: requestBarData) => {
  return request({
    url: "/GpsAuthentication/getResult",
    params,
  });
};

export const getGPSWebSocketAddress = (data: requestWebsocketData) => {
  const FormData = transformObject2FormData(data)
  return request({
    url: "/WebSocketAddr/GpsStr",
    method: "post",
    data: FormData,
  });
};


