import { createWebHashHistory, createRouter } from "vue-router";
import { createApp, h } from "vue";
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
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// createApp(App).use(router).mount("#app");

const app = createApp({
  render: () => h(App),
});

app.use(router);
app.mount("#app");
