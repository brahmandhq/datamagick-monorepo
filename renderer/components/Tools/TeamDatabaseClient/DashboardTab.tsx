import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import AddChartModal from "./AddChartModal";
import { Chart } from "./Chart";

export default function DashboardTab({
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
}) {
  const currentTab = savedDashboardTabs[currentTabId]?.updatedData || [];

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (currentTab.length > 0) {
      const processedData = currentTab.map((item) => {
        const data = item.connectResponse;
        const chartX = item.chartX;
        const chartY = item.chartY;
        return {
          x: {
            label: chartX,
            data: data.map((item) => item[chartX]),
          },
          y: {
            label: chartY,
            data: data.map((item) => item[chartY]),
          },
          type: item.chartType,
        };
      });
      setChartData(processedData);
    }
  }, [currentTab]);

  return (
    <div className="w-full">
      <main className="datatable-editing-demo w-full flex-grow overflow-auto">
        <div className="tool w-full flex-grow overflow-auto" id="tool">
          <div className="my-6 mb-4 flex px-8">
            <AddChartModal
              {...{
                tabs,
                setTabs,
                savedQueryTabs,
                setSavedQueryTabs,
                currentTabId,
                setCurrentTabId,
                connections,
                setConnections,
                currentConnectionId,
                savedDashboardTabs,
                setSavedDashboardTabs,
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {chartData &&
            chartData.length > 0 &&
            chartData.map((chart, i) => (
              <div
                key={i}
                className="border rounded-lg p-2"
                style={{ borderColor: "rgb(45, 45, 50)" }}
              >
                <Chart chart={chart} type={chart.type} />
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
