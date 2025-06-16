import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { employeeData } from './employeeData';
import { useMediaQuery } from '@mui/material'; // or you can use window.matchMedia

const EmployeeTable = () => {
  const [rowData, setRowData] = useState([]);
  
  // Check screen size with hooks (alternative to CSS media queries)
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  const [columnDefs] = useState([
    { 
      field: 'id', 
      headerName: 'ID', 
      width: isMobile ? 60 : 80,
      hide: isMobile // hide ID on mobile if you want
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      filter: true,
      width: isMobile ? 120 : undefined
    },
    { 
      field: 'position', 
      headerName: 'Position',
      width: isMobile ? 150 : undefined
    },
    { 
      field: 'department', 
      headerName: 'Department',
      width: isMobile ? 130 : undefined
    },
    { 
      field: 'salary', 
      headerName: 'Salary',
      valueFormatter: params => `$${params.value.toLocaleString()}`,
      width: isMobile ? 100 : undefined
    },
    { 
      field: 'hireDate', 
      headerName: 'Hire Date',
      width: isMobile ? 100 : undefined,
      cellRenderer: isMobile ? 
        (params) => new Date(params.value).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) 
        : undefined
    }
  ]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    flex: isMobile ? undefined : 1, // Use fixed width on mobile, flex on larger screens
    wrapText: true,
    autoHeight: true
  };

  useEffect(() => {
    console.log('Employee Data:', employeeData);
    setRowData(employeeData);
  }, []);

  // CSS-in-JS styles with media queries
  const gridStyles = {
    height: '500px',
    width: '100%',
    margin: '20px 0',
    border: '2px solid #ccc',
    // Mobile styles
    '@media (max-width: 767px)': {
      height: '400px',
      margin: '10px 0',
      fontSize: '12px'
    },
    // Tablet styles
    '@media (min-width: 768px) and (max-width: 1023px)': {
      height: '450px',
      margin: '15px 0',
      fontSize: '14px'
    }
  };

  return (
    <div 
      className="ag-theme-alpine" 
      style={gridStyles}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={isMobile ? 5 : 10}
        suppressHorizontalScroll={isMobile ? false : true}
        onGridReady={params => {
          console.log('Grid ready with rows:', params.api.getDisplayedRowCount());
          if (isMobile) {
            params.api.setDomLayout('autoHeight');
          } else {
            params.api.sizeColumnsToFit();
          }
        }}
        domLayout={isMobile ? 'autoHeight' : 'normal'}
      />
    </div>
  );
};

export default EmployeeTable;