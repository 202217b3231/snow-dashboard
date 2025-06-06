<template>
  <div style="font-family: 'Lucida Sans', Verdana; line-height: 2em">
    <button class="btn">Fetch</button>
    <p style="font-size: 20px; font-weight: 600; text-align: center">
      Detailed Issue Tracking Sheet
    </p>
    <p style="font-size: 16px; text-align: center">
      Date:
      {{ new Date().toLocaleDateString() }}{{ "&nbsp;".repeat(60) }}Submitted
      by: Himanshu
    </p>
    <p style="font-size: 16px; text-align: center">
      Priority: NA{{ "&nbsp;".repeat(60) }}Status: In Progress
    </p>
    <p style="font-size: 18px; font-weight: 500; text-align: center">
      General Information
    </p>
    <h4>Issue: Windows</h4>
    <ul>
      <li>Window2016</li>
      <li>Window2019</li>
      <li>Window2022</li>
    </ul>
    <h4>Issue: RHEL</h4>
    <ul>
      <li>RHEL7</li>
      <li>RHEL8</li>
      <li>RHEL9</li>
      <li>AL2023</li>
      <li>ORACLELINUX8</li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useBlueprintStore } from "@/composables/blueprintStore";

const dataStore = useBlueprintStore();
const allItems = ref(null);
const failedItems = ref([]);
const loading = ref(false);

const fetchFailedItems = async () => {
  loading.value = true;
  try {
    allItems.value = await dataStore.allData;
  } catch (e) {
    console.log("Failed to fetch data:", "background:#FFFF55;color:black;", e);
  } finally {
    loading.value = false;
  }
};

watchEffect(async () => {
  if (!Array.isArray(allItems?.value?.blueprint)) {
    console.log("Invalid blueprint data.");
    return;
  }
  loading.value = true;
  const tempItems = [];

  const filteredBlueprints = dataStore.filterData(
    fetchedData.value.blueprint,
    "failed"
  );
});
</script>
