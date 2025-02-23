import React from "react";
import { Modal, Button, Input, Table, Tooltip } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { FaAudioDescription } from "react-icons/fa";

export default function SettingsModal({
  isModalOpen,
  closeModal,
  snowUrl,
  setBaseSnowUrl,
  jiraUrl,
  setJiraUrl,
  addColumn,
  columns,
  handleColumnChange,
  removeColumn,
  resetColumns,
}) {
  const { confirm } = Modal;
  const defaultColumns = [
    { name: "ID", tableName: "sys_user" },
    { name: "Incident", tableName: "incident" },
    { name: "Changes", tableName: "change_request" },
    { name: "Task", tableName: "sc_task" },
    { name: "Personal Task", tableName: "personal_task" },
    { name: "Jira", tableName: "issuetable" },
  ];
  const showResetConfirm = () => {
    confirm({
      title: "Reset columns to default?",
      icon: <ExclamationCircleFilled />,
      content: (
        <div>
          <p>This action cannot be undone.</p>
          <ul>
            {defaultColumns.map((col, index) => (
              <li key={index}>
                {col.name} -- {col.tableName}
              </li>
            ))}
          </ul>
        </div>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        resetColumns();
      },
    });
  };
  const handleAddColumn = () => {
    addColumn({ name: "", tableName: "" });
  };
  const columnsConfig = [
    {
      title: (
        <Tooltip title="Enter the column name">
          <span>Column Name</span>
        </Tooltip>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleColumnChange(index, "name", e.target.value)}
          placeholder="Column Name"
        />
      ),
    },
    {
      title: (
        <Tooltip title="Enter the table name">
          <span>Table Name</span>
        </Tooltip>
      ),
      dataIndex: "tableName",
      key: "tableName",
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) =>
            handleColumnChange(index, "tableName", e.target.value)
          }
          placeholder="Table Name"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <Button danger onClick={() => removeColumn(index)}>
          Remove
        </Button>
      ),
    },
  ];
  return (
    <Modal
      width={1000}
      title="Settings"
      open={isModalOpen}
      onCancel={closeModal}
      footer={[
        <Tooltip title="Reset columns to default" key="reset-tooltip">
          <Button
            color="purple"
            variant="outlined"
            key="reset"
            onClick={showResetConfirm}
          >
            Reset
          </Button>
        </Tooltip>,
        <Button key="close" onClick={closeModal}>
          Close
        </Button>,
      ]}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <Tooltip title="Enter the ServiceNow URL">
          <Input
            type="text"
            value={snowUrl}
            onChange={(e) => setBaseSnowUrl(e.target.value)}
            placeholder="Servicenow Url"
            style={{ marginBottom: "10px" }}
          />
        </Tooltip>
        <Tooltip title="Enter the Jira URL">
          <Input
            type="text"
            value={jiraUrl}
            onChange={(e) => setJiraUrl(e.target.value)}
            placeholder="Jira Url"
            style={{ marginBottom: "10px" }}
          />
        </Tooltip>
        <Button
          color="cyan"
          variant="solid"
          onClick={handleAddColumn}
          style={{ marginBottom: "10px" }}
        >
          Add Column
        </Button>
      </div>
      <Table
        dataSource={columns.map((col, index) => ({
          key: index,
          name: col.name,
          tableName: col.tableName,
        }))}
        columns={columnsConfig}
        pagination={false}
        rowKey={(record) => record.key}
      />
    </Modal>
  );
}
