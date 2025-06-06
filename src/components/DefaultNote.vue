<template>
  <div class="p-5 mx-10">
    <div class="flex gap-4">
      <button class="btn btn-info btn-xs" @click="fetchFailedItems">
        Fetch
      </button>
      <button
        @click="copySelectedNoteContent"
        class="btn btn-info btn-xs tooltip"
        :data-tip="copyHtmlTooltip"
      >
        Copy HTML
      </button>
      <div class="btn btn-xs btn-info" @click="sheetRef.contentEditable = true">
        Edit
      </div>
    </div>
  </div>

  <div
    ref="sheetRef"
    style="font-family: Arial, sans-serif; line-height: 2em; font-size: medium"
    class="p-5 mx-50"
  >
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
      <li v-for="(item, i) in winFailedItems" :key="i">{{ item.name }}</li>
      <div v-if="loading" class="skeleton h-10 w-full"></div>
    </ul>
    <h4>Issue: RHEL</h4>
    <ul>
      <li v-for="(item, i) in rhelFailedItems" :key="i">{{ item.name }}</li>
      <div v-if="loading" class="skeleton h-10 w-full"></div>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useBlueprintStore } from "@/composables/blueprintStore";

const copyHtmlTooltip = ref("Copy");
const dataStore = useBlueprintStore();
const sheetRef = ref(null);
const allItems = ref(null);
const loading = ref(false);

const winFailedItems = computed(() => {
  const blueprintData = allItems.value?.blueprint;
  if (blueprintData) {
    const filtered = dataStore.filterData(blueprintData, "win failed");

    return filtered;
  }

  return [];
});
const rhelFailedItems = computed(() => {
  const blueprintData = allItems.value?.blueprint;
  if (blueprintData) {
    const filtered = dataStore.filterData(blueprintData, "rhel failed");

    return filtered;
  }

  return [];
});

const fetchFailedItems = async () => {
  loading.value = true;
  console.log("[Fetch] Starting fetch...");
  try {
    const fetchedData = await dataStore.allData;
    console.log(
      "[Fetch] Data received from store:",
      JSON.parse(JSON.stringify(fetchedData))
    );
    allItems.value = fetchedData;

    if (allItems.value) {
      console.log(
        "[Fetch] Saving to local storage:",
        JSON.parse(JSON.stringify(allItems.value))
      );
    } else {
      console.log(
        "[Fetch] Fetched data is null/undefined. Local storage will not be modified."
      );
    }
  } catch (e) {
    console.error("[Fetch] Failed to fetch data:", e);
  } finally {
    loading.value = false;
    console.log("[Fetch] Fetch finished. Loading set to false.");
  }
};
async function copySelectedNoteContent() {
  if (sheetRef.value) {
    try {
      const htmlContent = sheetRef.value.innerHTML;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      await navigator.clipboard.write([clipboardItem]);
      copyHtmlTooltip.value = "Copied HTML!";
    } catch (err) {
      console.error("Failed to copy HTML content: ", err);
      try {
        await navigator.clipboard.writeText(sheetRef.value.innerText);
        copyHtmlTooltip.value = "Copied as plain text (HTML copy failed)";
      } catch (fallbackErr) {
        console.error("Fallback plain text copy failed: ", fallbackErr);
        copyHtmlTooltip.value = "Failed to copy";
      }
    }
  } else {
    copyHtmlTooltip.value = "Nothing to copy (sheet not found)";
    console.warn("Sheet element ref is not available.");
  }

  const initialTooltip = "Copy";
  if (copyHtmlTooltip.value !== initialTooltip) {
    setTimeout(() => {
      copyHtmlTooltip.value = initialTooltip;
    }, 2500);
  }
}
</script>
