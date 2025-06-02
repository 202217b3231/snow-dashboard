<template>
  <div class="grid p-10">
    <nav class="card flex-row justify-between items-center">
      <form class="flex gap-5" @submit.prevent="addUser">
        <label class="input">
          <input type="text" id="newUser" placeholder="User Id" />
          <button type="submit" class="label btn">Add</button>
        </label>
        <div class="input floating-label">
          <span class="left-0">Start Date</span>
          <input type="date" v-model="startDate" />
          <input type="date" v-model="endDate" />
          <p class="absolute -top-2.5 bg-base-200 right-19 text-xs">End Date</p>
        </div>
      </form>
      <div class="flex gap-5">
        <button class="btn btn-outline btn-md">Copy</button>
        <button class="btn btn-outline btn-md" @click="clearData">
          Clear Data
        </button>
        <button
          class="btn btn-outline btn-md"
          onclick="column_modal.showModal()"
        >
          Edit Columns
        </button>
      </div>
    </nav>

    <!-- dialog -->
    <dialog id="column_modal" class="modal">
      <div class="modal-box h-[98vh] w-11/12 max-w-5xl">
        <h3 class="text-lg font-bold">Edit Columns</h3>
        <table class="table table-md">
          <thead class="text-lg bg-base-200">
            <tr>
              <th>Column Name</th>
              <th>Table Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(col, index) in columns" :key="col.key">
              <td><input type="text" class="input" v-model="col.name" /></td>
              <td>
                <input type="text" class="input" v-model="col.tableName" />
              </td>
              <td>
                <Trash
                  @click="removeColumn(index)"
                  class="btn btn-ghost btn-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <form method="dialog" class="modal-action">
          <label class="btn btn-info mr-10" @click="addColumn"
            >Add Column</label
          >
          <button class="btn btn-outline">Close</button>
        </form>
      </div>
    </dialog>
    <!--  -->

    <div class="mt-5">
      <table class="table text-xl table-zebra">
        <thead class="text-xl bg-base-200">
          <tr>
            <th>User</th>
            <th v-for="col in columns" :key="col.key">
              {{ col.name }}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{ user }}</td>
            <td v-for="col in columns" :key="col.key">-</td>
            <td class="flex gap-5">
              <RefreshCw
                class="btn btn-ghost btn-info btn-sm"
                @click="refreshUser(user)"
              />
              <Trash
                class="btn btn-ghost btn-error btn-sm"
                @click="deleteUser(index)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Trash, RefreshCw } from "lucide-vue-next";
import useLocalStorage from "@/composables/localStorage";
onMounted(() => {});

const initialColumns = ref([
  { name: "Incident", tableName: "incident", key: 1 },
  { name: "Changes", tableName: "change_request", key: 2 },
  { name: "Change Task", tableName: "change_task", key: 3 },
  { name: "Task", tableName: "sc_task", key: 4 },
  { name: "Personal Task", tableName: "personal_task", key: 5 },
  { name: "Jira", tableName: "issuetable", key: 6 },
]);

const users = ref([]);
const columns = computed(() => initialColumns.value);
const startDate = ref("");
const endDate = ref("");

const saveUsers = new useLocalStorage("Users");
const saveColumns = new useLocalStorage("Columns");

const addUser = () => {
  if (newUser.value) {
    users.value.push(newUser.value);
    newUser.value = "";
    saveUsers.save(users.value);
  }
};

const clearData = () => {
  users.value = [];
  saveUsers.save(users.value);
};

const refreshUser = (userId) => {
  console.log(`Refreshing user data for: ${userId}`);
};

const deleteUser = (index) => {
  users.value.splice(index, 1);
  saveUsers.save(users.value);
};

const addColumn = () => {
  columns.value.push({ name: "", tableName: "" });
  saveColumns.save(columns.value);
};

const removeColumn = (index) => {
  columns.value.splice(index, 1);
  saveColumns.save(columns.value);
};
</script>
