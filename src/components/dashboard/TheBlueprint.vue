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
        @click="handleRefresh"
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
      <span
        v-if="loading"
        class="loading loading-bars loading-lg text-info"
      ></span>
      <div
        v-else-if="fetchError"
        class="text-center p-4 text-error col-span-full"
      >
        Error: {{ fetchError }}
      </div>
      <tbody v-else-if="TheData.length > 0">
        <tr
          v-for="(item, index) in TheData"
          :key="index"
          class="cursor-pointer hover:bg-base-100 active:bg-base-300"
          :class="
            item.status === 'FAILED'
              ? 'text-red-500 '
              : item.status === 'SUCCESS'
              ? 'text-green-500'
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
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { useBlueprintStore } from "@/composables/blueprintStore";

const dataStore = useBlueprintStore();

const emit = defineEmits(["selectBlueprint", "statData"]);

const fetchedApiData = ref(null);

const filterSearchTerm = ref("");
const loading = ref(false);
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
  }
  if (props.placelabel === "orchestrate") {
    sourceDataArray = fetchedApiData.value?.orchestrate || [];
  }
  if (props.data?.stages) {
    if (Array.isArray(props.data.stages)) {
      sourceDataArray = props.data.stages;
    } else {
      console.log(props.data.stages);
      sourceDataArray = [];
    }
  }
  return dataStore.filterData(sourceDataArray, filterSearchTerm.value);
});

const fetchData = async () => {
  fetchError.value = null;
  loading.value = true;
  try {
    fetchedApiData.value = await dataStore.allData;
    console.log("Fetch data.");
  } catch (e) {
    console.error("TheBlueprint: Failed to fetch data:", e);
    fetchError.value =
      e.message || "An unknown error occurred while fetching data.";
  } finally {
    loading.value = false;
  }
};

async function handleRefresh() {
  loading.value = true;
  try {
    fetchedApiData.value = await dataStore.allData;
    console.log(fetchedApiData.value);
  } catch (error) {
    console.error("Error fetching data", error);
  } finally {
    if (fetchedApiData.value) {
      loading.value = false;
    }
  }
}

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
