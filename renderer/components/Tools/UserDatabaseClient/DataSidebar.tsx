import React from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Divider, ListItemText, Menu, MenuItem } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

import CreateConnectionModal from "./CreateConnectionModal";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import TeamConnectionModal from "./TeamConnectionModal";
import CreateDashboardModal from "./CreateDashboardModal";

export default function DataSidebar(props) {
  const {
    connections,
    setConnections,
    currentConnectionId,
    setCurrentConnectionId,
    tabIds,
    setTabIds,
    tabs,
    setTabs,
    currentTabId,
    setCurrentTabId,
    savedQueryTabs,
    setSavedQueryTabs,
    savedDashboardTabs,
    setSavedDashboardTabs,
  } = props;

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

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeletingSavedQuery, setIsDeletingSavedQuery] = React.useState(false);
  const handleDelete = async (idToDelete) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete('/api/database-client/delete-connectionInfo', {
        data: { id: idToDelete },
      });

      if (response.status === 200) {
        console.log('Connection deleted successfully');
        setConnections(prevConnections => {
          const updatedConnections = { ...prevConnections };
          delete updatedConnections[idToDelete];
          toast.success("Connection deleted successfully", {
            position: "top-right",
          });
          return updatedConnections;
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-right",
      });
      console.error('Error deleting connection:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleDeleteSavedQuery = async (idToDelete) => {
    // e.stopPropagation();
    // e.preventDefault();
    try {
      setIsDeletingSavedQuery(true);
      const response = await axios.delete('/api/user/delete-savedQuery', {
        data: { id: idToDelete },
      });

      if (response.status === 200) {
        console.log('Query deleted successfully');
        setSavedQueryTabs(prevSavedQueryTabs => {
          const updatedSavedQueryTabs = { ...prevSavedQueryTabs };
          delete updatedSavedQueryTabs[idToDelete];
          toast.success("Connection deleted successfully", {
            position: "top-right",
          });
          return updatedSavedQueryTabs;
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-right",
      });
      console.error('Error deleting connection:', error);
    } finally {
      setIsDeletingSavedQuery(false);
    }
  };
  const handleDeleteDashboard = async (idToDelete) => {
    // e.stopPropagation();
    // e.preventDefault();
    try {
      setIsDeletingSavedQuery(true);
      const response = await axios.delete('/api/user/delete-dashboard', {
        data: { id: idToDelete },
      });

      if (response.status === 200) {
        console.log('Dashboard deleted successfully');
        setSavedDashboardTabs(prevSavedDashboardTabs => {
          const updatedSavedDashboardTabs = { ...prevSavedDashboardTabs };
          delete updatedSavedDashboardTabs[idToDelete];
          toast.success("Connection deleted successfully", {
            position: "top-right",
          });
          return updatedSavedDashboardTabs;
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-right",
      });
      console.error('Error deleting connection:', error);
    } finally {
      setIsDeletingSavedQuery(false);
    }
  };
  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <div
      suppressHydrationWarning={true}
      onContextMenu={handleContextMenu}
      style={{ cursor: "context-menu" }}
      className="min-w-[200px] "
    >
      <div

        className="w-[200px] min-h-screen px-2 pt-2 fixed flex flex-col gap-3"
        style={{ backgroundColor: "rgb(32, 32, 32)" }}
      >
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "rgb(215, 216, 219)" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Databases
          </AccordionSummary>
          <AccordionDetails>
            {connections && Object.keys(connections).length > 0
              ? Object.values(connections).map((connection: any) => (
                <Accordion
                  key={connection.id}
                  sx={{
                    fontSize: "rgb(215, 216, 219)",
                    color: "rgb(215, 216, 219)",
                    fontWeight: "500",
                    border: "2px solid rgb(45, 45, 50)",
                    margin: 0,
                    background: "transparent",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon sx={{ color: "rgb(215, 216, 219)" }} />
                    }
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    {connection.name}
                  </AccordionSummary>
                  <AccordionDetails>
                    {connection?.dbData.length > 0 &&
                      connection?.dbData.map((item, i) => {
                        return (
                          <Button
                            size="small"
                            className={`text-[#D7D8DB] ${tabs[currentTabId] &&
                              tabs[currentTabId].name === item
                              ? "bg-[#2D2D32]"
                              : "hover:bg-[#2D2D32] bg-transparent"
                              } w-full flex justify-start text-left overflow-scroll`}
                            style={{
                              color: "#D7D8DB",
                              textTransform: "none",
                            }}
                            onDoubleClick={() => {
                              const newTabId = uuidv4();
                              setCurrentTabId(newTabId);
                              setTabs((currentTabs) => {
                                const currentTabsCopy = {
                                  ...currentTabs,
                                };
                                currentTabsCopy[newTabId] = {
                                  id: connection.id,
                                  connectionString:
                                    connection.connectionString,
                                  name: item,
                                };
                                return currentTabsCopy;
                              });
                            }}
                            key={i}
                          >
                            <span className="w-full mr-auto">{item}</span>
                          </Button>
                        );
                      })}
                    <button disabled={isDeleting} className={` ${isDeleting ? 'animate-pulse' : ""} text-red-500 `} onClick={() => { handleDelete(connection.id) }}>
                      <Delete />
                    </button>
                  </AccordionDetails>
                </Accordion>
              ))
              : null}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "rgb(215, 216, 219)" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Queries Tabs
          </AccordionSummary>
          <AccordionDetails>
            {savedQueryTabs && Object.keys(savedQueryTabs).length > 0
              ? Object.entries(savedQueryTabs).map(([tabId, item]: any) => {
                return (
                  <Button
                    size="small"
                    className={`text-[#D7D8DB] ${tabs[currentTabId] &&
                      tabs[currentTabId].name === item.name
                      ? "bg-[#2D2D32]"
                      : "hover:bg-[#2D2D32] bg-transparent"
                      } w-full flex justify-start text-left overflow-scroll`}
                    style={{
                      color: "#D7D8DB",
                      textTransform: "none",
                    }}
                    onDoubleClick={() => {
                      setCurrentTabId(tabId);
                      setTabs((currentTabs) => {
                        const currentTabsCopy = {
                          ...currentTabs,
                        };
                        currentTabsCopy[tabId] = {
                          connectionString: item.connectionString,
                          ...item,
                        };
                        return currentTabsCopy;
                      });
                    }}
                    key={tabId}
                  >
                    <span className="w-full mr-auto">{item.name}</span>
                    <button disabled={isDeletingSavedQuery} className={` ${isDeleting ? 'animate-pulse' : ""} text-red-500 `} onClick={() => { handleDeleteSavedQuery(item.id) }}>
                      <Delete />
                    </button>
                  </Button>
                );
              })
              : null}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "rgb(215, 216, 219)" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Dashboard Tabs
          </AccordionSummary>
          <AccordionDetails>
            {savedDashboardTabs && Object.keys(savedDashboardTabs).length > 0
              ? Object.entries(savedDashboardTabs).map(([tabId, item]: any) => {
                return (
                  <Button
                    size="small"
                    className={`text-[#D7D8DB] ${tabs[currentTabId] &&
                      tabs[currentTabId].name === item.name
                      ? "bg-[#2D2D32]"
                      : "hover:bg-[#2D2D32] bg-transparent"
                      } w-full flex justify-start text-left overflow-scroll`}
                    style={{
                      color: "#D7D8DB",
                      textTransform: "none",
                    }}
                    onDoubleClick={() => {
                      setCurrentTabId(tabId);
                      setTabs((currentTabs) => {
                        const currentTabsCopy = {
                          ...currentTabs,
                        };
                        currentTabsCopy[tabId] = {
                          connectionString: item.connectionString,
                          ...item,
                        };
                        return currentTabsCopy;
                      });
                    }}
                    key={tabId}
                  >
                    <span className="w-full mr-auto">{item.name}</span>
                    <button disabled={isDeletingSavedQuery} className={` ${isDeleting ? 'animate-pulse' : ""} text-red-500 `} onClick={() => { handleDeleteDashboard(item.id) }}>  <Delete />
                    </button>
                  </Button>
                );
              })
              : null}
          </AccordionDetails>
        </Accordion>

      </div>
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
              updateConnections: (newConnection) => {
                setConnections(prevConnections => ({
                  ...prevConnections,
                  [newConnection.id]: newConnection
                }));
              }
            }}
          />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            handleClose();
          }}
        >
          <CreateDashboardModal setCurrentTabId={setCurrentTabId}
            setTabs={setTabs}
            setSavedDashboardTabs={setSavedDashboardTabs}
          />
        </MenuItem>
      </Menu>
    </div>
  );
}
