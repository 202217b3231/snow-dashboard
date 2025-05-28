<script setup></script>

<template>
  <div class="flex h-screen w-screen">
    <aside class="bg-red-200 w-1/6">
      <ul class="flex flex-col gap-4 p-4">
        <router-link to="/">Go to Home</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/notes">Notes</router-link>
      </ul>
    </aside>
    <main class="bg-blue-200 flex-1"><router-view></router-view></main>
  </div>
</template>

<style></style>
