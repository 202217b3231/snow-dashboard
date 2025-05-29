<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (value) =>
      value.every(
        (tab) =>
          typeof tab.label === "string" &&
          (tab.idSuffix === undefined || typeof tab.idSuffix === "string") &&
          (tab.initialChecked === undefined ||
            typeof tab.initialChecked === "boolean") &&
          (tab.fullHeightContent === undefined ||
            typeof tab.fullHeightContent === "boolean")
      ),
  },
  name: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="tabs tabs-box h-full rounded-lg">
    <template
      v-for="(tab, index) in tabs"
      :key="`${name}-${tab.idSuffix || index}`"
    >
      <input
        type="radio"
        :name="name"
        class="tab"
        :aria-label="tab.label"
        :checked="
          tab.initialChecked ||
          (index === 0 && !tabs.some((t) => t.initialChecked))
        "
        :id="`${name}-${tab.idSuffix || index}-radio`"
      />
      <div
        class="tab-content card"
        :class="{ 'h-full': tab.fullHeightContent }"
        role="tabpanel"
        :aria-labelledby="`${name}-${tab.idSuffix || index}-radio`"
      >
        <slot :name="`tab-content-${tab.idSuffix || index}`"></slot>
      </div>
    </template>
  </div>
</template>
