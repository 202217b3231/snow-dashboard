<template>
  <div class="">
    <div v-if="errorDetails" class="relative">
      <div
        class="absolute -top-14 right-0 font-medium text-sm lg:block grid lg:space-x-5 space-y-3"
      >
        <a :href="consoleLink" target="_blank" class="underline text-info">{{
          errorDetails.name
        }}</a>
        <span class="btn btn-outline btn-xs" @click="fetchError(jenkinsJobLink)"
          >Refresh</span
        >
      </div>
      <span
        v-if="loading"
        class="loading loading-bars loading-lg text-primary"
      ></span>

      <div v-else-if="Errors.length > 0">
        <pre
          v-for="(e, index) in Errors"
          :key="index"
          class="mt-2 p-2 text-xs whitespace-pre-wrap"
        >
            {{ e }}
          </pre
        >
      </div>
      <pre v-else class="mt-2 p-2 text-xs">Check logs for more.</pre>
    </div>
    <p
      class="text-success"
      v-else-if="props.data?.status?.toLowerCase() === 'success'"
    >
      The selected blueprint is successful. No errors to display.
    </p>
    <div v-else-if="!props.data">
      <p>No item selected.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => null,
  },
});

const loading = ref(false);

const Errors = ref([]);

const baseJenkinsLink = "https://jenkins.eat.jnj.com";
const jenkinsJobLink = ref("");
let consoleLink = "";
const errorDetails = computed(() =>
  props.data?.status?.toLowerCase() === "failed" ? props.data : null
);

watch(
  errorDetails,
  (newErrorData) => {
    if (newErrorData && newErrorData._links?.self?.href) {
      const newLink = baseJenkinsLink + newErrorData._links.self.href;
      jenkinsJobLink.value = newLink.replace("wfapi/describe", "consoleText");
      consoleLink = newLink.replace("wfapi/describe", "console");
      fetchError(jenkinsJobLink.value);
      console.log("Error detected. Jenkins link:", jenkinsJobLink.value);
    } else {
      jenkinsJobLink.value = "";
    }
  },
  { immediate: true }
);

const fetchError = async (url) => {
  loading.value = true;
  Errors.value = [];
  try {
    if (!url) {
      Errors.value = ["Error: No Jenkins URL provided to fetch logs."];
      return;
    }
    const res = await fetch(url);
    if (!res.ok) {
      Errors.value = [
        `Error: Failed to fetch logs from Jenkins. Status: ${res.status}`,
      ];
      console.error(
        `Failed to fetch error details from ${url}. Status: ${res.status}`
      );
      return;
    }

    let rawText = await res.text();

    const ansiRegex =
      /[\u001b\u009b][[()#;?]*.?[0-9A-Za-z]?([A-Za-z0-9@=><~]){0,3}(?:;[0-9A-Za-z@=><~]{0,3})*[@-~]/g;
    const cleanText = rawText.replace(ansiRegex, "");

    const errorLines = cleanText
      .split("\n")
      .filter((line) => line.toLowerCase().includes("error:"));

    if (errorLines.length > 0) {
      Errors.value = errorLines;
    }
  } catch (error) {
    console.error("Error fetching Jenkins console text:", error);
    Errors.value = [
      `An error occurred while fetching details: ${error.message}`,
    ];
  } finally {
    loading.value = false;
  }
};
</script>
