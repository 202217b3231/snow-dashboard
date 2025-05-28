<script setup></script>

<template>
  <div class="grid grid-cols-4 grid-rows-2 h-full p-3 gap-3">
    <div class="card row-span-2 col-span-2 p-0">
      <div class="tabs tabs-box h-full bg-accent rounded-lg">
        <input
          type="radio"
          name="blueprintTab"
          class="tab"
          aria-label="Blueprint"
          checked="checked"
        />

        <div class="tab-content card">Tab content 1</div>
        <input
          type="radio"
          name="blueprintTab"
          class="tab"
          aria-label="Orchestrate"
        />
        <div class="tab-content card h-full">Tab content 2</div>
      </div>
    </div>
    <div class="card">
      <h1 class="card-title">Status</h1>
    </div>

    <div class="card">
      <h1 class="card-title">Rhel Version</h1>
    </div>
    <div class="card col-span-2 p-0">
      <div class="tabs tabs-box h-full bg-accent rounded-lg">
        <input
          type="radio"
          name="ErrorTab"
          class="tab"
          aria-label="Select Blueprint"
          checked="checked"
        />
        <div class="tab-content card">Tab content 1</div>

        <input type="radio" name="ErrorTab" class="tab" aria-label="Error" />
        <div class="tab-content card h-full">Tab content 2</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
