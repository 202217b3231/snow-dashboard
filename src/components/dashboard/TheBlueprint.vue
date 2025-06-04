<template>
  <div class="text-lg">
    <label
      class="input absolute -top-10 right-0 lg:w-[60%] w-[50%] flex items-center"
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
    <slot></slot>

    <div v-if="loading" class="text-center p-4">Loading data...</div>
    <div v-else-if="fetchError" class="text-center p-4 text-error">
      {{ fetchError }}
    </div>
    <table v-else-if="TheData.length > 0" class="table">
      <thead>
        <tr>
          <th>Started</th>
          <th>Status</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(data, index) in TheData"
          :key="index"
          class="cursor-pointer hover:bg-base-100 active:bg-base-300"
          :class="
            data.status === 'FAILED'
              ? 'text-error '
              : data.status === 'SUCCESS'
              ? 'text-success'
              : ''
          "
          @click="$emit('selectBlueprint', data)"
        >
          <td>
            {{ format(new Date(data.startTimeMillis), "dd MMMM hh:mm a") }}
          </td>
          <td>
            {{ data.status }}
          </td>
          <td>{{ data.name }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center p-4">No data available.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { useBlueprintStore } from "@/composables/blueprintStore";

const emit = defineEmits(["selectBlueprint", "statData"]);
const dataStore = useBlueprintStore();
const data = await dataStore.allData();
const blueprintData = computed(() => data?.blueprint);
const orchestrateData = computed(() => data?.orchestrate);

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
  let sourceData = [];
  if (props.placelabel === "blueprint") {
    sourceData = blueprintData.value;
  } else if (props.placelabel === "orchesetrate") {
    sourceData = orchestrateData.value;
  } else if (props.data) {
    if (Array.isArray(props.data.stages)) {
      sourceData = props.data.stages;
    } else if (props.data.stages !== undefined) {
      console.warn(
        "TheBlueprint: props.data.stages was provided but is not an array.",
        props.data.stages
      );
    }
  } else {
    sourceData = [];
  }
  return filteredData(Array.isArray(sourceData) ? sourceData : []);
});
</script>
