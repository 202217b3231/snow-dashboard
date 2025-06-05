<template>
  <div class="card col-span-1 text-xl">
    <h1 class="text-center font-bold">Status</h1>
    <div class="grid grid-cols-2">
      <div v-for="stat in Stats" :key="stat.name" class="grid text-center">
        <h1 class="lg:text-xl text-lg">{{ stat.name }}</h1>
        <label class="grid text-red-500">
          Failed
          <span class="text-4xl">{{ stat.failed }}</span>
        </label>
        <label class="grid text-orange-400">
          In_Progress
          <span class="text-4xl">{{ stat.in_progress }}</span>
        </label>
        <label class="grid text-green-500">
          Success
          <span class="text-4xl">{{ stat.success }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBlueprintStore } from "@/composables/blueprintStore";

const dataStore = useBlueprintStore();
let fetchedDataContainer = null;

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
const calculateInstanceStats = (dataArray) => {
  const counts = { FAILED: 0, IN_PROGRESS: 0, SUCCESS: 0 };
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return counts;
  }
  const uniqueByName = dataArray.filter(
    (item, index, self) => index === self.findIndex((b) => b.name === item.name)
  );

  for (const item of uniqueByName) {
    const statusKey = item.status?.toUpperCase();
    if (statusKey && counts.hasOwnProperty(statusKey)) {
      counts[statusKey]++;
    }
  }
  return counts;
};
const updateStats = (currentData) => {
  if (currentData.blueprint) {
    updateStat("Blueprint", calculateInstanceStats(currentData.blueprint));
  }
  if (currentData.orchestrate) {
    updateStat("Orchestrate", calculateInstanceStats(currentData.orchestrate));
  }
};
const updateStat = (name, statData) => {
  const statEntry = Stats.value.find(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  );
  if (statEntry && statData) {
    statEntry.failed = statData.FAILED || 0;
    statEntry.in_progress = statData.IN_PROGRESS || 0;
    statEntry.success = statData.SUCCESS || 0;
  } else {
    console.log(
      "StatusCard: Could not find stat type or missing stats in data:",
      name,
      statData
    );
  }
};

onMounted(async () => {
  try {
    const result = await dataStore.allData;
    fetchedDataContainer = result;
    console.log(result);
    updateStats(fetchedDataContainer);
  } catch (e) {
    console.log(
      "%cStatusCard: Failed to fetch data in onMounted:",
      "background:#FFFF55;color:black;",
      e
    );
  }
});
</script>
