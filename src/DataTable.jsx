import React from "react";
import { Table, Button } from "antd";

export default function DataTable({
  users,
  columns,
  fetchRowData,
  removeUser,
  renderActions,
}) {
  const columnsConfig = columns.map((col) => ({
    title: col.name,
    dataIndex: col.name.toLowerCase().replace(" ", ""),
    key: col.key,
  }));

  columnsConfig.push({
    title: "Action",
    key: "action",
    render: (text, record, index) => renderActions(index),
  });

  return (
    <Table
      dataSource={users.map((user, index) => ({
        key: index,
        id: user.id,
        ...user.data,
      }))}
      columns={columnsConfig}
      pagination={false}
      rowKey={(record) => record.key}
    />
  );
}
