import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { employeeData } from './employeeData';

const EmployeeDirectory = () => {
  const [rowData, setRowData] = useState(employeeData);
  const [editInProgress, setEditInProgress] = useState(false);
  const [originalData] = useState(employeeData);

  const columnDefs = useMemo(() => [
    { 
      field: 'id', 
      headerName: 'Employee ID',
      width: 120,
      filter: 'agNumberColumnFilter',
      sort: 'asc',
      editable: false,
      lockPosition: true,
      cellStyle: { backgroundColor: '#f5f5f5' }
    },
    { 
      field: 'name', 
      headerName: 'Full Name',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      cellStyle: { fontWeight: 'bold' },
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        maxLength: 50
      },
      valueSetter: params => {
        setEditInProgress(true);
        params.data.name = params.newValue;
        return true;
      }
    },
    { 
      field: 'position', 
      headerName: 'Job Title',
      filter: 'agSetColumnFilter',
      filterParams: {
        values: [...new Set(employeeData.map(e => e.position))].sort()
      },
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueSetter: params => {
        setEditInProgress(true);
        params.data.position = params.newValue;
        return true;
      }
    },
    { 
      field: 'department', 
      headerName: 'Department',
      filter: 'agSetColumnFilter',
      filterParams: {
        values: [...new Set(employeeData.map(e => e.department))].sort()
      },
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [...new Set(employeeData.map(e => e.department))].sort()
      },
      valueSetter: params => {
        setEditInProgress(true);
        params.data.department = params.newValue;
        return true;
      }
    },
    { 
      field: 'salary', 
      headerName: 'Annual Salary',
      filter: 'agNumberColumnFilter',
      valueFormatter: params => `$${params.value.toLocaleString()}`,
      filterParams: {
        filterOptions: ['equals', 'lessThan', 'greaterThan'],
        suppressAndOrCondition: true
      },
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 30000,
        max: 500000,
        precision: 0
      },
      valueParser: params => Number(params.newValue),
      valueSetter: params => {
        setEditInProgress(true);
        params.data.salary = params.newValue;
        return true;
      },
      cellStyle: params => ({
        color: params.value > 100000 ? '#2e7d32' : '#c62828',
        fontWeight: '600'
      })
    },
    { 
      field: 'hireDate', 
      headerName: 'Hire Date',
      filter: 'agDateColumnFilter',
      valueFormatter: params => new Date(params.value).toLocaleDateString(),
      filterParams: {
        comparator: (filterDate, cellValue) => {
          return new Date(cellValue) - filterDate;
        }
      },
      editable: true,
      cellEditor: 'agDateCellEditor',
      valueSetter: params => {
        setEditInProgress(true);
        params.data.hireDate = params.newValue;
        return true;
      }
    },
    { 
      field: 'email', 
      headerName: 'Email Address',
      filter: 'agTextColumnFilter',
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        maxLength: 100
      },
      valueSetter: params => {
        setEditInProgress(true);
        params.data.email = params.newValue;
        return true;
      }
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,
    flex: 1,
    minWidth: 150,
    editable: false,
    cellClass: 'editable-cell'
  }), []);

  const handleSave = useCallback(() => {
    console.log('All changes saved:', rowData);
    alert('All changes saved successfully!');
    setEditInProgress(false);
  }, [rowData]);

  const handleCancel = useCallback(() => {
    setRowData([...originalData]);
    setEditInProgress(false);
    console.log('All changes reverted');
  }, [originalData]);

  const onCellValueChanged = useCallback((params) => {
    console.log('Cell edited:', params);
    if (!editInProgress) setEditInProgress(true);
  }, [editInProgress]);

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h1 style={{ marginBottom: '20px' }}>cGxP Tech Employee Directory</h1>
      
      <div style={{ 
        marginBottom: '15px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button
          onClick={handleSave}
          disabled={!editInProgress}
          style={{
            padding: '8px 16px',
            backgroundColor: editInProgress ? '#4CAF50' : '#e0e0e0',
            color: editInProgress ? 'white' : '#9e9e9e',
            border: 'none',
            borderRadius: '4px',
            cursor: editInProgress ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          Save All Changes
        </button>
        <button
          onClick={handleCancel}
          disabled={!editInProgress}
          style={{
            padding: '8px 16px',
            backgroundColor: editInProgress ? '#f44336' : '#e0e0e0',
            color: editInProgress ? 'white' : '#9e9e9e',
            border: 'none',
            borderRadius: '4px',
            cursor: editInProgress ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          Revert All
        </button>
        {editInProgress && (
          <span style={{ 
            marginLeft: '10px', 
            color: '#FF9800',
            fontWeight: '500'
          }}>
            You have unsaved changes!
          </span>
        )}
      </div>

      <div 
        className="ag-theme-alpine"
        style={{ 
          height: 'calc(100% - 100px)',
          width: '100%',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          suppressRowClickSelection={true}
          onGridReady={params => {
            console.log('Grid ready. Row count:', params.api.getDisplayedRowCount());
            params.api.sizeColumnsToFit();
          }}
          onCellValueChanged={onCellValueChanged}
          stopEditingWhenCellsLoseFocus={true}
          singleClickEdit={true}
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
          getRowStyle={params => ({
            background: editInProgress ? '#fff8e1' : 'white'
          })}
        />
      </div>
    </div>
  );
};

export default EmployeeDirectory;