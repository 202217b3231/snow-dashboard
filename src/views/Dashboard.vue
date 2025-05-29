<script setup>
import Tabs from "../components/Tabs.vue";

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
    idSuffix: "blueprintContent",
    fullHeightContent: false,
  },
  {
    label: "Orchestrate",
    idSuffix: "orchestrateContent",
    fullHeightContent: true,
  },
];
const errorTabsData = [
  {
    label: "Select Blueprint",
    initialChecked: true,
    idSuffix: "selectBlueprintContent",
    fullHeightContent: false,
  },
  {
    label: "Error",
    idSuffix: "errorContent",
    fullHeightContent: true,
  },
];
</script>

<template>
  <div
    class="grid grid-cols-2 grid-rows-3 h-full p-3 gap-3 sm:grid-cols-4 sm:grid-rows-2"
  >
    <div class="card sm:row-span-2 row-span-1 col-span-2 p-0">
      <Tabs name="blueprintTab" :tabs="blueprintTabsData">
        <template #tab-content-blueprintContent> Tab content 1 </template>
        <template #tab-content-orchestrateContent> Tab content 2 </template>
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
      <p class="absolute right-[50%] top-3">Selected</p>
      <Tabs name="errorTab" :tabs="errorTabsData">
        <template #tab-content-selectBlueprintContent> Tab content 1 </template>
        <template #tab-content-errorContent> Tab content 2 </template>
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
