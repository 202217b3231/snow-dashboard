import React, { StrictMode } from "react";
import "@ant-design/v5-patch-for-react-19";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./Dashboard.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>
);
