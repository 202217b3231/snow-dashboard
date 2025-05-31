<script setup>
import { ref } from "vue";
import Tabs from "../components/Tabs.vue";
import Blueprint from "@/components/TheBlueprint.vue";
import Orchestrate from "@/components/TheBlueprint.vue";
import SelectBlueprint from "@/components/TheBlueprint.vue";
const Stats = [
  {
    name: "Blueprint",
    failed: "10",
    in_progress: "10",
    success: "10",
  },
  {
    name: "Orchestrate",
    failed: "2",
    in_progress: "3",
    success: "1",
  },
];

const blueprintTabsData = [
  {
    label: "Blueprint",
    initialChecked: true,
    id: "blueprint",
  },
  {
    label: "Orchestrate",
    id: "orchestrate",
  },
];
const errorTabsData = [
  {
    label: "Select Blueprint",
    initialChecked: true,
    id: "selectBlueprint",
  },
  {
    label: "Error",
    id: "error",
  },
];
const placename = ref("Filter");
const handlerefetch = () => {
  placename.value = "Loading....";
  setTimeout(() => {
    placename.value = "Filter";
  }, 1000);
};
</script>

<template>
  <div
    class="grid grid-cols-2 grid-rows-3 h-full p-3 gap-3 sm:grid-cols-4 sm:grid-rows-2"
  >
    <div class="card sm:row-span-2 row-span-1 col-span-2 p-0">
      <Tabs name="blueprintTab" :tabs="blueprintTabsData">
        <template #blueprint>
          <Blueprint :refetch="handlerefetch" :placelabel="placename">
          </Blueprint>
        </template>
        <template #orchestrate> <Orchestrate></Orchestrate></template>
      </Tabs>
    </div>
    <div class="card col-span-1">
      <h1 class="text-center text-xl font-bold">Status</h1>
      <div class="grid grid-cols-2">
        <div v-for="stat in Stats" :key="stat.name" class="grid text-center">
          <h1 class="text-xl">{{ stat.name }}</h1>
          <label class="text-red-400">
            Failed
            <span>{{ stat.failed }}</span>
          </label>
          <label class="text-orange-400">
            In_Progress
            <span>{{ stat.in_progress }}</span>
          </label>
          <label class="text-green-500">
            Success
            <span>{{ stat.success }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="card col-span-1">
      <h1 class="card-title">Rhel Version</h1>
    </div>

    <div class="card col-span-2 p-0 relative">
      <Tabs name="errorTab" :tabs="errorTabsData">
        <template #selectBlueprint>
          <SelectBlueprint placelabel="Selected Blueprint" />
        </template>

        <template #error> Tab content 2 </template>
      </Tabs>
    </div>
  </div>
</template>

<style scoped>
label {
  display: grid;
  & span {
    font-weight: bold;
    font-size: 1.5em;
  }
}
</style>
