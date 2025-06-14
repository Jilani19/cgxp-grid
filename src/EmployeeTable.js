import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { employeeData } from './employeeData';

const EmployeeTable = () => {
  const [rowData, setRowData] = useState([]);

  const [columnDefs] = useState([
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', filter: true },
    { field: 'position', headerName: 'Position' },
    { field: 'department', headerName: 'Department' },
    { 
      field: 'salary', 
      headerName: 'Salary',
      valueFormatter: params => `$${params.value.toLocaleString()}` 
    },
    { field: 'hireDate', headerName: 'Hire Date' }
  ]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true
  };

  useEffect(() => {
    console.log('Employee Data:', employeeData);
    setRowData(employeeData);
  }, []);

  return (
    <div 
      className="ag-theme-alpine" 
      style={{ 
        height: '500px', 
        width: '100%',
        margin: '20px',
        border: '2px solid #ccc' 
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        onGridReady={params => {
          console.log('Grid ready with rows:', params.api.getDisplayedRowCount());
          params.api.sizeColumnsToFit();
        }}
      />
    </div>
  );
};

export default EmployeeTable;