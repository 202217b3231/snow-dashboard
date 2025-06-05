import { createWebHashHistory, createRouter } from "vue-router";
import { createApp } from "vue";
import { createPinia } from "pinia";

import "./style.css";
import App from "./App.vue";
import Home from "@/views/Home.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
  },
  { path: "/data", name: "data", component: () => import("@/views/Data.vue") },
  {
    path: "/notes",
    name: "notes",
    component: () => import("@/views/Notes.vue"),
  },
  {
    path: "/workflow",
    name: "workflow",
    component: () => import("@/views/Workflow.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const pinia = createPinia();
const app = createApp(App);

// const app = createApp({
//   render: () => h(App),
// });

app.use(pinia);
app.use(router);
app.mount("#app");
