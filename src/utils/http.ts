import axios from "axios";
import { get } from "lodash";

// axios.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded"
  // "application/json;charset=utf-8";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60000,
  // headers: {
  //   "Content-Type": "application/x-www-form-urlencoded"
  // }
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  // token解析失败，跳转到登录页
  (response) => {
    // console.info(response);
    return get(response, "data", null)
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
