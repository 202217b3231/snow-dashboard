<script setup>
import { defineEmits } from "vue";
import { Trash, RefreshCw } from "lucide-vue-next";
const emit = defineEmits(["deleteUser", "refreshUser"]);

const props = defineProps({
  columns: Array,
  users: Array,
  data: Object,
  loadingUser: [String, Number, null],
});
</script>

<template>
  <div class="mt-5">
    <table class="table text-xl table-zebra">
      <thead class="text-xl bg-base-200">
        <tr>
          <th>User</th>
          <th v-for="(col, index) in columns" :key="index">
            {{ col.name }}
          </th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user }}</td>
          <td v-for="col in columns" :key="col.tableName">
            <span
              v-if="loadingUser == user"
              class="loading loading-bars loading-lg text-info"
            ></span>

            <template v-else-if="data && data[user]">
              <span v-if="data[user] && data[user]._error" class="text-error">
                {{ data[user].message || "Error" }}
              </span>

              <template v-else>
                <a
                  v-if="
                    data[user].hasOwnProperty(col.tableName) &&
                    data[user][col.tableName + 'Url']
                  "
                  :href="data[user][col.tableName + 'Url']"
                  target="_blank"
                  class="link link-info"
                >
                  {{ data[user][col.tableName] }}
                </a>
                <span v-else-if="data[user].hasOwnProperty(col.tableName)">
                  {{ data[user][col.tableName] }}
                </span>
                <span v-else>-</span>
              </template>
            </template>

            <template v-else>
              <span>-</span>
            </template>
          </td>
          <td class="flex gap-5">
            <RefreshCw
              class="btn btn-ghost btn-info btn-sm"
              @click="$emit('refreshUser', user)"
            />
            <Trash
              class="btn btn-ghost btn-error btn-sm"
              @click="$emit('deleteUser', index)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
