import React, { useState } from "react";

const Tab = ({ isActive, onClick, children }) => {
  return (
    <button
      className={`${
        isActive ? "text-gray-900 font-semibold border" : "text-gray-500"
      } cursor-pointer text-xs p-1 text-center rounded m-1 pr-5`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Tabs = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = React.Children.toArray(children);

  return (
    <div>
      <div className="flex">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            isActive={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {tab.props.label}
          </Tab>
        ))}
      </div>
      <div className="m-1">
        {React.Children.map(tabs[activeIndex].props.children, (child) => {
          return child;
        })}
      </div>
    </div>
  );
};

const TabContent = ({ label, children }) => {
  return (
    <div>
      <div>{label}</div>
      <div>{children}</div>
    </div>
  );
};

const Card = ({ children, title, className }) => {
  return (
    <div
      className={`rounded overflow-hidden shadow-md border border-gray-300 ${className}`}
    >
      <div className="px-3 py-2">
        <div className="font-semibold text-md mb-2">{title}</div>
        <div>{children}</div>
      </div>
    </div>
  );
};
export { Card, Tabs, TabContent };
