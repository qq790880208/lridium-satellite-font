/* eslint-disable */
declare module '*.vue' {
  import type { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}


declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}
