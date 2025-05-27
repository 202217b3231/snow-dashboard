import { Search, SquarePen } from "lucide-react";
import { useState } from "react";

export default function Notes() {
  const [notes, setNotes] = useState([
    {
      title: "",
      content: "",
    },
  ]);
  const [activeNote, setActiveNote] = useState(null);

  const addNote = () => {
    setNotes((prev) => [
      ...prev,
      {
        title: "New Note",
        content: "",
      },
    ]);
  };
  return (
    <div className="flex h-full w-full">
      <aside className="w-64 rounded-xl h-full bg-base-200">
        <nav className="flex items-center p-2">
          <input
            type="Search"
            placeholder="Search"
            className="input input-accent w-fit px-2 font-medium rounded-md text-md"
          />
          <div className="tooltip tooltip-bottom ml-auto" data-tip="Add Note!">
            <SquarePen
              size={50}
              className="btn p-0.5 btn-primary "
              onClick={addNote}
            />
          </div>
        </nav>
        <section>
          <p>{notes.map((note, index) => ({ note }))}</p>
        </section>
      </aside>
      <main className="flex-1">Main</main>
    </div>
  );
}
