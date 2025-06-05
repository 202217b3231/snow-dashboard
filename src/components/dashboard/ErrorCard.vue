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
          class="mt-2 p-2 whitespace-pre-wrap"
        >
            {{ e }}
          </pre
        >
      </div>
      <pre v-else class="mt-2 p-2">Check logs for more.</pre>
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
import { computed, ref, watchEffect } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const loading = ref(false);
const Errors = ref([]);
const baseJenkinsLink = "https://jenkins.eat.jnj.com";
const jenkinsJobLink = ref("");
const consoleLink = ref("");

const errorDetails = computed(() =>
  props.data?.status?.toLowerCase() === "failed" ? props.data : null
);

watchEffect(() => {
  const currentError = errorDetails.value;

  if (currentError && currentError._links?.self?.href) {
    const newBaseLink = baseJenkinsLink + currentError._links.self.href;
    const newJenkinsJobLink = newBaseLink.replace(
      "wfapi/describe",
      "consoleText"
    );
    const newConsoleLink = newBaseLink.replace("wfapi/describe", "console");

    jenkinsJobLink.value = newJenkinsJobLink;
    consoleLink.value = newConsoleLink;

    if (props.isActive) {
      console.log(
        "ErrorCard: Tab is active and error details present. Fetching logs for:",
        newJenkinsJobLink
      );
      fetchError(newJenkinsJobLink);
    } else {
      console.log(
        "ErrorCard: Error details present, but tab is not active. Logs will be fetched when tab becomes active. Link:",
        newJenkinsJobLink
      );
    }
  } else {
    jenkinsJobLink.value = "";
    consoleLink.value = "";
    Errors.value = [];
    loading.value = false;
    console.log("ErrorCard: No error details to display or fetch.");
  }
});

const fetchError = async (url) => {
  if (!url) {
    Errors.value = ["Error: No Jenkins URL provided to fetch logs."];
    loading.value = false;
    return;
  }
  loading.value = true;
  Errors.value = [];
  try {
    const res = await fetch(url);
    if (!res.ok) {
      Errors.value = [
        `Error: Failed to fetch logs from Jenkins. Status: ${res.status}`,
      ];
      console.log(
        `%cFailed to fetch error details from ${url}. Status: ${res.status}`,
        "background:#FFFF55;color:black;"
      );
      return;
    }

    let rawText = await res.text();

    const errorLines = rawText
      .split("\n")
      .filter((line) => line.toLowerCase().includes("error:"));

    if (errorLines.length > 0) {
      Errors.value = errorLines;
    } else {
      Errors.value = [
        "No specific 'error:' lines found in logs. Check full logs.",
      ]; // Optional: message if no "error:" lines
    }
  } catch (error) {
    console.log(
      "%cError fetching Jenkins console text:",
      "background:#FFFF55;color:black;",
      error
    );
    Errors.value = [
      `An error occurred while fetching details: ${error.message}`,
    ];
  } finally {
    loading.value = false;
  }
};
</script>
