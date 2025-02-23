import Navbar from "./Navbar";
import React, { useState, useEffect, useRef } from "react";
import UserForm from "./UserForm";
import DataTable from "./DataTable";
import SettingsModal from "./SettingsModal";
import snowIcon from "../public/snow.png";
import { Popconfirm, Button, message, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      .toISOString()
      .split("T")[0],
  });
  const [jiraUrl, setJiraUrl] = useState("https://jira.jnj.com");
  const [snowUrl, setSnowUrl] = useState("https://jnjprod.service-now.com");
  const [columns, setColumns] = useState([
    { name: "ID", tableName: "sys_user", key: 0 },
    { name: "Incident", tableName: "incident", key: 1 },
    { name: "Changes", tableName: "change_request", key: 2 },
    { name: "Task", tableName: "sc_task", key: 3 },
    { name: "Personal Task", tableName: "personal_task", key: 4 },
    { name: "Jira", tableName: "issuetable", key: 5 },
  ]);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const isInitialRender = useRef(true);
  const copyDataRef = useRef(() => {});

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    if (isInitialRender.current) {
      const storedUsers = localStorage.getItem("users");
      const storedColumns = localStorage.getItem("columns");
      const storedTheme = localStorage.getItem("theme");

      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
        parsedUsers.forEach((user, index) => user?.id && fetchRowData(index));
      }
      if (storedColumns) setColumns(JSON.parse(storedColumns));
      if (storedTheme) setTheme(storedTheme);
      isInitialRender.current = false;
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("columns", JSON.stringify(columns));
    localStorage.setItem("theme", theme);
  }, [users, columns, theme]);

  useEffect(() => {
    copyDataRef.current = () => {
      const tableData =
        columns.map((col) => col.name).join("\t") +
        "\n" +
        users
          .map((user) =>
            columns
              .map((col) => {
                const colName = col.name.toLowerCase().replace(" ", "");
                return user.data[colName] !== "loading"
                  ? user.data[colName]
                  : user.id;
              })
              .join("\t")
          )
          .join("\n");
      navigator.clipboard.writeText(tableData);
    };
  }, [users, columns]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const addUser = (e) => {
    if (form.id) {
      setUsers((prev) => [...prev, { ...form, data: {} }]);
      setForm({ id: "", startDate: "", endDate: "" });
    }
  };

  const clearData = () => {
    confirm({
      title: "Are you sure you want to clear all data?",
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setUsers([]);
        message.success("All data cleared");
      },
      onCancel() {
        message.error("Action cancelled");
      },
    });
  };

  const confirmRemoveUser = (index) => {
    setUsers((prev) => prev.filter((_, userIndex) => userIndex !== index));
    message.success(`User ${users[index].id} removed`);
  };

  const cancelAction = () => {
    message.error("Action cancelled");
  };

  const generateTemplateUrls = (userId, startDate, endDate) => {
    const startDateFormatted = startDate
      ? `javascript:gs.dateGenerate('${startDate}', '00:00:00')`
      : "javascript:gs.beginningOfLastMonth()";
    const endDateFormatted = endDate
      ? `javascript:gs.dateGenerate('${endDate}', '23:59:59')`
      : "javascript:gs.endOfLastMonth()";

    return columns.map((col) => {
      let urlTemplate = "";
      if (col.tableName === "issuetable") {
        urlTemplate = `${jiraUrl}/issues/?filter=-1&jql=created >= ${startDate} AND created <= ${endDate} AND assignee in (${userId}) order by updated DESC`;
      } else {
        urlTemplate = `${snowUrl}/${col.tableName}_list.do?sysparm_query=assigned_to.user_name=${userId}^sys_created_onBETWEEN${startDateFormatted}@${endDateFormatted}`;
      }
      return urlTemplate;
    });
  };

  const fetchTableData = async (url, tableName) => {
    try {
      console.log(`Fetching data from ${url} for table ${tableName}`);

      const response = await fetch(url);
      const text = await response.text();
      console.log(`Fetched text for ${tableName}:`, text);

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const element = doc.querySelector(`#${tableName} tbody`);
      console.log(`Parsed element for table ${tableName}:`, element);

      return element ? element.rows.length : 0;
    } catch (error) {
      console.log(`Failed to fetch data from ${url}. Error: ${error}`);
      return "error";
    }
  };

  const fetchRowData = async (index) => {
    if (!users[index] || !users[index].id) return;
    setLoading(true);
    const user = users[index].id;
    const startDate = form.startDate;
    const endDate = form.endDate;
    const templateUrls = generateTemplateUrls(user, startDate, endDate);
    const newData = { ...users[index].data };

    columns.forEach((col) => {
      const colName = col.name.toLowerCase().replace(" ", "");
      newData[colName] = "loading";
    });

    setUsers((prevUsers) => {
      const newUsers = [...prevUsers];
      newUsers[index] = { ...newUsers[index], data: newData };
      return newUsers;
    });

    const fetchPromises = columns.map((col, idx) => {
      const colName = col.name.toLowerCase().replace(" ", "");
      if (colName !== "id") {
        return fetchTableData(templateUrls[idx], col.tableName)
          .then((count) => {
            newData[colName] = count;
            newData[colName + "Url"] = templateUrls[idx];
            console.log(`Data count for ${col.tableName}: ${count}`);
          })
          .catch((error) => {
            newData[colName] = "error";
            console.log(
              `Error fetching data for ${templateUrls[idx]}: ${error}`
            );
          });
      }
      return Promise.resolve();
    });

    await Promise.all(fetchPromises);

    setUsers((prevUsers) => {
      const newUsers = [...prevUsers];
      if (JSON.stringify(newUsers[index].data) !== JSON.stringify(newData)) {
        newUsers[index] = { ...newUsers[index], data: newData };
      }
      return newUsers;
    });
    setLoading(false);
  };

  const resetColumns = () => {
    localStorage.removeItem("columns");
    setColumns([
      { name: "ID", tableName: "sys_user", key: 0 },
      { name: "Incident", tableName: "incident", key: 1 },
      { name: "Changes", tableName: "change_request", key: 2 },
      { name: "Task", tableName: "sc_task", key: 3 },
      { name: "Personal Task", tableName: "personal_task", key: 4 },
      { name: "Jira", tableName: "issuetable", key: 5 },
    ]);
  };

  const openOptionsPage = () => {
    if (chrome && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("index.html"));
    }
  };

  const addColumn = (newColumn) => {
    setColumns((prev) => [...prev, { ...newColumn, key: prev.length }]);
  };

  return (
    <div>
      <Navbar
        snowIcon={snowIcon}
        openOptionsPage={openOptionsPage}
        setIsAboutModalOpen={setIsAboutModalOpen}
        setIsModalOpen={setIsModalOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <Modal
        title="About Me"
        open={isAboutModalOpen}
        onOk={() => setIsAboutModalOpen(false)}
        onCancel={() => setIsAboutModalOpen(false)}
      >
        <p>Himanshu</p>
        <p>202217b3231</p>
      </Modal>
      <UserForm
        handleInputChange={(e) =>
          setForm({ ...form, [e.target.name]: e.target.value })
        }
        addUser={addUser}
        clearData={clearData}
        cancelAction={cancelAction}
        copyData={() => copyDataRef.current()}
        form={form}
      />

      <hr />
      <DataTable
        users={users}
        columns={columns}
        fetchRowData={fetchRowData}
        removeUser={(index) => confirmRemoveUser(index)}
      />
      <SettingsModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        snowUrl={snowUrl}
        setSnowUrl={setSnowUrl}
        jiraUrl={jiraUrl}
        setJiraUrl={setJiraUrl}
        columns={columns.map((col) => ({
          name: col.name,
          tableName: col.tableName,
        }))}
        handleColumnChange={(index, field, value) => {
          const newColumns = [...columns];
          newColumns[index][field] = value;
          setColumns(newColumns);
        }}
        addColumn={addColumn}
        removeColumn={(index) =>
          setColumns((prev) => prev.filter((_, i) => i !== index))
        }
        resetColumns={resetColumns}
      />
    </div>
  );
}
