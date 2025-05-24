import { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex border-b border-gray-300 bg-gray-100 rounded-t-md overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 px-1 py-0.5 cursor-pointer font-medium transition-colors focus:outline-none
              ${
                activeTab === tab.id
                  ? "bg-teal-50 border-b-2 border-blue-500 text-blue-600"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-200"
              }`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            role="tab"
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="border border-t-0 border-gray-300 rounded-b-md p-2 w-full flex-1 overflow-auto"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
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

export { Card, Tabs };
