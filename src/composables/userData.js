import useLocalStorage from "@/composables/localStorage";
import { ref } from "vue";

export default class useUsers {
  constructor() {
    this.jiraUrl = "https://jira.jnj.com";
    this.snowUrl = "https://jnjprod.service-now.com";

    this.saveUsers = new useLocalStorage("Users");
    this.saveColumns = new useLocalStorage("Columns");

    this.error = ref(null);

    const loadedUsers = this.saveUsers.load();
    this.users = ref(loadedUsers || []);

    this.defaultColumns = ref([
      { name: "Incident", tableName: "incident" },
      { name: "Changes", tableName: "change_request" },
      { name: "Change Task", tableName: "change_task" },
      { name: "Task", tableName: "sc_task" },
      { name: "Jira", tableName: "issuetable" },
      { name: "Personal Task", tableName: "personal_task" },
    ]);

    const loadedColumns = this.saveColumns.load();

    this.columns = ref(
      loadedColumns
        ? loadedColumns
        : JSON.parse(JSON.stringify(this.defaultColumns.value))
    );
  }

  async fetchData(user, startDate, endDate) {
    this.error.value = null;
    const newData = {};
    const startDateFormatted = startDate
      ? `javascript:gs.dateGenerate('${startDate}', '00:00:00')`
      : "javascript:gs.beginningOfLastMonth()";
    const endDateFormatted = endDate
      ? `javascript:gs.dateGenerate('${endDate}', '23:59:59')`
      : "javascript:gs.endOfLastMonth()";

    const templateUrls = this.columns.value.map((col) => {
      if (col.tableName === "issuetable") {
        return `${this.jiraUrl}/issues/?filter=-1&jql=created >= ${startDate} AND created <= ${endDate} AND assignee in (${user}) order by updated DESC`;
      } else {
        return `${this.snowUrl}/${col.tableName}_list.do?sysparm_query=assigned_to.user_name=${user}^sys_created_onBETWEEN${startDateFormatted}@${endDateFormatted}`;
      }
    });

    let hasIndividualErrors = false;
    const fetchPromises = this.columns.value.map(async (col, idx) => {
      const columnKey = col.tableName;
      try {
        const response = await fetch(templateUrls[idx]);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const element = doc.querySelector(`#${col.tableName} tbody`);
        newData[columnKey] = element ? element.rows.length : 0;
        newData[columnKey + "Url"] = templateUrls[idx];
      } catch (error) {
        console.log(
          `%cError fetching data for column ${columnKey} from ${templateUrls[idx]}:`,
          "background:#FFFF55;color:black;",
          error
        );
        newData[columnKey] = "error";
        newData[columnKey + "Url"] = templateUrls[idx];
        hasIndividualErrors = true;
      }
    });

    try {
      await Promise.all(fetchPromises);
      if (hasIndividualErrors) {
        this.error.value =
          "One or more columns failed to load. Check console for details.";
      }
      console.log("Fetched data:", newData);
    } catch (error) {
      console.log(
        "Critical error during data fetching process:",
        "background:#FFFF55;color:black;",
        error
      );
      this.error.value =
        error.message || "Failed to fetch data due to a critical error.";
    }
    return newData;
  }

  addUser(userValue) {
    if (userValue) {
      this.users.value.push(userValue);
      this.saveUsers.save(this.users.value);
    }
  }

  deleteUser(index) {
    if (index >= 0 && index < this.users.value.length) {
      this.users.value.splice(index, 1);
      this.saveUsers.save(this.users.value);
    } else {
      console.log(`Invalid index ${index} for deleting user.`);
    }
  }

  addColumn(columnData = { name: "", tableName: "" }) {
    this.columns.value.push(columnData);
    this.saveColumns.save(this.columns.value);
  }

  removeColumn(index) {
    if (index >= 0 && index < this.columns.value.length) {
      this.columns.value.splice(index, 1);
      this.saveColumns.save(this.columns.value);
    } else {
      console.log(`Invalid index ${index} for deleting column.`);
    }
  }

  resetColumnsToDefault() {
    this.columns.value = JSON.parse(JSON.stringify(this.defaultColumns.value));
    this.saveColumns.save(this.columns.value);
  }
}
