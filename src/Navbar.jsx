import React, { createContext } from "react";
import { FaCog, FaSun, FaMoon, FaInfoCircle, FaWrench } from "react-icons/fa";
import { Modal } from "antd";

const config = {
  title: "About Me!",
  content: (
    <>
      <span>Himanshu</span>
      <br />
      <span>202217b3231</span>
    </>
  ),
};

export default function Navbar({
  snowIcon,
  openOptionsPage,
  setIsModalOpen,
  theme,
  toggleTheme,
}) {
  const [modal, contextHolder] = Modal.useModal();

  return (
    <div className="header">
      <div>
        <img
          src={snowIcon}
          alt="Snow Icon"
          style={{
            width: "40px",
          }}
        />
        <h1>Service Now Dashboard</h1>
      </div>
      <div className="actions">
        <FaWrench
          title="Open Options Page"
          onClick={openOptionsPage}
          style={{
            cursor: "pointer",
            fontSize: "24px",
            marginRight: "10px",
          }}
        />
        <FaInfoCircle
          title="About me"
          onClick={() => modal.info(config)}
          style={{
            cursor: "pointer",
            fontSize: "24px",
            marginRight: "10px",
          }}
        />
        <FaCog
          title="Settings"
          onClick={() => setIsModalOpen(true)}
          style={{
            cursor: "pointer",
            fontSize: "24px",
            marginRight: "10px",
          }}
        />
        {theme === "dark" ? (
          <FaMoon
            title="Dark Mode"
            onClick={toggleTheme}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              marginRight: "10px",
            }}
          />
        ) : (
          <FaSun
            title="Light Mode"
            onClick={toggleTheme}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              marginRight: "10px",
            }}
          />
        )}
      </div>
      {contextHolder}
    </div>
  );
}
