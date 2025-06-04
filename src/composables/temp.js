const fetchDataAsync = async () => {
  loading.value = true;
  fetchError.value = null;
  try {
    const result = await dataStore.allData; // Assuming dataStore.allData getter fetches data
    localData.value = result;
    // console.log("Fetched data:", localData.value);
  } catch (err) {
    console.error(`Failed to fetch data for ${props.placelabel}:`, err);
    fetchError.value =
      err.message || `Failed to load ${props.placelabel} data.`;
    localData.value = null; // Clear data on error
  } finally {
    loading.value = false;
  }
};

// Helper function to count statuses for the current instance's data
const calculateInstanceStats = (dataArray) => {
  const counts = { FAILED: 0, IN_PROGRESS: 0, SUCCESS: 0 }; // Jenkins statuses are typically uppercase
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return counts;
  }

  // Filter for unique items by name (first occurrence)
  const uniqueByName = dataArray.filter(
    (item, index, self) => index === self.findIndex((b) => b.name === item.name)
  );

  for (const item of uniqueByName) {
    const statusKey = item.status?.toUpperCase(); // Ensure status is a string and uppercase
    if (statusKey && counts.hasOwnProperty(statusKey)) {
      counts[statusKey]++;
    }
  }
  return counts;
};

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
    // Ensure sourceData is an array if blueprintData or orchestrateData is initially undefined
    sourceData = [];
  }
  return filteredData(Array.isArray(sourceData) ? sourceData : []);
});

const handlerefetch = async () => {
  // console.log("Refetching data...");
  await fetchDataAsync();

  if (props.placelabel === "blueprint" || props.placelabel === "orchesetrate") {
    // Ensure TheData has been updated before calculating stats
    await nextTick(); // if calculateInstanceStats relies on DOM or fully updated TheData
    const currentStats = calculateInstanceStats(TheData.value);
    let componentName =
      props.placelabel === "blueprint" ? "Blueprint" : "Orchestrate";
    // Correct the "orchesetrate" prop value to "Orchestrate" for the name
    if (props.placelabel === "orchesetrate") {
      componentName = "Orchestrate";
    }
    emit("statData", {
      name: componentName,
      stats: currentStats,
    });
    // console.log("Data refetched successfully:", localData.value);
  }
};

// Fetch initial data and emit stats when component is mounted
onMounted(async () => {
  if (props.placelabel === "blueprint" || props.placelabel === "orchesetrate") {
    await fetchDataAsync();
    // Ensure TheData has been updated before calculating stats
    // await nextTick(); // May not be needed if calculateInstanceStats directly uses computed values that update synchronously
    const initialStats = calculateInstanceStats(TheData.value);
    let componentName =
      props.placelabel === "blueprint" ? "Blueprint" : "Orchestrate";
    if (props.placelabel === "orchesetrate") {
      // Handle potential typo from parent
      componentName = "Orchestrate";
    }
    emit("statData", {
      name: componentName,
      stats: initialStats,
    });
  } else if (props.data) {
    // If data is provided via props, and stats are needed, calculate them here.
    // For now, assuming stats are primarily for blueprint/orchestrate fetched data.
    // If props.data needs to emit stats, that logic would go here.
    // Example:
    // const initialStats = calculateInstanceStats(TheData.value); // TheData will use props.data
    // emit("statData", { name: props.placelabel, stats: initialStats });
  }
});
let componentName =
  props.placelabel === "blueprint" ? "Blueprint" : "Orchestrate";
// Correct the "orchesetrate" prop value to "Orchestrate" for the name
if (props.placelabel === "orchesetrate") {
  componentName = "Orchestrate";
}
emit("statData", {
  name: componentName,
  stats: currentStats,
});
console.log("Data refetched successfully:", data);

// Fetch initial data and emit stats when component is mounted
onMounted(async () => {
  await loadInitialData();
  if (props.placelabel === "blueprint" || props.placelabel === "orchesetrate") {
    const initialStats = calculateInstanceStats(TheData.value); // Calculate based on current TheData
    let componentName =
      props.placelabel === "blueprint" ? "Blueprint" : "Orchestrate";
    if (props.placelabel === "orchesetrate") {
      componentName = "Orchestrate";
    }
    emit("statData", {
      name: componentName,
      stats: initialStats,
    });
  }
});
