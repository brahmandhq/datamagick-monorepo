import React from "react";
import DataGrid from "react-data-grid";
export default function DataGridTab({ results, error }) {

  const calcColumnsFrowRows = (rows) => {
    if (rows.length === 0) {
      return [];
    }
    const header = Object.keys(rows[0]);
    const columns = header.map((key) => ({
      key,
      name: key,
      color: "red",
      // editor: textEditor,
    }));
    return columns;
  };
  const convertResultsToStrings = (rows) => {
    return rows.map((row) => {
      const newRow = {};
      Object.keys(row).forEach((key) => {
        if (Array.isArray(row[key])) {
          newRow[key] = JSON.stringify(row[key]);
        } else {
          newRow[key] = String(row[key]);
        }
      });
      return newRow;
    });
  };
  const stringResults = convertResultsToStrings(results);
  const columns = calcColumnsFrowRows(results);
  console.log(stringResults, 'stringResults')
  console.log(results, 'results')
  return (
    <div style={{ height: "100%" }}>
      {error && <h6 className="special text-rose-700">{error}</h6>}
      {!error && (
        <DataGrid
          columns={columns}
          rows={stringResults}
          defaultColumnOptions={{
            // resizable: true,
          }}
          style={{
            width: "100%",
            height: "100%",
            background: "#1e1e1e",
            border: "0",
          }}
        />
      )}
    </div>
  );
}
