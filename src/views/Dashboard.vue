<script setup>
import { computed, onMounted, ref } from "vue";
import Tabs from "../components/Tabs.vue";
import Blueprint from "@/components/dashboard/TheBlueprint.vue";
import Orchestrate from "@/components/dashboard/TheBlueprint.vue";
import SelectBlueprint from "@/components/dashboard/TheBlueprint.vue";
import ErrorCard from "@/components/dashboard/ErrorCard.vue";
import StatusCard from "@/components/dashboard/StatusCard.vue";
import RhelCard from "@/components/dashboard/RhelCard.vue";

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
</script>

<template>
  <div
    class="grid grid-cols-2 grid-rows-3 h-full p-3 gap-3 sm:grid-cols-4 sm:grid-rows-2 max-h-[98vh]"
  >
    <div class="card sm:row-span-2 row-span-1 col-span-2 p-0 z-0">
      <Tabs name="blueprintTab" :tabs="blueprintTabsData">
        <template #blueprint>
          <Blueprint
            :refetch="true"
            placelabel="blueprint"
            @selectBlueprint="handleBlueprintSelected"
          />
        </template>
        <template #orchestrate>
          <Orchestrate placelabel="orchestrate"
        /></template>
      </Tabs>
    </div>
    <status-card />

    <div class="card col-span-1">
      <h1 class="card-title">Rhel Version</h1>
      <rhel-card />
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
