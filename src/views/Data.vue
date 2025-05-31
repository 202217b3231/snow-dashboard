<template>
  <div class="grid p-10">
    <nav class="card flex-row justify-between items-center">
      <form class="flex gap-5" @submit.prevent="addUser">
        <label class="input">
          <input type="text" v-model="newUserId" placeholder="User Id" />
          <span class="label btn">Add</span>
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
        <button class="btn btn-outline btn-md">Edit Columns</button>
      </div>
    </nav>

    <div class="mt-5">
      <table class="table text-xl table-zebra">
        <thead class="text-xl bg-base-200">
          <tr>
            <th>User</th>
            <th v-for="col in columns" :key="col.tableName">
              {{ col.columnName }}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td v-for="col in columns" :key="col.tableName">
              {{ user[col.tableName] }}
            </td>
            <td class="flex gap-5">
              <RefreshCw
                class="btn btn-info btn-sm"
                @click="refreshUser(user.id)"
              />
              <Trash class="btn btn-error btn-sm" @click="deleteUser(index)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Trash, RefreshCw } from "lucide-vue-next";

const columns = ref([
  { columnName: "Incident", tableName: "incident" },
  { columnName: "Change", tableName: "change_request" },
  { columnName: "Change Task", tableName: "change_task" },
  { columnName: "Task", tableName: "task" },
  { columnName: "Personal Task", tableName: "personal_task" },
  { columnName: "Jira", tableName: "issuetable" },
]);

const users = ref([
  {
    id: "user1",
    incident: "Incident A",
    change_request: "Change A",
    change_task: "Task A",
    task: "Task B",
    personal_task: "Task C",
    issuetable: "Jira A",
  },
]);

const newUserId = ref("");
const startDate = ref("");
const endDate = ref("");

const addUser = () => {
  if (newUserId.value) {
    users.value.push({
      id: newUserId.value,
      incident: "",
      change_request: "",
      change_task: "",
      task: "",
      personal_task: "",
      issuetable: "",
    });
    newUserId.value = "";
  }
};

const clearData = () => {
  users.value = []; // Clear user data
};

const refreshUser = (userId) => {
  // Implement the refresh logic for the user with the given ID
  console.log(`Refreshing user data for: ${userId}`);
};

const deleteUser = (index) => {
  users.value.splice(index, 1); // Remove user at the specified index
};
</script>

<style>
.btn,
.input {
  border-radius: 0.5rem;
}
</style>
