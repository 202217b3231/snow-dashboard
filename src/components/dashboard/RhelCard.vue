<template>
  <div class="relative">
    <span
      class="btn btn-outline btn-xs absolute -top-6 right-0"
      @click="fetchVersions"
    >
      Fetch
    </span>
    <span v-if="loading" class="loading loading-bars loading-sm ml-2"></span>
    <span v-else-if="fetchError" class="text-error ml-2">{{ fetchError }}</span>
    <div v-else-if="versions.length > 0" class="mt-2">
      <p
        v-for="(ver, index) in versions"
        :key="index"
        class="lg:text-2xl text-lg"
      >
        {{ ver }}
      </p>
    </div>
    <span v-else class="ml-2">N/A</span>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useBlueprintStore } from "@/composables/blueprintStore";

const dataStore = useBlueprintStore();
const fetchedData = ref(null);
const processedVersions = ref([]);
const loading = ref(false);
const fetchError = ref(null);
const filterTermsString = ref([
  "rhel7",
  "rhel8",
  "rhel9",
  "al2023",
  "oraclelinux8",
]);

watchEffect(async () => {
  if (
    !fetchedData.value ||
    !fetchedData.value.blueprint ||
    !Array.isArray(fetchedData.value.blueprint)
  ) {
    console.warn("Invalid blueprint data.");
    processedVersions.value = [];
    return;
  }

  loading.value = true;
  const tempVersions = [];

  for (const term of filterTermsString.value) {
    const filteredBlueprints = dataStore.filterData(
      fetchedData.value.blueprint,
      `${term} success`
    );
    if (filteredBlueprints?.length > 0) {
      const firstMatch = filteredBlueprints[0];
      if (
        firstMatch?._links?.self?.href &&
        typeof firstMatch.name === "string"
      ) {
        const vLink = `https://jenkins.eat.jnj.com${firstMatch._links.self.href.replace(
          "wfapi/describe",
          "consoleText"
        )}`;

        try {
          const res = await fetch(vLink);
          if (!res.ok)
            throw new Error(
              `Failed to fetch logs for ${term}. Status: ${res.status}`
            );

          const vText = await res.text();
          const lineWithVersion = vText
            .split("\n")
            .find((line) => line.includes("version="));
          const versionValue = lineWithVersion
            ? lineWithVersion.split("version=").pop().trim()
            : null;

          if (versionValue) {
            tempVersions.push(versionValue);
            console.log(`Found version for ${term}: ${versionValue}`);
          } else {
            console.log(`No 'version=' line found in logs for ${term}.`);
          }
        } catch (e) {
          fetchError.value = fetchError.value || e.message;
          console.error(`Error processing version for ${term}: ${e.message}`);
        }
      }
    } else {
      console.log(`No successful blueprint found for term: ${term}`);
    }
  }
  processedVersions.value = tempVersions;
  loading.value = false;
});

const versions = computed(() => processedVersions.value);

const fetchVersions = async () => {
  loading.value = true;
  fetchError.value = null;
  processedVersions.value = [];

  try {
    fetchedData.value = await dataStore.allData;
  } catch (e) {
    fetchError.value = "Failed to load";
    console.error("Failed to fetch data:", e);
  } finally {
    loading.value = !fetchError.value;
  }
};
</script>
