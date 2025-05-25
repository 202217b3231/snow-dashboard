import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Copy, Columns3Cog } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
// UserForm
export default function UserForm({ onAddUser, columns, setDefaultColumns }) {
  const prevMonth = subMonths(new Date(), 1);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState(startOfMonth(prevMonth));
  const [endDate, setEndDate] = useState(endOfMonth(prevMonth));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) return;
    onAddUser(username);
    setUsername("");
    console.log(
      "User added:",
      username,
      startDate ? format(startDate, "yyyy-MM-dd") : "",
      endDate ? format(endDate, "yyyy-MM-dd") : ""
    );
  };

  const handleClear = () => {
    setUsers([]);
  };

  const handleCopy = () => {
    const text = users
      .map((u) => columns.map((col) => u[col] || "").join(","))
      .join("\n");
    navigator.clipboard.writeText(text);

    console.log(columns);
  };

  const handleColumns = (column) => {
    setDefaultColumns((p) => [...p, column]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 space-x-5 text-md flex flex-wrap items-center"
    >
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="focus:outline-0 p-2 text-xl rounded-md min-w-1/5 bg-fuchsia-200  font-semibold ml-5"
      />
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(dates) => {
          const [start, end] = dates;
          setStartDate(start);
          setEndDate(end);
        }}
        isClearable
        dateFormat={"dd-MM-yyyy"}
        placeholderText="Select a date range"
        className="bg-cyan-200 mr-3  p-2 text-xl focus:outline-0 font-semibold text-center rounded-md min-w-1/5"
      />

      <button type="submit" className="btn info text-xl p-2">
        Add User
      </button>

      <Copy
        size={40}
        onClick={handleCopy}
        className="bg-green-400 rounded text-white p-1 ml-auto cursor-copy"
      />
      <Columns3Cog
        size={40}
        // onClick={() => handleColumns("New")}
        onClick={openDialog}
        className="bg-sky-400 rounded text-white p-1 cursor-col-resize"
      />
      <button
        onClick={handleClear}
        className="btn bg-rose-400 text-xl mb-2 p-2 mr-5 cursor-vertical-text"
      >
        Clear All
      </button>
    </form>
  );
}

const openDialog = () => {
  const openModal = (e) => {
    e.target.showModal();
    console.log(e);
  };
  return (
    <dialog open onClick={openModal}>
      Test
    </dialog>
  );
};
