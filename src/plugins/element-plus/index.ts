import { App, Component } from "vue";
import { ElButton, ElInput, ElSelect, ElOption } from "element-plus";

// Directives

const components = [ElButton, ElInput, ElSelect, ElOption];

export function useElementPlus(app: App) {
  // 注册组件
  components.forEach((component: Component) => {
    app.component(component.name || "", component);
  });
  // 注册指令
  // plugins.forEach((plugin) => {
  //   app.use(plugin);
  // });
}
