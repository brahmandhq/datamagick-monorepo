import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import DataGridTab from "./DataGridTab";
import QueryTab from "./QueryTab";

import Button from "../../Button";
import Input from "../../Input";
import { useLocalStorage } from "hooks/useLocalStorage";



export function SingleTab({
  currentTabId,
  tabs,
  setTabs,
  currentConnection,
  charts,
  setCharts,
  savedQueryTabs,
  setSavedQueryTabs,
  setCurrentConnectionId,
  onSuccessfulConnect

}) {
  // console.log('currentConnection: ', currentConnection);
  // console.log('tabs', tabs)
  // console.log(currentTabId, 'currentTabId')

  const sendBtnWrapperWidth = "152px";
  const sendBtnWidth = "140px";
  const gap = "12px";
  const router = useRouter();
  const [data, setData] = useState([]);
  const [chartRes, setChartRes] = useState({
    chartType: "",
    axes: {
      xAxis: "",
      yAxis: "",
    },
  });
  const [error, setError] = useState("");

  const [snackbarDetails, setSnackbarDetails] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });
  const [connections, setConnections] = useLocalStorage(
    {},
    "database-client-team-connection"
  );
  // console.log(connections, 'connections')
  const [isGeneratingSQL, setIsGeneratingSQL] = useState(false);
  const [isSuccessfulConnect, setIsSuccessfulConnect] = useState(false);
  const [connectResponse, setConnectResponse] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const currentTab = tabs[currentTabId];
  // console.log('currentTab', currentTab)
  const setConnectionString = (connectionString) =>
    setTabs((tabs) => {
      const tabsCopy = { ...tabs };
      tabsCopy[currentTabId] = {
        ...tabsCopy[currentTabId],
        connectionString,
      };
      return tabsCopy;
    });
  const {
    prompt = "",
    chartPrompt = "",
    query = `SELECT * FROM "${tabs[currentTabId].name}";`,
    connectionString = "",
  } = currentTab;

  const setPrompt = (prompt) =>
    setTabs((tabs) => {
      const tabsCopy = { ...tabs };
      tabsCopy[currentTabId] = { ...tabsCopy[currentTabId], prompt };
      return tabsCopy;
    });

  const setChartPrompt = (chartPrompt) =>
    setTabs((tabs) => {
      const tabsCopy = { ...tabs };
      tabsCopy[currentTabId] = { ...tabsCopy[currentTabId], chartPrompt };
      return tabsCopy;
    });

  const setQuery = (query) =>
    setTabs((tabs) => {
      const tabsCopy = { ...tabs };
      tabsCopy[currentTabId] = { ...tabsCopy[currentTabId], query };
      return tabsCopy;
    });
  function getUniqueTableNames(data) {
    const tableNames = data.reduce((acc, item) => {
      acc[item.table_name] = true;
      return acc;
    }, {});

    return Object.keys(tableNames);
  }


  const connect = async (connectionString: string) => {
    setIsConnecting(true);
    console.log('start 1')
    try {
      const response = await axios.post(`/api/database-client/connect`, {
        connectionString,
      });
      const reqData = response.data;
      console.log('got data')
      const dbdata = getUniqueTableNames(reqData);

      if (currentTab?.id && connections[currentTab.id]) {
        console.log('set data')

        const updatedConnection = {
          ...connections[currentTab.id],
          connectionString: connectionString,
          dbdata,
          connectResponse: reqData,
          isSuccessfulConnect: true,
        };
        setConnections((prevConnections) => ({
          ...prevConnections,
          [currentTab.id]: updatedConnection,
        }));
      }
      setCurrentConnectionId(currentTab?.id);
      setConnectResponse(response.data);
      setIsSuccessfulConnect(true);
      console.log(connections, 'new connections')

    } catch (e) {
      setIsSuccessfulConnect(false);
      console.log('Error connecting to database: ', e);
    } finally {
      onSuccessfulConnect();
      setIsConnecting(false);
    }
  };
  const generateSQL = async (prompt: string) => {
    setIsGeneratingSQL(true);
    try {
      const databaseDetails = JSON.stringify(currentConnection.connectResponse);

      const response = await axios.post(`/api/database-client/generate`, {
        messages: [{ role: "user", content: prompt }],
        databaseDetails,
        connectionString,
      });
      const output = response.data.choices[0].message.content;
      console.log("OUTPUT: ", output);
      setQuery(output);
    } catch (e) {
      console.log("Error connecting to database: ", e);
    }
    setIsGeneratingSQL(false);
  };

  const generateChart = async (prompt: string) => {
    setIsGeneratingSQL(true);
    try {
      const databaseDetails = JSON.stringify(currentConnection.connectResponse);

      const response = await axios.post(`/api/database-client/generate-chart`, {
        messages: [{ role: "user", content: chartPrompt }],
        databaseDetails,
        connectionString,
      });
      const result = response.data;

      setQuery(result.query);
      setData(result.data);
      if (savedQueryTabs.hasOwnProperty(currentTabId)) {
        // Update savedQueryTabs
        setSavedQueryTabs((savedTabs) => {
          const savedTabsCopy = { ...savedTabs };
          savedTabsCopy[currentTabId] = {
            ...savedTabsCopy[currentTabId],
            connectResponse: result.data,
          };
          return savedTabsCopy;
        });
      } else {
        // Update tabs
        setTabs((tabs) => {
          const tabsCopy = { ...tabs };
          tabsCopy[currentTabId] = {
            ...tabsCopy[currentTabId],
            connectResponse: result.data,
          };
          return tabsCopy;
        });
      }
      const output = result.chart.choices[0].message.content;
      setChartRes(JSON.parse(output));
    } catch (e) {
      console.log("Error connecting to database: ", e);
    }
    setIsGeneratingSQL(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`/api/database-client/query`, {
          connectionString: tabs[currentTabId].connectionString,
          query: `SELECT * FROM "${tabs[currentTabId].name}";`,
        });
        setError("");
        var results = response.data;
        if (!Array.isArray(results)) {
          results = String(results)
            .split("")
            .map((num) => {
              return Array(num);
            });
        }
        setData(results);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    };

    fetchData();
  }, [currentTabId, currentConnection?.isSuccessfulConnect]);


  return (
    <div className="w-full">
      <main className="datatable-editing-demo w-full flex-grow overflow-auto">
        <div className="tool w-full flex-grow overflow-auto" id="tool">
          <div
            className="bp3-dark my-6 mb-4 flex px-8"
            style={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: `calc(100% - ${sendBtnWrapperWidth}) ${sendBtnWrapperWidth}`,
            }}
          >
            <Input
              id="db-connection-string"
              value={connectionString}
              onChange={(e) =>
                setConnectionString(e.target.value)
              }
              className="zero-radius"
              placeholder="postgres://<username>:<password-here>@<hostname>:<port>"
              type="password"
              style={{
                overflow: 'hidden',
                maxWidth: '500px',
              }}
            />
            <div style={{ height: '100%', marginLeft: gap }}>
              <Button
                onClick={() => connect(connectionString)}
                intent="primary"
                loading={isConnecting}
                large
                height={'100%'}
                style={{ height: '100%', width: sendBtnWidth }}
                disabled={isConnecting}
              >
                CONNECT
              </Button>
            </div>
          </div>
          <div
            className="bp3-dark my-6 mb-4 flex px-8"
            style={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: `calc(100% - ${sendBtnWrapperWidth}) ${sendBtnWrapperWidth}`,
            }}
          >
            <Input
              className="zero-radius"
              placeholder="Count the number of users"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div style={{ height: "100%", marginLeft: gap }}>
              <Button
                onClick={() => generateSQL(prompt)}
                intent="primary"
                loading={isGeneratingSQL ? true : undefined}
                large
                height={"100%"}
                style={{ height: "100%", width: sendBtnWidth }}
                disabled={
                  !tabs[currentTabId].connectionString || isGeneratingSQL
                }
              >
                GENERATE SQL
              </Button>
            </div>
          </div>
          <div
            className="bp3-dark mb-4 flex px-8"
            style={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: `calc(100% - ${sendBtnWrapperWidth}) ${sendBtnWrapperWidth}`,
            }}
          >
            <Input
              className="zero-radius"
              placeholder="Count the number of users"
              value={chartPrompt}
              onChange={(e) => setChartPrompt(e.target.value)}
            />
            <div style={{ height: "100%", marginLeft: gap }}>
              <Button
                onClick={() => generateChart(chartPrompt)}
                intent="primary"
                loading={isGeneratingSQL ? true : undefined}
                large
                height={"100%"}
                style={{ height: "100%", width: sendBtnWidth }}
                disabled={
                  !tabs[currentTabId].connectionString || isGeneratingSQL
                }
              >
                GENERATE CHART
              </Button>
            </div>
          </div>
          {/* {data.length > 0 && ( */}
          <QueryTab
            connectionString={connectionString}
            query={query}
            setQuery={setQuery}
            currentConnection={currentConnection}
            isRunning={currentConnection?.isSuccessfulConnect}
            data={data}
            chartRes={chartRes}
            currentTabId={currentTabId}
            tabs={tabs}
            setTabs={setTabs}
            {...{
              charts,
              setCharts,
              setData,
              savedQueryTabs,
              setSavedQueryTabs,
            }}
          />
          {/* )} */}
        </div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbarDetails.open}
          onClose={() =>
            setSnackbarDetails({ ...snackbarDetails, open: false })
          }
          message={snackbarDetails.message}
          autoHideDuration={4000}
        >
          <Alert
            severity="error"
            sx={{ width: "100%" }}
            onClose={() =>
              setSnackbarDetails({
                ...snackbarDetails,
                open: false,
              })
            }
          >
            {snackbarDetails.message}
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
}
