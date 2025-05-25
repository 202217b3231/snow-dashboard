import { Search, PlusSquareIcon } from "lucide-react";

export default function Notes() {
  return (
    <>
      <aside className="w-64 h-screen bg-white border-r border-gray-200">
        <nav className="flex items-center bg-amber-100">
          <input
            type="Search"
            placeholder="Search"
            className="focus:outline-teal-400 w-fit px-2 font-medium rounded-md text-sm border-violet-400"
          />
          <PlusSquareIcon size={50} className="text-violet-400 ml-auto" />
        </nav>
        <section></section>
      </aside>
      <main></main>
    </>
  );
}
