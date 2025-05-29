<script setup>
import TheNavigation from "@/components/TheNavigation.vue";
</script>

<template>
  <div class="flex flex-col h-screen w-screen">
    <TheNavigation />
    <main class="flex-1">
      <router-view> </router-view>
    </main>
  </div>
</template>

<style scoped></style>
