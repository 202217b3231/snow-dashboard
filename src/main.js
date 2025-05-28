import { createWebHashHistory, createRouter } from "vue-router";
import { createApp } from "vue";

import "./style.css";
import App from "./App.vue";
import Home from "@/views/Home.vue";
import Dashboard from "@/views/Dashboard.vue";
import Data from "@/views/Data.vue";
import Notes from "@/views/Notes.vue";
import Settings from "@/views/Settings.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/data", name: "data", component: Data },
  { path: "/notes", name: "notes", component: Notes },
  { path: "/settings", name: "settings", component: Settings },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
