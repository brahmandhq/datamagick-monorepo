import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

import { Tab, Tabs } from "@blueprintjs/core";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { Modal } from "@nextui-org/react";
import { IconDots } from "@tabler/icons-react";
import axios from "axios";

import ChartTab from "./ChartTab";
import DataGridTab from "./DataGridTab";

import Button from "../../Button";
import CodeEditor from "../../CodeEditor";
import { SettingsVoiceSharp } from "@mui/icons-material";
import EditTabNameModal from "./EditTabNameModal";

export default function QueryTab({
  connectionString,
  query,
  setQuery,
  isRunning = false,
  data,
  currentConnection,
  chartRes,
  currentTabId,
  tabs,
  setTabs,
  charts,
  setCharts,
  setData,
  savedQueryTabs,
  setSavedQueryTabs,
}) {
  const [open, setOpen] = useState(false);
  const [queryResponse, setQueryResponse] = useState({
    results: data,
    fields: [],
  });
  const [displayResponse, setDisplayResponse] = useState("");
  const [completedTyping, setCompletedTyping] = useState(false);
  const [chart, setChart] = useState({
    x: {
      label: "",
      data: [],
    },
    y: {
      label: "",
      data: [],
    },
  });
  const [explaination, setExplaination] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExplainLoading, setIsExplainLoading] = useState(false);

  const {
    chartX = chartRes.axes.xAxis,
    chartY = chartRes.axes.yAxis,
    chartType = chartRes.chartType,
  } = tabs[currentTabId];

  const setChartX = (chartX) =>
    setTabs((tabs) => {
      const tabsCopy = { ...tabs };
      tabsCopy[currentTabId] = { ...tabsCopy[currentTabId], chartX };
      return tabsCopy;
    });

  const setChartY = (chartY) =>
    setTabs((tabs) => {
      const tabsCopy = { ...tabs };
      tabsCopy[currentTabId] = { ...tabsCopy[currentTabId], chartY };
      return tabsCopy;
    });

  const setChartType = (chartType) =>
    setTabs((tabs) => {
      const tabsCopy = { ...tabs };
      tabsCopy[currentTabId] = { ...tabsCopy[currentTabId], chartType };
      return tabsCopy;
    });

  const runQuery = async (connectionString, query) => {
    setIsLoading(true);

    if (!isRunning) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`/api/database-client/query`, {
        connectionString,
        query,
      });
      var results = response.data;
      setError("");

      if (!Array.isArray(results)) {
        results = String(results)
          .split("")
          .map((num) => {
            return Array(num);
          });
      }

      setData(results);
      if (savedQueryTabs.hasOwnProperty(currentTabId)) {
        // Update savedQueryTabs
        setSavedQueryTabs((savedTabs) => {
          const savedTabsCopy = { ...savedTabs };
          savedTabsCopy[currentTabId] = {
            ...savedTabsCopy[currentTabId],
            connectResponse: results,
          };
          return savedTabsCopy;
        });
      } else {
        // Update tabs
        setTabs((tabs) => {
          const tabsCopy = { ...tabs };
          tabsCopy[currentTabId] = {
            ...tabsCopy[currentTabId],
            connectResponse: results,
          };
          return tabsCopy;
        });
      }
    } catch (e) {
      setError(e.toString());
      toast.error(e.toString());
    }
    setIsLoading(false);
  };

  const explainQuery = async (connectionString, query) => {
    setIsExplainLoading(true);

    try {
      const databaseDetails = JSON.stringify(currentConnection.connectResponse);
      const response = await axios.post(`/api/database-client/query-explain`, {
        messages: [{ role: "user", content: query }],
        databaseDetails,
        connectionString,
      });
      const output = response.data.choices[0].message.content;
      setExplaination(output);
    } catch (e) {
      // toast.error('Invalid SQL Query');
      console.log("Error connecting to database: ", e);
    }
    setIsExplainLoading(false);
  };

  useEffect(() => {
    if (!chartX || !chartY) return;
    setChart(() => {
      return {
        x: {
          label: chartX,
          data: data.map((item) => item[chartX]),
        },
        y: {
          label: chartY,
          data: data.map((item) => item[chartY]),
        },
      };
    });
  }, [data, chartX, chartY]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!explaination.length) {
      return;
    }

    setCompletedTyping(false);

    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayResponse(explaination.slice(0, i));

      i++;

      if (i > explaination.length) {
        clearInterval(intervalId);
        setCompletedTyping(true);
      }
    }, 20);

    return () => clearInterval(intervalId);
  }, [explaination]);

  return (
    <>
      <div
        className="grid"
        style={{
          gridTemplateRows: "calc(56px) calc(40% - 56px) calc(60%)",
          height: "calc(100vh - 140px)",
        }}
      >
        <div className="mt-2 flex px-8">
          <h1 className="flex-1 tracking-normal text-white"></h1>
          <div className="flex gap-2 mb-10">
            <div className="w-fit">
              <EditTabNameModal
                {...{
                  currentTabId,
                  tabs,
                  setTabs,
                  savedQueryTabs,
                  setSavedQueryTabs,
                }}
              />
            </div>
            <Button
              size="md"
              loading={isExplainLoading}
              disabled={!isRunning}
              onClick={() => {
                handleClickOpen();
                explainQuery(connectionString, query);
              }}
            >
              Explain
            </Button>
            <Button
              size="md"
              loading={isLoading}
              disabled={!isRunning}
              onClick={() => runQuery(connectionString, query)}
            >
              Run
            </Button>
          </div>
        </div>
        <div id="query-editor mb-2" className="mb-2 overflow-scroll px-8">
          <CodeEditor
            language="sql"
            value={query}
            tables={currentConnection?.dbdata}
            onChange={(e) => setQuery(e)}
          />
        </div>
        <div
          id="query-results"
          className="border-1 pale-white-border pale-white-border h-full overflow-hidden border-t px-8 pt-2 pb-0"
        >
          {/* @ts-ignore */}
          <Tabs
            id="TabsExample"
            className="bp3-dark config-tabs db-client-tabs"
          >
            <Tab
              id={"data"}
              title={"Result"}
              panel={<DataGridTab results={data} error={error} />}
              panelClassName="config-tab"
              key={"data"}
            />
            <Tab
              id={"chart"}
              title={"Chart"}
              panel={
                <ChartTab
                  results={data}
                  {...{
                    chartX,
                    setChartX,
                    chartY,
                    setChartY,
                    chart,
                    chartType,
                    setChartType,
                    charts,
                    setCharts,
                  }}
                />
              }
              panelClassName="config-tab"
              key={"chart"}
            />
          </Tabs>
        </div>
      </div>
      <Modal
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        style={{ background: "#202020" }}
      >
        <Modal.Header className="mb-0">
          <h1 className="text-2xl mb-0 font-bold mr-auto tracking-normal text-white">
            Explain Query
          </h1>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          className="w-full mt-0 flex flex-col gap-3 text-xs"
          style={{
            color: "rgb(215, 216, 219)",
          }}
        >
          {!explaination && (
            <div className="mr-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
              <div className="min-w-[40px] text-right font-bold">
                <img
                  src="/icons/logo.png"
                  style={{
                    width: "36px",
                    height: "36px",
                  }}
                  alt="logo"
                />
              </div>
              <IconDots className="animate-pulse text-white" />
            </div>
          )}
          <ReactMarkdown>{displayResponse}</ReactMarkdown>
        </Modal.Body>
      </Modal>
    </>
  );
}
