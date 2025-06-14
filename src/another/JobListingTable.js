import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const JobListingsTable = () => {
  const gridRef = useRef();

  const [rowData] = React.useState([
    { id: 1, title: "Software Engineer", company: "Tech Corp", salary: 120000 },
    { id: 2, title: "Product Manager", company: "Innovate Inc", salary: 110000 },
    { id: 3, title: "UX Designer", company: "Design Hub", salary: 95000 },
    { id: 4, title: "Data Scientist", company: "Analytics Co", salary: 130000 }
  ]);

  const [columnDefs] = React.useState([
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Job Title', filter: true },
    { field: 'company', headerName: 'Company', filter: true },
    { 
      field: 'salary', 
      headerName: 'Salary', 
      valueFormatter: params => `$${params.value.toLocaleString()}`,
      filter: 'agNumberColumnFilter'
    }
  ]);

  return (
    <div 
      className="ag-theme-alpine" 
      style={{ 
        height: '100%',
        width: '100%'
      }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        onGridReady={params => params.api.sizeColumnsToFit()}
      />
    </div>
  );
};

export default JobListingsTable;