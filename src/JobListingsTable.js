import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const JobListingsTable = ({ jobData }) => {
  const [rowData, setRowData] = useState(jobData);

  const [columnDefs] = useState([
    { 
      field: 'id', 
      headerName: 'ID',
      editable: false, 
      width: 100 
    },
    { 
      field: 'title', 
      headerName: 'Job Title',
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'company', 
      headerName: 'Company',
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'salary', 
      headerName: 'Salary',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      valueFormatter: params => `$${params.value.toLocaleString()}`,
      valueParser: params => Number(params.newValue)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: params => (
        <div>
          <button onClick={() => handleSave(params.data)}>Save</button>
          <button onClick={() => handleDelete(params.data.id)}>Delete</button>
        </div>
      ),
      editable: false
    }
  ]);

  const defaultColDef = {
    flex: 1,
    editable: false, 
    sortable: true,
    filter: true,
    resizable: true
  };

  const handleSave = (rowData) => {
    console.log('Saving:', rowData);
    alert(`Changes saved for job ID: ${rowData.id}`);
  };

  const handleDelete = (id) => {
    setRowData(rowData.filter(row => row.id !== id));
    console.log('Deleted job ID:', id);
  };

  const onCellValueChanged = (params) => {
    console.log('Cell changed:', params);
   
  };

  return (
    <div 
      className="ag-theme-alpine"
      style={{ height: 500, width: '100%' }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        stopEditingWhenCellsLoseFocus={true}
        singleClickEdit={true}
      />
    </div>
  );
};

export default JobListingsTable;