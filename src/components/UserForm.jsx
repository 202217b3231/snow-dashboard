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
      className="text-md flex flex-wrap items-center gap-5"
    >
      <label class="input">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="m-1 input-info text-xl"
        />
        <button
          type="submit"
          className="label bg-info font-semibold text-info-content p-5 rounded-r-lg"
        >
          Add
        </button>
      </label>
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
        popperPlacement="bottom"
        dateFormat={"dd-MM-yyyy"}
        placeholderText="Select a date range"
        className="input input-accent mr-2 p-2 text-xl font-semibold rounded-md min-w-1/5"
      />

      <Copy
        size={40}
        onClick={handleCopy}
        className="btn btn-secondary rounded text-white p-1 ml-auto cursor-copy"
      />
      <Columns3Cog
        size={40}
        // onClick={() => handleColumns("New")}
        onClick={openDialog}
        className="btn btn-primary rounded text-white p-1 cursor-col-resize"
      />
      <button
        onClick={handleClear}
        className="btn btn-error text-white text-xl p-2 mr-5 cursor-pointer"
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
