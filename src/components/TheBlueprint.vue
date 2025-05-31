<template :place="placename">
  <div>
    <label class="input absolute -top-10 right-0 w-[60%]">
      <span class="label">🔍&#65038;</span>
      <input type="search" class="" :placeholder="props.placelabel" />
      <button
        v-if="props.refetch"
        class="label cursor-pointer"
        @click="props.refetch"
      >
        🔃&#65038;
      </button>
    </label>
    <slot></slot>
  </div>
</template>

<script setup>
// import { ref } from "vue";

const props = defineProps({
  placelabel: {
    type: String,
    default: "Filter",
  },
  refetch: {
    type: Function,
    default: null,
  },
});
</script>

<style>
input::placeholder {
  color: var(--color-base);
}
</style>
