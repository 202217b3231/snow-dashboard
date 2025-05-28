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
  <div class="flex flex-col h-screen w-screen">
    <div
      v-on:click="setTheme"
      class="cursor-pointer fixed right-0 rounded-xl p-0.5 z-10"
    >
      <SunDim v-if="currentTheme === 'dim'" />
      <Moon v-else-if="currentTheme === 'pastel'" />
    </div>
    <nav
      class="w-full h-7 group flex justify-center items-center gap-5 bg-base-300"
    >
      <router-link
        v-for="route in routes"
        :key="route.name"
        :to="route.url"
        v-slot="{ isActive }"
        :data-tip="route.name"
        class="tooltip tooltip-bottom h-10 flex flex-col items-center justify-center rounded-md group-hover:bg-base-300 transition-all duration-200"
      >
        <p v-if="isActive" :is="route.icon" class="fixed">{{ route.name }}</p>
        <component
          v-else
          :is="route.icon"
          class="w-7 h-7 z-8 m-2 hidden group-hover:block transition-opacity duration-200"
        />
      </router-link>
    </nav>
    <main class="flex-1">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped></style>
