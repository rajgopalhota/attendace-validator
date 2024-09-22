import { Tabs } from "antd";
import { VscServerProcess, VscChecklist } from "react-icons/vsc"; // Importing icons
import NotPostedTab from "./components/NotPostedTab";
import PostedTab from "./components/PostedTab";

const { TabPane } = Tabs;

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Gradient Background */}
      <div className="gradient"></div>

      {/* Tabs with customized styling */}
      <Tabs
        defaultActiveKey="1"
        centered
        tabBarStyle={{
          backgroundColor: "#1a202c",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        }}
        className="rounded-lg text-white"
      >
        <TabPane
          tab={
            <span className="flex items-center space-x-2 text-white">
              <VscServerProcess className="text-lg mr-2" /> {/* First icon */}
              Not Posted Attendance
            </span>
          }
          key="1"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="flex justify-center items-center">
              <img
                src="https://www.admissionindia.net/uploads/colleges/27/10155664_10152016729431254_3730451069246943459_n.jpg"
                className="w-2/4 h-auto mix-blend-multiply"
              />
            </div>
            <div className="flex justify-center items-center">
              <NotPostedTab />
            </div>
          </div>
        </TabPane>

        <TabPane
          tab={
            <span className="flex items-center space-x-2 text-white">
              <VscChecklist className="text-lg mr-2" /> {/* Second icon */}
              Posted Attendance
            </span>
          }
          key="2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="flex justify-center items-center">
              <img
                src="https://www.admissionindia.net/uploads/colleges/27/10155664_10152016729431254_3730451069246943459_n.jpg"
                className="w-2/4 h-auto mix-blend-multiply"
              />
            </div>
            <div className="flex justify-center items-center">
              <PostedTab />
            </div>
          </div>
        </TabPane>
      </Tabs>

      {/* Footer Section */}
      <footer className="text-white py-4 text-center">
        Made with <span className="text-red-500">❤️</span> by CSE Honors Dept.
      </footer>
    </div>
  );
}

export default App;
