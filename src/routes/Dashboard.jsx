import { Card, Tabs, TabContent } from "../components/myComponents.jsx";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full m-2 ml-0">
      <div className="grid">
        <Tabs>
          <TabContent label="Blueprint">
            <Card className="" title="Status">
              My Custom card
            </Card>
          </TabContent>
          <TabContent label="Orachestrate">
            <Card className="" title="Status2">
              My card
            </Card>
          </TabContent>
        </Tabs>
      </div>
      <div className="grid grid-cols-2 gap-2">
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
