import { useEffect, useState } from "react";

import { Card } from "../components/myComponents.jsx";

import UserForm from "../components/UserForm.jsx";

export default function Data() {
  const [users, setUsers] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([
    "Incident",
    "Change",
    "Ctask",
    "Personal Task",
  ]);
  const [columns, setColumns] = useState([
    { column: "Incident", tableName: "incident" },
    { column: "Change", tableName: "change_request" },
    { column: "CTask", tableName: "change_task" },
    { column: "Personal Task", tableName: "personal_task" },
  ]);

  useEffect(() => {
    // for (let i in columns) {
    //   setDefaultColumns((c) => [...c, columns[i].column]);
    // }
    console.log(defaultColumns);
  }, []);

  const handleAddUser = (user) => {
    setUsers((prev) => [...prev, user]);
    console.log(columns[0].column);
    console.log(columns);
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full p-3 ">
      <Card className="min-h-fit md:h-auto">
        <UserForm
          onAddUser={handleAddUser}
          columns={defaultColumns}
          setDefaultColumns={setDefaultColumns}
        />
      </Card>
      <Card className="h-full overflow-y-auto">
        <UserTable
          users={users}
          setUsers={setUsers}
          defaultColumns={defaultColumns}
        />
      </Card>
    </div>
  );
}

// UserTable
function UserTable({ users, setUsers, defaultColumns }) {
  const handleDelete = (username) => {
    setUsers(users.filter((u) => u.username !== username));
  };

  return (
    <>
      <table className="table text-xl table-zebra">
        <thead>
          <tr className="text-xl">
            <th>User</th>
            {defaultColumns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            <th className="select-none">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u}</td>
              {defaultColumns.map((col) => (
                <td key={col}>{col}</td>
              ))}
              <td className="select-none">
                <button onClick={() => handleDelete(u.username)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
