import { defineStore } from "pinia";
import { computed } from "vue";

export const useBlueprintStore = defineStore("blueprintAllData", () => {
  const blueprintApi =
    "https://jenkins.eat.jnj.com/jetv-dev/job/CLOUDxBlueprintFactory/job/2_CreateBlueprint/wfapi/runs";

  const orchestrateApi =
    "https://jenkins.eat.jnj.com/jetv-dev/job/CLOUDxBlueprintFactory/job/1_Orchestrate/wfapi/runs";

  async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from ${url}. Status: ${response.status}`
      );
    }
    return response.json();
  }
  const filterData = (blueprints, filterTerm) => {
    if (!Array.isArray(blueprints)) {
      return [];
    }
    const searchTerm = filterTerm.value.toLowerCase().trim();
    if (!searchTerm) {
      return blueprints;
    }

    const individualFilterTerms = searchTerm
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    if (individualFilterTerms.length === 0) {
      return blueprints;
    }
    return blueprints.filter((blueprint) => {
      return individualFilterTerms.every(
        (filterTerm) =>
          (blueprint.name &&
            blueprint.name.toLowerCase().includes(filterTerm)) ||
          (blueprint.status &&
            blueprint.status.toLowerCase().includes(filterTerm))
      );
    });
  };
  const allData = computed(async () => {
    return {
      blueprint: await fetchData(blueprintApi),
      orchestrate: await fetchData(orchestrateApi),
    };
  });

  return { allData, filterData };
});
