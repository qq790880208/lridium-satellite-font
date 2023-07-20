import axios from "axios";

axios.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60000,
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
    console.info(response);
    return response;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default service;
