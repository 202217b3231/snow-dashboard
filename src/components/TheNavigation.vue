<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import {
  Home as HomeIcon,
  LayoutDashboard as DashboardIcon,
  NotebookTabs as NotesIcon,
  Settings as SettingsIcon,
  DatabaseZap as DataIcon,
  Eye,
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
    url: "/data",
    name: "Data",
    icon: DataIcon,
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
const router = useRouter();
const handleKeyNavigation = (event) => {
  if (!event.ctrlKey && !event.shiftKey) return;

  if (event.key === "B" && event.shiftKey) {
    event.preventDefault();
    toggleMenu();
  }
  const currentPath = router.currentRoute.value.path;
  const currentIndex = routes.findIndex((route) => route.url === currentPath);

  if (currentIndex === -1) return;

  let nextIndex;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    nextIndex = (currentIndex - 1 + routes.length) % routes.length;
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    nextIndex = (currentIndex + 1) % routes.length;
  } else {
    return;
  }

  const nextRoute = routes[nextIndex];
  if (nextRoute && nextRoute.url !== currentPath) {
    router.push(nextRoute.url);
  }
};
const currentTheme = ref("cupcake");
const isMenu = ref(true);

const setTheme = () => {
  const newtheme = currentTheme.value === "dim" ? "cupcake" : "dim";
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", newtheme);
    localStorage.setItem("theme", newtheme);
  }
  currentTheme.value = newtheme;
};
onMounted(() => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    const getTheme = localStorage.getItem("theme");
    const getMenu = localStorage.getItem("menu");
    if (getMenu) {
      isMenu.value = getMenu === "true";
    }
    if (getTheme === "cupcake" || getTheme === "dim") {
      currentTheme.value = getTheme;
      document.documentElement.setAttribute("data-theme", getTheme);
    }
  }
});

const toggleMenu = () => {
  isMenu.value = !isMenu.value;
  localStorage.setItem("menu", String(isMenu.value));
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyNavigation);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyNavigation);
});
</script>

<template>
  <Eye class="fixed left-0 top-0 z-10 cursor-pointer" v-on:click="toggleMenu" />
  <div
    v-on:click="setTheme"
    class="cursor-pointer fixed right-0 rounded-xl p-0.5 z-10"
  >
    <SunDim v-if="currentTheme === 'dim'" />
    <Moon v-else-if="currentTheme === 'cupcake'" />
  </div>
  <nav
    v-if="isMenu"
    class="w-full h-7 flex justify-center items-center gap-5 bg-base-200 group"
  >
    <span class="opacity-10 group-hover:opacity-70 fixed top-0 left-20"
      ><kbd class="kbd">Ctrl + ◀/▶</kbd> to change Page</span
    >
    <span class="opacity-10 group-hover:opacity-70 fixed top-0 right-20"
      ><kbd class="kbd">Shift + B</kbd> to toggle Menu</span
    >
    <router-link
      v-for="route in routes"
      :key="route.name"
      :to="route.url"
      v-slot="{ isActive }"
      :data-tip="route.name"
      class="tooltip tooltip-bottom h-10 flex flex-col items-center justify-center rounded-md transition-all duration-200"
    >
      <component
        v-if="!isActive"
        :is="route.icon"
        class="w-5 h-5 m-2 z-8 opacity-20 group-hover:opacity-100"
      />
      <p v-if="isActive" class="font-medium text-lg">
        {{ route.name }}
      </p>
    </router-link>
  </nav>
</template>
