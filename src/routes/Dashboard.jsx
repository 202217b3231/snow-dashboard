import { Card } from "../components/myComponents.jsx";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full m-2 ml-0">
      <div className="grid">
        <div className="bg-gray-100 rounded shadow-md border border-gray-300 p-0.5">
          <div className="flex">
            <input
              type="radio"
              id="tab1"
              name="tab"
              defaultChecked
              className="peer/tab1 hidden"
            />
            <label
              htmlFor="tab1"
              className="cursor-pointer px-2 py-1 rounded-t-md border border-b-0 border-gray-300 bg-gray-200 font-semibold peer-checked/tab1:bg-white peer-checked/tab1:border-b-white transition-colors"
            >
              Blueprint
            </label>
            <input
              type="radio"
              id="tab2"
              name="tab"
              className="peer/tab2 hidden"
            />
            <label
              htmlFor="tab2"
              className="cursor-pointer px-2 py-1 rounded-t-md border border-b-0 border-gray-300 bg-gray-200 font-semibold peer-checked/tab2:bg-white peer-checked/tab2:border-b-white transition-colors"
            >
              Orchestrate
            </label>
          </div>
          <div className="relative">
            <div
              className="hidden peer-checked/tab1:block border border-t-0 border-gray-300 rounded-b-md bg-white p-4 -mt-1"
              id="content1"
            >
              Blueprint
            </div>
            <div
              className="hidden peer-checked/tab2:block border border-t-0 border-gray-300 rounded-b-md bg-white p-4 -mt-1"
              id="content2"
            >
              Orchestrate
            </div>
          </div>
        </div>
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
