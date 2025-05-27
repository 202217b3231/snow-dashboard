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
  Sun,
  Moon,
} from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState("winter");
  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const themeToggle = theme === "winter" ? "dracula" : "winter";
      document.documentElement.setAttribute(
        "data-theme",
        theme === "winter" ? "dracula" : "winter"
      );
      setTheme(themeToggle);
      localStorage.setItem("theme", themeToggle);
    }
  };
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <aside className="flex justify-between items-center flex-col h-full p-1 gap-4">
        <NavLink
          to="/"
          about="Home"
          className="btn btn-secondary btn-soft p-1 mt-4"
        >
          <div className="tooltip tooltip-right">
            <div className="tooltip-content">
              <div className="animate-bounce text-orange-400 -rotate-8 text-2xl font-black">
                Home
              </div>
            </div>
            <House size={26} />
          </div>
        </NavLink>
        <NavLink
          to="/dashboard"
          className="btn btn-secondary btn-soft p-1"
          about="Dashboard"
        >
          <div className="tooltip tooltip-right">
            <div className="tooltip-content">
              <div className="animate-bounce text-orange-400 -rotate-8 text-2xl font-black">
                Dashboard
              </div>
            </div>
            <LayoutDashboard size={26} />
          </div>
        </NavLink>
        <NavLink
          to="/data"
          className="btn btn-secondary btn-soft p-1"
          about="Data"
        >
          <div className="tooltip tooltip-right">
            <div className="tooltip-content">
              <div className="animate-bounce text-orange-400 -rotate-8 text-2xl font-black">
                Data
              </div>
            </div>
            <DatabaseZap size={26} />
          </div>
        </NavLink>
        <NavLink
          to="/notes"
          className="btn btn-secondary btn-soft p-1"
          about="Notes"
        >
          <div className="tooltip tooltip-right">
            <div className="tooltip-content">
              <div className="animate-bounce text-orange-400 -rotate-8 text-2xl font-black">
                Notes
              </div>
            </div>
            <NotebookPen size={26} />
          </div>
        </NavLink>
        <NavLink
          to="/settings"
          className="btn btn-secondary btn-soft mt-auto p-1"
          about="Settings"
        >
          <div className="tooltip tooltip-right">
            <div className="tooltip-content">
              <div className="animate-bounce text-orange-400 -rotate-8 text-2xl font-black">
                Settings
              </div>
            </div>
            <Settings size={26} />
          </div>
        </NavLink>
        <button
          onClick={toggleTheme}
          className="btn btn-accent btn-soft p-1 mb-10 cursor-pointer"
        >
          <div className="tooltip tooltip-right">
            <div className="tooltip-content">
              <div className="animate-bounce text-orange-400 -rotate-8 text-2xl font-black">
                Theme
              </div>
            </div>
            {theme === "dracula" ? <Sun size={26} /> : <Moon size={26} />}
          </div>
        </button>
      </aside>
      <main className="flex-1 h-full p-2 pb-5">
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
