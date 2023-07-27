import { createApp } from "vue";
import App from "./App.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import Terminal from "vue-web-terminal";
import pinia from "@/store/index";
import "echarts-gl";
import { useElementPlus } from "@/plugins/element-plus";
import "./css/index.css";
import "element-plus/dist/index.css";
import "swiper/css";
import "swiper/css/pagination";

// import router from "./router";
// import store from "./store";
const app = createApp(App);

app.use(pinia);

// app.use(Terminal);

useElementPlus(app);

app.mount("#app");
