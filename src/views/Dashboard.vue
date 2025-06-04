<script setup>
import { computed, onMounted, ref } from "vue";
import Tabs from "../components/Tabs.vue";
import Blueprint from "@/components/dashboard/TheBlueprint.vue";
import Orchestrate from "@/components/dashboard/TheBlueprint.vue";
import SelectBlueprint from "@/components/dashboard/TheBlueprint.vue";
import ErrorCard from "@/components/dashboard/ErrorCard.vue";

const Stats = ref([
  {
    name: "Blueprint",
    failed: 0,
    in_progress: 0,
    success: 0,
  },
  {
    name: "Orchestrate",
    failed: 0,
    in_progress: 0,
    success: 0,
  },
]);

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

const selectedBlueprintData = ref(null);

const handleBlueprintSelected = (data) => {
  selectedBlueprintData.value = data;
  console.log(selectedBlueprintData.value);
};

const loadStatsData = (dataStat) => {
  // dataStat is expected to be { name: "Blueprint" or "Orchestrate", stats: { FAILED: x, IN_PROGRESS: y, SUCCESS: z } }
  console.log("Received statData from child:", dataStat);
  const statEntry = Stats.value.find(
    (s) => s.name.toLowerCase() === dataStat.name.toLowerCase()
  );

  if (statEntry && dataStat.stats) {
    statEntry.failed = dataStat.stats.FAILED || 0;
    statEntry.in_progress = dataStat.stats.IN_PROGRESS || 0; // Jenkins uses IN_PROGRESS
    statEntry.success = dataStat.stats.SUCCESS || 0;
  } else {
    console.warn(
      "Could not find stat type or missing stats in child data:",
      dataStat.name,
      dataStat.stats
    );
  }
};
</script>

<template>
  <div
    class="grid grid-cols-2 grid-rows-3 h-full p-3 gap-3 sm:grid-cols-4 sm:grid-rows-2 max-h-[98vh]"
  >
    <div class="card sm:row-span-2 row-span-1 col-span-2 p-0">
      <Tabs name="blueprintTab" :tabs="blueprintTabsData">
        <template #blueprint>
          <Blueprint
            :refetch="true"
            placelabel="blueprint"
            @selectBlueprint="handleBlueprintSelected"
            @statData="loadStatsData"
          ></Blueprint>
        </template>
        <template #orchestrate>
          <Orchestrate
            placelabel="orchesetrate"
            @statData="loadStatsData"
          ></Orchestrate
        ></template>
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
          <select-blueprint
            :placelabel="selectedBlueprintData?.name ?? 'Select Blueprint'"
            :data="selectedBlueprintData"
          />
        </template>

        <template #error>
          <error-card :data="selectedBlueprintData" />
        </template>
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
