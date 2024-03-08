import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/iridium",
    name: "iridium",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/iridium/iridium-component.vue"),
  },
  {
    path: "/",
    name: "",
    redirect: "/iridium",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/iridium/iridium-component.vue"),
    children: []
  },
  {
    path: "/gps",
    name: "gps",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/gps/gps-component.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
