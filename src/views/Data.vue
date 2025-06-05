<template>
  <div class="grid p-10">
    <nav class="card flex lg:flex-row flex-wrap justify-between gap-5">
      <form class="flex gap-5" @submit.prevent="addUser">
        <label class="input input-bordered flex items-center gap-2">
          <input
            type="text"
            v-model="newUserInput"
            placeholder="User Id"
            class="grow"
          />
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
        <button
          class="btn btn-outline btn-md tooltip"
          :data-tip="copyButtonTooltipText"
          @click="copyData"
          onclick="this.data-tip=Copied!!"
        >
          Copy
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
        <table class="table table-xs">
          <thead class="bg-base-200">
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
                  class="btn btn-ghost btn-error btn-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <form method="dialog" class="modal-action">
          <label class="btn btn-info mr-10" @click="addColumn"
            >Add Column</label
          >
          <label class="btn btn-error mr-10" @click="resetColumns"
            >Reset Column</label
          >
          <button class="btn btn-outline">Close</button>
        </form>
      </div>
    </dialog>
    <!--  -->
    <!-- Data Table -->
    <data-table
      @deleteUser="deleteUser"
      @refreshUser="refreshUser"
      :columns="columns"
      :users="users"
      :data="data"
      :loadingUser="loadingUser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Trash } from "lucide-vue-next";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import DataTable from "@/components/Data/DataTable.vue";
import useUsers from "@/composables/userData";

const newUserInput = ref("");
const UsersInstance = new useUsers();

const users = UsersInstance.users;
const columns = UsersInstance.columns;

const data = ref({}); // Initialize as an object
const loadingUser = ref(null);
const copyButtonTooltipText = ref("Copy!");

// Local storage keys
const LS_START_DATE_KEY = "dashboard_app_startDate";
const LS_END_DATE_KEY = "dashboard_app_endDate";
const LS_DATA_KEY = "dashboard_app_data";

const startDate = ref(
  format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd")
);
const endDate = ref(format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"));

const addUser = () => {
  const trimmedUser = newUserInput.value.trim();
  if (trimmedUser) {
    UsersInstance.addUser(trimmedUser);
    newUserInput.value = "";
  } else {
    console.warn("User ID cannot be empty.");
  }
};

const deleteUser = (index) => {
  UsersInstance.deleteUser(index);
};

const addColumn = () => {
  UsersInstance.addColumn();
};

const removeColumn = (index) => {
  UsersInstance.removeColumn(index);
};

const resetColumns = () => {
  UsersInstance.resetColumnsToDefault();
};

const refreshUser = async (userId) => {
  loadingUser.value = userId;
  console.log(`Refreshing data for user: ${userId}`);
  try {
    const fetchedData = await UsersInstance.fetchData(
      userId,
      startDate.value,
      endDate.value
    );

    data.value = {
      ...data.value,
      [userId]: fetchedData,
    };
    localStorage.setItem(LS_DATA_KEY, JSON.stringify(data.value));
  } catch (error) {
    console.error("Error refreshing user data:", error);
  } finally {
    loadingUser.value = null;
  }
  console.log("Updated data state:", data.value);
};

const copyData = async () => {
  let tableString = "";

  // Header row
  const headerCells = ["User", ...columns.value.map((col) => col.name)];
  tableString += headerCells.join("\t") + "\n";

  // Data rows
  users.value.forEach((user) => {
    const rowCells = [user];
    columns.value.forEach((col) => {
      let cellValue = "-"; // Default value
      if (data.value && data.value[user]) {
        if (data.value[user]._error) {
          cellValue = data.value[user].message || "Error";
        } else if (data.value[user].hasOwnProperty(col.tableName)) {
          cellValue = String(data.value[user][col.tableName]); // Ensure it's a string
        }
      }
      rowCells.push(cellValue);
    });
    tableString += rowCells.join("\t") + "\n";
  });

  try {
    await navigator.clipboard.writeText(tableString);
    copyButtonTooltipText.value = "Copied!!";
  } catch (err) {
    console.error("Failed to copy table data: ", err);
    copyButtonTooltipText.value = "Failed to copy!";
  } finally {
    setTimeout(() => {
      copyButtonTooltipText.value = "Copy!"; // Reset tooltip after 2 seconds
    }, 2000);
  }
};

onMounted(() => {
  const storedStartDate = localStorage.getItem(LS_START_DATE_KEY);
  if (storedStartDate) {
    startDate.value = storedStartDate;
  }

  const storedEndDate = localStorage.getItem(LS_END_DATE_KEY);
  if (storedEndDate) {
    endDate.value = storedEndDate;
  }

  const storedData = localStorage.getItem(LS_DATA_KEY);
  if (storedData) {
    try {
      data.value = JSON.parse(storedData);
    } catch (e) {
      console.error("Failed to parse stored data from localStorage:", e);
      localStorage.removeItem(LS_DATA_KEY); // Clear corrupted data
      data.value = {}; // Reset to initial empty object
    }
  }
});

watch(startDate, (newStartDate) => {
  localStorage.setItem(LS_START_DATE_KEY, newStartDate);
});

watch(endDate, (newEndDate) => {
  localStorage.setItem(LS_END_DATE_KEY, newEndDate);
});
</script>
