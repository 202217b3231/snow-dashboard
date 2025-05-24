// import React, { useId } from "react";

// const Tabs = ({ tabs, defaultIndex = 0 }) => {
//   const groupId = useId();
//   return (
//     <div className="tabs">
//       {tabs.map((tab, idx) => (
//         <React.Fragment key={idx}>
//           <input
//             type="radio"
//             id={`${groupId}-tab${idx}`}
//             name={groupId}
//             className="tab-radio"
//             defaultChecked={idx === defaultIndex}
//           />
//           <label htmlFor={`${groupId}-tab${idx}`} className="tab-label">
//             {tab.label}
//           </label>
//         </React.Fragment>
//       ))}
//       {tabs.map((tab, idx) => (
//         <div
//           key={idx}
//           className="tab-content"
//           id={`${groupId}-content${idx}`}
//           style={{ display: "none" }}
//         >
//           {tab.content}
//         </div>
//       ))}
//       <style>{`
//         .tab-radio { display: none; }
//         .tab-label {
//           display: inline-block;
//           background: #eee;
//           cursor: pointer;
//           border-radius: 4px 4px 0 0;
//           border: 1px solid #ccc;
//           font-weight: 500;
//         }
//         .tab-radio:checked + .tab-label {
//           background: #fff;
//           border-bottom: 1px solid #fff;
//         }
//         .tab-content {
//           display: none;
//           border: 1px solid #ccc;
//           border-radius: 0 0 4px 4px;
//           background: #fff;
//         }
//         ${tabs
//           .map(
//             (_, idx) =>
//               `#${groupId}-tab${idx}:checked ~ .tab-label:nth-of-type(${
//                 idx + 1
//               }) ~ .tab-content:nth-of-type(${idx + 1}) { display: block; }`
//           )
//           .join("\n")}
//       `}</style>
//     </div>
//   );
// };

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

export { Card };
