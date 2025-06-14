import React, { useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const EmployeeGridComponent = ({ 
  title, 
  rowData, 
  columnDefs, 
  defaultColDef,
  enableFilters = true 
}) => {
  const gridRef = useRef();

  const mergedColDefs = useMemo(() => {
    return columnDefs.map(col => ({
      filter: enableFilters ? col.filter || true : false,
      floatingFilter: enableFilters ? col.floatingFilter || false : false,
      ...col
    }));
  }, [columnDefs, enableFilters]);

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '20px' 
    }}>
      <h2 style={{ marginBottom: '20px' }}>{title}</h2>
      <div 
        className="ag-theme-alpine" 
        style={{ 
          height: '500px', 
          width: '100%',
          border: '2px solid #eee' 
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={mergedColDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          onGridReady={(params) => {
            console.log('Grid ready with data:', rowData); 
            params.api.sizeColumnsToFit();
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeGridComponent;