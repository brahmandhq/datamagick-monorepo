import { CloseOutlined } from "@ant-design/icons";
//@ts-ignore
import { ConfigProvider, Tabs } from "antd";

import { v4 as uuidv4 } from "uuid";

import { SingleTab } from "./SingleTab";
import { useEffect, useState } from "react";
import Close from "@mui/icons-material/Close";
import SaveQueryModal from "./SaveQueryModal";
import DashboardTab from "./DashboardTab";

enum DatabaseType {
  PostgreSQL = "PostgreSQL",
  MySQL = "MySQL",
  MongoDB = "MongoDB",
}

export default function Tool(props) {
  const {
    tabs,
    setTabs,
    savedQueryTabs,
    setSavedQueryTabs,
    currentTabId,
    setCurrentTabId,
    tabIds,
    setTabIds,
    connections,
    setConnections,
    currentConnectionId,
    setCurrentConnectionId,
    charts,
    setCharts,
    savedDashboardTabs,
    setSavedDashboardTabs,
    onSuccessfulConnect
  } = props;


  const addTab = () => {
    const newTabId = uuidv4();
    setCurrentTabId(newTabId);
    setTabs((currentTabs) => {
      const currentTabsCopy = { ...currentTabs };
      currentTabsCopy[newTabId] = {
        connectionString: "",
        prompt: "",
        query: "",
        name: "",
        connectResponse: "",
        isSuccessfulConnect: false,
      };
      return currentTabsCopy;
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetTabId, setTargetTabId] = useState("");

  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 === null ||
      obj2 === null
    ) {
      return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  }

  const removeTab = (targetKey: string) => {
    if (
      !tabs[targetKey]?.["isDashboard"] &&
      !deepEqual(tabs[targetKey], savedQueryTabs[targetKey])
    ) {
      setIsModalOpen(true);
      setTargetTabId(targetKey);
    } else {
      setTabs((currentTabs) => {
        const currentTabsCopy = { ...currentTabs };
        delete currentTabsCopy[targetKey];

        const newTabIds = Object.keys(currentTabsCopy);
        setTabIds(newTabIds);

        setCurrentTabId((currentTabId) => {
          if (newTabIds.length === 0) return "";
          if (currentTabId === targetKey)
            return newTabIds[newTabIds.length - 1];
          return currentTabId;
        });

        return currentTabsCopy;
      });
    }
  };

  const onChange = (newActiveKey) => {
    setCurrentTabId(newActiveKey);
  };

  const onEdit = (targetKey, action) => {
    if (action === "remove") {
      removeTab(targetKey);
    }
  };
  return (
    <div>

      <div className="">
        {Object.keys(connections).length === 0 ? (
          <div className="flex justify-center items-center mt-52">
            <div className="bg-blue-400 text-white text-center py-2 px-4 rounded-md shadow-md">
              <h1>You have to make a connection.</h1>
            </div>
          </div>
        ) : (
          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  colorBgContainer: "#1E1E1E",
                  colorPrimary: "#ffffff",
                  colorText: "#ffffff",
                  borderRadiusLG: 0,
                  colorFillAlter: "#2f2f2f",
                  colorPrimaryHover: "#ffffff",
                  colorPrimaryActive: "#ffffff",
                  colorBorderSecondary: "rgba(255, 255, 255, 0)",
                },
              },
            }}
          >
            <Tabs
              className="hide-add-icon ml-3"
              type="editable-card"
              activeKey={currentTabId}
              onEdit={onEdit}
              onChange={onChange}
              items={tabIds.map((tabId) => {
                const label = `${tabs[tabId]?.["name"]?.substring(0, 15) || "Tab"
                  }`;

                const isSave = deepEqual(tabs[tabId], savedQueryTabs[tabId]);

                return {
                  key: tabId,
                  label: (
                    <div className="flex items-center gap-2">
                      {!tabs[tabId]?.["isDashboard"] && !isSave ? (
                        <span className="bg-red-500 p-1 rounded-full block w-1 h-1 animate-pulse"></span>
                      ) : null}
                      {label}
                    </div>
                  ),
                  children: (


                    <>
                      {!tabs[tabId]?.["isDashboard"] ? (
                        <SingleTab

                          currentTabId={tabId}
                          tabs={tabs}
                          setTabs={setTabs}
                          setCurrentConnectionId={setCurrentConnectionId}
                          currentConnection={connections[currentConnectionId]}
                          charts={charts}
                          setCharts={setCharts}
                          onSuccessfulConnect={onSuccessfulConnect}

                          {...{
                            savedQueryTabs,
                            setSavedQueryTabs,
                          }}
                        />
                      ) : (
                        <DashboardTab
                          {...{
                            connections,
                            setConnections,
                            currentConnectionId,
                            setCurrentConnectionId,
                            tabs,
                            setTabs,
                            savedQueryTabs,
                            setSavedQueryTabs,
                            currentTabId,
                            setCurrentTabId,
                            savedDashboardTabs,
                            setSavedDashboardTabs,
                          }}
                        />
                      )}
                    </>

                  ),
                  closeIcon: <Close className="custom-close-icon" />,
                };
              })}
            />
          </ConfigProvider>
        )}
      </div>
      <SaveQueryModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        tabName={tabs[currentTabId]?.["name"]}
        {...{
          currentTabId,
          tabs,
          setTabs,
          targetTabId,
          setTargetTabId,
          setTabIds,
          setCurrentTabId,
          savedQueryTabs,
          setSavedQueryTabs,
        }}
      />
    </div>
  );
}
