import { Search, SquarePen, BookmarkPlus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeNote = notes.find((note) => note.id === activeNoteId) || null;

  const deleteNote = (noteId) => {
    if (confirm("Delete this Note!!")) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      setActiveNoteId(null);
    }
  };

  const displayedNotes = searchQuery
    ? notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      content: "",
    };
    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes, newNote];
      setActiveNoteId(newNote.id);
      return updatedNotes;
    });
    setSearchQuery("");
  };
  return (
    <div className="flex h-full w-full ">
      <aside className="w-64 rounded-xl h-full border border-primary-content overflow-y-auto overflow-x-hidden">
        <nav className="flex items-center p-2">
          <input
            type="Search"
            placeholder="Search"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            value={searchQuery}
            className="input input-accent w-fit px-2 font-medium rounded-md text-md"
          />
          <div className="tooltip tooltip-left ml-auto " data-tip="Add Note!">
            <SquarePen
              size={50}
              className="btn p-0.5 btn-primary z-1000"
              onClick={addNote}
            />
          </div>
        </nav>
        <section>
          {(() => {
            if (displayedNotes.length === 0) {
              return (
                <p className="alert alert-error alert-outline text-center">
                  {searchQuery ? "No matching notes" : "No Notes"}
                </p>
              );
            }
            return displayedNotes.map((note) => (
              <div
                key={note.id}
                className={`p-2 truncate cursor-pointer rounded-lg my-1 ${
                  note.id === activeNoteId
                    ? "bg-primary-content text-primary"
                    : "bg-base-200"
                }`}
                onClick={() => setActiveNoteId(note.id)}
                onDoubleClick={() => {
                  deleteNote(note.id);
                }}
              >
                {note.title}
              </div>
            ));
          })()}
        </section>
      </aside>
      <main className="flex-1 p-1">
        {activeNote && (
          <div className="p-3 h-full flex flex-col gap-2">
            <div className="flex p-0 m-0 gap-5 items-center">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => {
                  setNotes((prevNotes) =>
                    prevNotes.map((noteItem) =>
                      noteItem.id === activeNoteId
                        ? { ...noteItem, title: e.target.value }
                        : noteItem
                    )
                  );
                }}
                className="input input-accent w-1/2"
              />
              <p className="alert">
                {new Date(activeNote.id).toLocaleString()}
              </p>
              <BookmarkPlus size={20} className="btn btn-primary px-1" />
              <Trash2
                onClick={() => deleteNote(activeNote.id)}
                className="btn btn-error mr-10 px-1"
              />
            </div>
            <textarea
              className="textarea textarea-accent text-2xl w-full h-full"
              value={activeNote.content}
              onChange={(e) =>
                setNotes((prevNotes) =>
                  prevNotes.map((noteItem) =>
                    noteItem.id === activeNoteId
                      ? { ...noteItem, content: e.target.value }
                      : noteItem
                  )
                )
              }
            ></textarea>
          </div>
        )}
      </main>
    </div>
  );
}
