import React from "react";

import { Chart } from "./Chart";
import Select from "../../Select";
import Button from "@/components/Button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const chartOptions = [
  {
    label: "Select Chart",
    value: "",
  },
  {
    label: "Bar Chart",
    value: "bar",
  },
  {
    label: "Line Chart",
    value: "line",
  },
  {
    label: "Pie Chart",
    value: "pie",
  },
];

export default function ChartTab({
  results,
  chartX,
  setChartX,
  chartY,
  setChartY,
  chart,
  chartType,
  setChartType,
}) {
  const _getOptions = (results) => {
    if (results.length === 0) return [];
    return Object.keys(results[0] || results).map((key) => ({
      value: key,
      label: key,
    }));
  };

  const getOptions = (results) => {
    const opts = _getOptions(results);
    return [{ value: "Select", label: "Select" }, ...opts];
  };

  const options = getOptions(results);

  return (
    <>
      <div className="flex w-full justify-between items-start gap-3">
        <div className="mb-4 flex items-end gap-2">
          <p className="font-semibold pb-2">Select Chart: </p>
          <Select
            value={chartType}
            options={chartOptions}
            style={{ color: "#D7D8DB" }}
            onChange={(e) => setChartType(e.target.value)}
          />
        </div>
      </div>
      <div
        className="grid"
        style={{
          height: "100%",
          gridTemplateRows: "30px 8px calc(100% - 38px)",
        }}
      >
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <p className="font-semibold pb-2">X Axis:</p>
            <Select
              options={options}
              value={chartX}
              onChange={(e) => setChartX(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold pb-2">Y Axis:</p>
            <Select
              options={options}
              value={chartY}
              onChange={(e) => setChartY(e.target.value)}
            />
          </div>
        </div>
        <div></div>
        <div className="overflow-scroll w-full">
          <Chart chart={chart} type={chartType} />
        </div>
      </div>
    </>
  );
}
