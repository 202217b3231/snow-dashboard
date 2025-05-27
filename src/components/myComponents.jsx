import React, { useState } from "react";

const Tabs = ({ tabs }) => {
  const initialTabId =
    Array.isArray(tabs) && tabs.length > 0 ? tabs[0].id : null;
  const [activeTabId, setActiveTabId] = useState(initialTabId);

  if (!initialTabId) {
    return <div className="p-4 text-sm text-gray-500">No tabs to display.</div>;
  }

  return (
    <div className="w-full h-full">
      <div className="tabs h-full tabs-box tabs-sm">
        {tabs.map((tab) => (
          <React.Fragment key={tab.id}>
            <input
              type="radio"
              id={`tab-radio-${tab.id}`}
              name="tabs-group"
              className="tab"
              aria-label={tab.label}
              checked={activeTabId === tab.id}
              onChange={() => setActiveTabId(tab.id)}
            />
            <div className="tab-content p-6">{tab.content}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
const Card = ({ children, title, className }) => {
  return (
    <div
      className={`card bg-base-100 border border-neutral-content shadow-md  ${className}`}
    >
      <div className="card-body m-0 p-3">
        <h2 className="card-title">{title}</h2>
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
};

export { Card, Tabs };
