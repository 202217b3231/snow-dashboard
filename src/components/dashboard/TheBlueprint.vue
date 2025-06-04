<template>
  <div class="text-lg relative">
    <label
      class="input absolute -top-13 right-0 lg:w-[60%] w-[50%] flex items-center z-10"
    >
      <span class="label">🔍&#65038;</span>
      <input
        type="search"
        class="font-semibold"
        :placeholder="props.placelabel"
        v-model="filterSearchTerm"
      />
      <button
        class="label cursor-pointer"
        v-if="props.refetch"
        @click="handlerefetch"
      >
        🔃&#65038;
      </button>
    </label>

    <table class="table">
      <thead>
        <tr>
          <th>Started</th>
          <th>Status</th>
          <th>Name</th>
        </tr>
      </thead>
      <div v-if="loading" class="text-center p-4 col-span-full">
        Loading data...
      </div>
      <div
        v-else-if="fetchError"
        class="text-center p-4 text-error col-span-full"
      >
        Error: {{ fetchError }}
      </div>
      <tbody v-else-if="TheData.length > 0">
        <tr
          v-for="(item, index) in TheData"
          :key="item.id || index"
          class="cursor-pointer hover:bg-base-100 active:bg-base-300"
          :class="
            item.status === 'FAILED'
              ? 'text-error '
              : item.status === 'SUCCESS'
              ? 'text-success'
              : ''
          "
          @click="$emit('selectBlueprint', item)"
        >
          <td>
            {{ format(new Date(item.startTimeMillis), "dd MMMM hh:mm a") }}
          </td>
          <td>
            {{ item.status }}
          </td>
          <td>{{ item.name }}</td>
        </tr>
      </tbody>
      <div v-else class="text-center p-4 col-span-full">No data available.</div>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { format } from "date-fns";
import { useBlueprintStore } from "@/composables/blueprintStore";

const emit = defineEmits(["selectBlueprint", "statData"]);
const dataStore = useBlueprintStore();

const fetchedApiData = ref(null);

const filterSearchTerm = ref("");
const loading = ref(true);
const fetchError = ref(null);

const props = defineProps({
  placelabel: {
    type: String,
    default: "Filter",
  },
  data: Object,
  refetch: {
    type: Boolean,
    default: false,
  },
});

const TheData = computed(() => {
  let sourceDataArray = [];
  if (props.placelabel === "blueprint") {
    sourceDataArray = fetchedApiData.value?.blueprint || [];
  } else if (props.placelabel === "orchestrate") {
    sourceDataArray = fetchedApiData.value?.orchestrate || [];
  } else if (props.data?.stages) {
    if (Array.isArray(props.data.stages)) {
      sourceDataArray = props.data.stages;
    } else {
      console.warn(
        "TheBlueprint: props.data.stages was provided but is not an array.",
        props.data.stages
      );
      sourceDataArray = [];
    }
  }
  return filteredData(sourceDataArray);
});

const filteredData = (sourceArray) => {
  if (!Array.isArray(sourceArray)) return [];
  if (!filterSearchTerm.value) {
    return sourceArray;
  }
  const searchTerm = filterSearchTerm.value.toLowerCase();
  return sourceArray.filter(
    (item) => item.name && item.name.toLowerCase().includes(searchTerm)
  );
};

const fetchData = async () => {
  loading.value = true;
  fetchError.value = null;
  try {
    fetchedApiData.value = await dataStore.allData();
  } catch (e) {
    console.error("TheBlueprint: Failed to fetch data:", e);
    fetchError.value =
      e.message || "An unknown error occurred while fetching data.";
  } finally {
    loading.value = false;
  }
};

const handlerefetch = async () => {
  await fetchData();
  console.log("Data after refetch:", fetchedApiData.value);
  console.log("TheData computed value:", TheData.value);
};

onMounted(() => {
  if (
    props.placelabel === "blueprint" ||
    props.placelabel === "orchestrate" ||
    !props.data
  ) {
    fetchData();
  } else {
    loading.value = false;
  }
});
</script>
