import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { employeeData } from '../employeeData';
import { employeeColumnDefs } from '../employeeGridConfig';

const EmployeeDirectory = () => {
  const gridRef = useRef();

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <h2 style={{ marginBottom: '20px' }}>Employee Directory</h2>
      <AgGridReact
        ref={gridRef}
        rowData={employeeData}
        columnDefs={employeeColumnDefs}
        defaultColDef={{
          sortable: true,
          resizable: true,
          filter: true,
          floatingFilter: true,
          flex: 1,
          minWidth: 120
        }}
        pagination={true}
        paginationPageSize={10}
        onGridReady={(params) => params.api.sizeColumnsToFit()}
      />
    </div>
  );
};

export default EmployeeDirectory;