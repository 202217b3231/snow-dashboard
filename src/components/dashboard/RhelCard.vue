<template>
  <div class="relative">
    <span
      class="btn btn-outline btn-xs absolute -top-6 right-0"
      @click="fetchVersions"
      >Fetch</span
    >
    <span v-if="loading" class="loading loading-bars loading-sm ml-2"></span>
    <span v-else-if="fetchError" class="text-error ml-2">{{ fetchError }}</span>
    <div v-else-if="versions.length > 0" class="mt-2">
      <p v-for="(ver, index) in versions" :key="index" class="text-2xl">
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

const filterTermsString = ref(["rhel7", "rhel8", "rhel9", "al2023"]);

watchEffect(async () => {
  if (!fetchedData.value) {
    return;
  }
  if (!fetchedData.value.blueprint) {
    console.warn("RhelCard: fetchedData.blueprint is undefined.");
    processedVersions.value = [];
    return;
  }

  const blueprintData = fetchedData.value.blueprint;

  if (!Array.isArray(blueprintData)) {
    console.warn("RhelCard: fetchedData.blueprint is not an array.");
    processedVersions.value = [];
    return;
  }

  loading.value = true;

  const tempVersions = [];
  let anErrorOccurredInLoop = false; // To prevent overwriting initial fetchError if loop is fine

  for (const term of filterTermsString.value) {
    const filteredBlueprints = dataStore.filterData(
      blueprintData,
      `${term} success`
    );
    if (filteredBlueprints?.length > 0) {
      const firstMatch = filteredBlueprints[0];
      if (
        firstMatch &&
        firstMatch._links?.self?.href &&
        typeof firstMatch.name === "string"
      ) {
        let vLink = "https://jenkins.eat.jnj.com" + firstMatch._links.self.href;
        vLink = vLink.replace("wfapi/describe", "consoleText");

        try {
          const res = await fetch(vLink);
          if (!res.ok) {
            const errorMsg = `Failed to fetch logs for ${term}. Status: ${res.status}`;
            console.error(`RhelCard: ${errorMsg} (URL: ${vLink})`);
            if (!fetchError.value) fetchError.value = errorMsg;
            anErrorOccurredInLoop = true;
            continue; // Try next term
          }

          let vText = await res.text();

          if (typeof vText === "string") {
            const lineWithVersion = vText
              .split("\n")
              .find((line) => line.includes("version="));

            let versionValue = null;
            if (lineWithVersion) {
              const parts = lineWithVersion.split("version=");
              if (parts.length > 1 && parts[1].trim() !== "") {
                versionValue = parts[1].trim();
              }
            }

            if (versionValue) {
              tempVersions.push(versionValue);
              console.log(
                `RhelCard: Found version for ${term}: ${versionValue}`
              );
            } else {
              console.log(
                `RhelCard: No 'version=' line found in logs for ${term} from ${vLink}. You may need to inspect the full log content.`
              );
            }
          }
        } catch (e) {
          const errorMsg = `Error processing version for ${term}: ${e.message}`;
          console.error(`RhelCard: ${errorMsg} (URL: ${vLink})`, e);
          if (!fetchError.value) fetchError.value = errorMsg;
          anErrorOccurredInLoop = true;
        }
      } else {
        // This case means a "success" blueprint was found but is missing critical data.
        console.warn(
          `RhelCard: Blueprint match for term '${term}' found, but missing '_links.self.href' or 'name'. Match:`,
          firstMatch
        );
        // Optionally, treat this as an error that should be displayed
        // if (!fetchError.value) fetchError.value = `Data integrity issue for ${term}`;
        // anErrorOccurredInLoop = true;
      }
    } else {
      console.log(
        `RhelCard: No successful blueprint found matching criteria for term: ${term}`
      );
    }
  }
  processedVersions.value = tempVersions;
  // If fetchError was set by the initial data load (fetchVersions),
  // and the loop itself had no new errors, don't clear the initial error.
  // If the loop had errors, fetchError would have been set by the first one.
  // If initial load was fine and loop was fine, fetchError remains null.
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
    console.error("RhelCard: Failed to fetch data:", e);
    fetchError.value = "Failed to load";
    fetchedData.value = null;
  } finally {
    if (fetchError.value) {
      loading.value = false;
    }
  }
};
</script>
