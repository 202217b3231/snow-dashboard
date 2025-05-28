<script setup>
import { ref, onMounted } from "vue";
import {
  Home as HomeIcon,
  LayoutDashboard as DashboardIcon,
  NotebookTabs as NotesIcon,
  Settings as SettingsIcon,
  SunDim,
  Moon,
} from "lucide-vue-next";

const routes = [
  {
    url: "/",
    name: "Home",
    icon: HomeIcon,
  },
  {
    url: "/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
  },
  {
    url: "/notes",
    name: "Notes",
    icon: NotesIcon,
  },
  {
    url: "/settings",
    name: "Settings",
    icon: SettingsIcon,
  },
];
const currentTheme = ref("pastel");
const setTheme = () => {
  const newtheme = currentTheme.value === "dim" ? "pastel" : "dim";
  if (typeof document != "undefined") {
    document.documentElement.setAttribute("data-theme", newtheme);
    localStorage.setItem("theme", newtheme);
  }
  currentTheme.value = newtheme;
};
onMounted(() => {
  if (typeof window != undefined) {
    const getTheme = localStorage.getItem("theme");
    if (getTheme === "pastel" || getTheme === "dim") {
      currentTheme.value = getTheme;
      document.documentElement.setAttribute("data-theme", getTheme);
    }
  }
});
</script>

<template>
  <div class="flex h-screen w-screen">
    <aside class="w-1/6">
      <ul class="flex flex-col gap-4 p-4">
        <router-link v-for="route in routes" :key="route.name" :to="route.url">
          <component :is="route.icon" class="w-5 h-5" />
        </router-link>
      </ul>
      <p v-on:click="setTheme" class="cursor-pointer">
        <SunDim v-if="currentTheme === 'dim'" />
        <Moon v-else-if="currentTheme === 'pastel'" />
      </p>
    </aside>
    <main class="flex-1">
      <router-view></router-view>
    </main>
  </div>
</template>
