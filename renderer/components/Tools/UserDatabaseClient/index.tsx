import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";
import { createTheme } from "@mui/material/styles";

import { Menu, MenuItem } from "@mui/material";
import Button from "../../Button";
import Tool from "./Tool";
import CreateConnectionModal from "./CreateConnectionModal";
import DatabaseClientLayout from "./DatabaseClientLayout";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useSession } from "next-auth/react";


const DataSidebar = dynamic(() => import("./DataSidebar"), {
  ssr: false,
});

function arrayToObject(arr) {
  const obj = {};
  arr.forEach(item => {
    obj[item.id] = { ...item, id: item.id };
  });

  return obj;
}
export const getDbInfo = async (setConnections, email) => {
  try {
    const response = await axios.post(
      `/api/database-client/get-connectionInfo`, { email }
    );

    if (response) {

      const dbData = arrayToObject(response.data);
      const storedConnections = JSON.parse(localStorage.getItem('database-client-connection')) || {};
      // Check connection already exists
      Object.keys(dbData).forEach(connectionId => {
        const connection = dbData[connectionId];
        if (!storedConnections[connectionId]) {
          const newConnection = {
            id: connection.id,
            name: connection.name,
            connectionString: connection.dbConnectionString,
            dbData: connection.dbData,
            isSuccessfulConnect: false,
          };
          storedConnections[connectionId] = newConnection;
        }
      });

      localStorage.setItem('database-client-connection', JSON.stringify(storedConnections));
      setConnections(storedConnections);
      return response.data;
    }
  } catch (e) {
    console.log("Error fetching DbInfo: ", e);
  }
}
export const getSavedQuery = async (setSavedQueryTabs, email) => {
  try {
    const response = await axios.post(
      `/api/user/get-savedQuery`, { email }
    );

    if (response) {
      const savedQueryData = arrayToObject(response.data);
      setSavedQueryTabs(savedQueryData);
      return savedQueryData;
    }
  } catch (e) {
    console.log("Error fetching Saved Queries: ", e);
  }
}
export const getDashboard = async (setSavedDashboardTabs, email) => {
  try {
    const response = await axios.post(
      `/api/user/get-dashboard`, { email }
    );

    if (response) {
      const savedDashboardData = arrayToObject(response.data);
      setSavedDashboardTabs(savedDashboardData);
      return savedDashboardData;
    }
  } catch (e) {
    console.log("Error fetching Saved Dashboards: ", e);
  }
}
export default function NewDevTool() {
  const [mode, setMode] = React.useState<"light" | "dark">("dark");
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
  const [tabs, setTabs] = useLocalStorage({}, "database-client-tabs");
  const [savedQueryTabs, setSavedQueryTabs] = useLocalStorage(
    {},
    "database-client-saved-query-tabs"
  );
  const [savedDashboardTabs, setSavedDashboardTabs] = useLocalStorage(
    {},
    "database-client-saved-dashboard-tabs"
  );
  const [charts, setCharts] = useLocalStorage({}, "database-client-charts");
  const [currentTabId, setCurrentTabId] = useLocalStorage(
    "",
    "database-client-current-tab-id"
  );
  const [connections, setConnections] = useLocalStorage(
    {},
    "database-client-connection"
  );


  const [currentConnectionId, setCurrentConnectionId] = useLocalStorage(
    "",
    "database-client-current-connection-id"
  );
  const [tabIds, setTabIds] = useState([]);

  useEffect(() => {
    if (currentTabId == "") {
      addTab();
    }
  }, []);

  useEffect(() => {
    setTabIds(Object.keys(tabs || {}) || []);

  }, [tabs]);
  const getTeams = async () => {
    try {
      const response = await axios.get(`/api/team/getTeams`);
      if (response) {
        console.log("Teams: ", response.data);
      }
    } catch (error) {
      console.log("Error fetching teams: ", error);
    }
  }
  const { data } = useSession();
  const getTeamsConnection = async () => {
    try {
      const response = await axios.post(`/api/team/get-connectionInfo`, { userEmail: data?.user?.email });
      if (response) {
        console.log("Teams: ", response.data);
      }
    } catch (error) {
      console.log("Error fetching teams: ", error);
    }
  }
  useEffect(() => {
    getDbInfo(setConnections, data?.user?.email);
    getSavedQuery(setSavedQueryTabs, data?.user?.email);
    getDashboard(setSavedDashboardTabs, data?.user?.email);
    // getTeams();
    // getTeamsConnection();
  }, [])

  const addTab = () => {
    const newTabId = uuidv4();
    setCurrentTabId(newTabId);
    setTabs((currentTabs) => {
      const currentTabsCopy = { ...currentTabs };
      currentTabsCopy[newTabId] = {
        connectionString: "",
        prompt: "",
        chartPrompt: "",
        query: "",
        name: "",
        chartX: "",
        chartY: "",
        chartType: "",
        connectResponse: "",
        isSuccessfulConnect: false,
      };
      return currentTabsCopy;
    });
  };
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX + 2,
          mouseY: event.clientY - 6,
        }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };
  const [forceRender, setForceRender] = useState(false);
  const handleSuccessfulConnect = () => {
    getDbInfo(setConnections, data?.user?.email);
    setForceRender((prev) => !prev);
  };
  return (
    <div>
      {forceRender && (
        <div style={{ display: "none" }}>

          {Math.random()}
        </div>
      )}
      <DatabaseClientLayout
        theme={theme}
        DrawerBody={
          <div
            className="hide-scrollbar"
            onContextMenu={handleContextMenu}
            style={{
              height: "75vh",
              flex: 1,
              background: "rgb(32, 32, 32)",
            }}
          >
            <DataSidebar
              {...{
                addTab,
                connections,
                setConnections,
                currentConnectionId,
                setCurrentConnectionId,
                tabIds,
                setTabIds,
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
            <Menu
              open={contextMenu !== null}
              onClose={handleClose}
              anchorReference="anchorPosition"
              anchorPosition={
                contextMenu !== null
                  ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                  : undefined
              }
            >
              <MenuItem
                sx={{ color: "black", textTransform: "capitalize" }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleClose();
                }}
              >
                <CreateConnectionModal
                  {...{
                    connections,
                    setConnections,
                    currentConnectionId,
                    setCurrentConnectionId,
                  }}
                />
              </MenuItem>
            </Menu>
          </div>
        }
        DrawerFooter={
          <Button size="md" className=" text-white">
            <CreateConnectionModal
              {...{
                connections,
                setConnections,
                currentConnectionId,
                setCurrentConnectionId,
              }}
            />
          </Button>
        }
        MainSection={
          <>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              theme="dark"
            />
            <div className="z-0 text-black" style={{ overflowX: "hidden" }}>
              <Tool
                onSuccessfulConnect={handleSuccessfulConnect}
                {...{
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

                }}
              />
            </div>
          </>
        }
      />
    </div>
  );
}
