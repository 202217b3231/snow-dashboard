import { Card, Tabs } from "../components/myComponents.jsx";
import { Blueprint, Orchestrate } from "../components/jenkins.jsx";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full h-full grid-rows-[auto] md:grid-rows-1 m-2 ml-0 p-3">
      <div className="">
        <Tabs
          tabs={[
            {
              id: "tab1",
              label: "Blueprint",
              content: <Blueprint />,
            },
            {
              id: "tab2",
              label: "Orchestrate",
              content: <Orchestrate />,
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 h-full">
        <Card className="" title="Status">
          My Custom card
        </Card>
        <Card className="" title="RHEL Versions">
          My Custom card
        </Card>
        <Card className="col-span-2" title="Status3">
          My Custom card
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
