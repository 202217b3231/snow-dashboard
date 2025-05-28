import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createMemoryHistory, createRouter } from "vue-router";
import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
import Data from "./views/Data.vue";
import Notes from "./views/Notes.vue";
import Settings from "./views/Settings.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/dashboard", component: Dashboard },
  { path: "/data", component: Data },
  { path: "/notes", component: Notes },
  { path: "/settings", component: Settings },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
createApp(App).use(router).mount("#app");
