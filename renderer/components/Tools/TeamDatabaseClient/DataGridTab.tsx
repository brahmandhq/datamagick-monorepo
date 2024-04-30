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

  const columns = calcColumnsFrowRows(results);

  return (
    <div style={{ height: "100%" }}>
      {error && <h6 className="special text-rose-700">{error}</h6>}
      {!error && (
        <DataGrid
          columns={columns}
          rows={results}
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
