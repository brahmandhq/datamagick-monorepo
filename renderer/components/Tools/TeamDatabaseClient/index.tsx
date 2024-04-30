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
import { get } from "http";
import { useRouter } from "next/router";
import TeamConnectionModal from "./TeamConnectionModal";

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
export const getDbInfo = async (
  setConnections,
  id,
  email,
  connectionIdToUpdate?,
  newConnectionString?
) => {
  try {
    const getTeamById = async () => {
      try {
        const response = await axios.post(`/api/team/getTeamById`, {
          userEmail: email,
          teamId: id,
        });
        if (response && response.data) {
          console.log("TeamById: ", response.data);
          return response.data;
        }
      } catch (error) {
        console.log("Error fetching teams: ", error);
      }
    };

    const teamData = await getTeamById(); // Fetch team data
    if (!teamData) return;


    const storedConnections = JSON.parse(localStorage.getItem('database-client-team-connection')) || {};
    const teamConnections = teamData.team.TeamConnectionInfo.reduce(
      (acc, connection) => {
        // Check if the connection already exists in localStorage
        if (!storedConnections[connection.id]) {
          // If the connection does not exist, add it to the accumulator
          acc[connection.id] = {
            id: connection.id,
            name: connection.name,
            connectionString: connection.connectionString,
            dbData: connection.dbData,
            isSuccessfulConnect: false,
            teamId: teamData.team.id
          };
        }
        return acc;
      },
      {}
    );

    // Update the connections in localStorage
    localStorage.setItem(
      "database-client-team-connection",
      JSON.stringify({ ...storedConnections, ...teamConnections })
    );

    // Update the connections in state
    setConnections({ ...storedConnections, ...teamConnections });
  } catch (e) {
    console.log("Error fetching DbInfo: ", e);
  }
};
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
    "database-client-team-connection"
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
  const router = useRouter();
  const { data } = useSession();
  const { id } = router.query;
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
    getDbInfo(setConnections, id, data?.user?.email);
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
    getDbInfo(setConnections, id, data?.user?.email);
    setForceRender((prev) => !prev);
  };
  const currentTeamConnections = Object.values(connections).filter(
    (connection: { teamId: string }) => connection?.teamId === id
  );
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
                connections: currentTeamConnections,
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
                <TeamConnectionModal
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
            <TeamConnectionModal
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
