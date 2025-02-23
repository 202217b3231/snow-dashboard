import React from "react";
import { Table, Button } from "antd";

export default function DataTable({
  users,
  columns,
  fetchRowData,
  removeUser,
}) {
  const columnsConfig = columns.map((col) => ({
    title: col.name,
    dataIndex: col.name.toLowerCase().replace(" ", ""),
    key: col.key,
  }));

  columnsConfig.push({
    title: "Action",
    key: "action",
    render: (text, record, index) => (
      <Button danger onClick={() => removeUser(index)}>
        Remove
      </Button>
    ),
  });

  return (
    <Table
      dataSource={users.map((user, index) => ({
        key: index,
        ...user.data,
      }))}
      columns={columnsConfig}
      pagination={false}
      rowKey={(record) => record.key}
    />
  );
}
