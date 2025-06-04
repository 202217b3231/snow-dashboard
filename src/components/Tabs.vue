<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="tabs tabs-box h-full rounded-lg overflow-y-scroll">
    <template v-for="tab in tabs">
      <input
        type="radio"
        :name="name"
        :aria-label="tab.label"
        class="tab"
        :checked="tab.initialChecked"
        :id="tab.id"
      />
      <div class="tab-content card" role="tabpanel">
        <slot :name="tab.id"></slot>
      </div>
    </template>
  </div>
</template>
