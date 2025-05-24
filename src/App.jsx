import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./routes/Home";
import Data from "./routes/Data";
import Notes from "./routes/Notes";
import Dashboard from "./routes/Dashboard";
import Setting from "./routes/Settings";
import {
  House,
  LayoutDashboard,
  DatabaseZap,
  NotebookPen,
  Settings,
} from "lucide-react";

function App() {
  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <aside className="flex justify-between items-center flex-col h-full p-1 border-r border-teal-200 ">
        <div className="gap-5 flex flex-col items-center justify-center">
          <NavLink to="/" about="Home">
            <House size={20} />
          </NavLink>
          <NavLink to="/dashboard" className="link" about="Dashboard">
            <LayoutDashboard size={20} />
          </NavLink>
          <NavLink to="/data" className="link" about="Data">
            <DatabaseZap size={20} />
          </NavLink>
          <NavLink to="/notes" className="link" about="Notes">
            <NotebookPen size={20} />
          </NavLink>
        </div>
        <div className="pb-15 flex">
          <NavLink to="/settings" className="link" about="Settings">
            <Settings size={20} />
          </NavLink>
        </div>
      </aside>
      <main className="flex-1 h-full pb-4 pr-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Setting />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
