import React from "react";
import { Table } from "antd";

export default function DataTable({ users, columns, renderActions }) {
  const columnsConfig = columns.map((col) => ({
    title: col.name,
    dataIndex: col.name.toLowerCase().replace(" ", ""),
    key: col.key,
    render: (text, record) => {
      const dataKey = col.name.toLowerCase().replace(" ", "");
      const link = record[dataKey + "Url"];
      return link ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {record[dataKey]}
        </a>
      ) : (
        record[dataKey]
      );
    },
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
