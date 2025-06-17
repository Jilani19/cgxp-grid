import React, { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-material.css';

import { employeeData } from './employeeData';
import './EmployeeDirectory.css';

const EmployeeDirectory = () => {
  const [rowData, setRowData] = useState(employeeData);
  const [originalData] = useState(employeeData);
  const [editInProgress, setEditInProgress] = useState(false);
  const [columnVisible, setColumnVisible] = useState({
    id: true,
    name: true,
    position: true,
    department: true,
    salary: true,
    hireDate: true,
    email: true
  });
  const [isMobile, setIsMobile] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [gridTheme, setGridTheme] = useState('ag-theme-alpine');
  const [customColors, setCustomColors] = useState({
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    headerTextColor: '#000000',
    headerBackgroundColor: '#e0e0e0',
    oddRowBackgroundColor: '#f9f9f9',
    resizeHandleColor: '#888888'
  });
  const [frozenColumns, setFrozenColumns] = useState(['id', 'name']); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columnDefs = useMemo(() => [
    {
      field: 'id',
      headerName: isMobile ? 'ID' : 'Employee ID',
      width: isMobile ? 70 : 120,
      editable: false,
      pinned: frozenColumns.includes('id') ? 'left' : null,
      cellStyle: { backgroundColor: '#f5f5f5' },
      hide: !columnVisible.id
    },
    {
      field: 'name',
      headerName: isMobile ? 'Name' : 'Full Name',
      editable: true,
      cellEditor: 'agTextCellEditor',
      pinned: frozenColumns.includes('name') ? 'left' : null,
      valueSetter: params => {
        params.data.name = params.newValue;
        setEditInProgress(true);
        return true;
      },
      hide: !columnVisible.name
    },
    {
      field: 'position',
      headerName: isMobile ? 'Role' : 'Job Title',
      editable: true,
      cellEditor: 'agTextCellEditor',
      pinned: frozenColumns.includes('position') ? 'left' : null,
      hide: !columnVisible.position
    },
    {
      field: 'department',
      headerName: isMobile ? 'Dept' : 'Department',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      pinned: frozenColumns.includes('department') ? 'left' : null,
      cellEditorParams: {
        values: [...new Set(employeeData.map(e => e.department))]
      },
      hide: !columnVisible.department
    },
    {
      field: 'salary',
      headerName: isMobile ? 'Salary' : 'Annual Salary',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      pinned: frozenColumns.includes('salary') ? 'left' : null,
      valueFormatter: params => `$${params.value.toLocaleString()}`,
      valueSetter: params => {
        params.data.salary = Number(params.newValue);
        setEditInProgress(true);
        return true;
      },
      hide: !columnVisible.salary
    },
    {
      field: 'hireDate',
      headerName: isMobile ? 'Hired' : 'Hire Date',
      editable: true,
      cellEditor: 'agDateCellEditor',
      pinned: frozenColumns.includes('hireDate') ? 'left' : null,
      valueFormatter: params => new Date(params.value).toLocaleDateString(),
      hide: !columnVisible.hireDate
    },
    {
      field: 'email',
      headerName: isMobile ? 'Email' : 'Email Address',
      editable: true,
      cellEditor: 'agTextCellEditor',
      pinned: frozenColumns.includes('email') ? 'left' : null,
      hide: !columnVisible.email
    }
  ], [columnVisible, isMobile, frozenColumns]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    cellClass: 'custom-cell'
  }), []);

  const onGridReady = params => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  const handleSave = () => {
    console.log('Saved data:', rowData);
    alert('Changes saved!');
    setEditInProgress(false);
  };

  const handleRevert = () => {
    setRowData([...originalData]);
    setEditInProgress(false);
  };

  const exportCSV = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  };

  const toggleColumn = col => {
    setColumnVisible(prev => ({
      ...prev,
      [col]: !prev[col]
    }));
  };

  const toggleFreezeColumn = (column) => {
    setFrozenColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(col => col !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  return (
    <div
      className="employee-directory-container"
      style={{
        backgroundColor: customColors.backgroundColor,
        color: customColors.foregroundColor
      }}
    >
      <h1>cGxP-Tech Employee Directory</h1>

      <div className="controls">
        <button onClick={handleSave} disabled={!editInProgress}>Save</button>
        <button onClick={handleRevert} disabled={!editInProgress}>Revert</button>
        <button onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="theme-buttons">
        <button onClick={() => setGridTheme('ag-theme-alpine')}>Alpine</button>
        <button onClick={() => setGridTheme('ag-theme-balham')}>Balham</button>
        <button onClick={() => setGridTheme('ag-theme-material')}>Material</button>
        <button onClick={() => setGridTheme('ag-theme-quartz')}>Quartz</button>
      </div>

      <div className="column-toggles">
                <h3>Hide Columns:</h3>

        {Object.keys(columnVisible).map(col => (
          <label key={col}>
            <input
              type="checkbox"
              checked={columnVisible[col]}
              onChange={() => toggleColumn(col)}
            />
            {col}
          </label>
        ))}
      </div>

      <div className="freeze-controls">
        <h3>Freeze Columns:</h3>
        {Object.keys(columnVisible).map(col => (
          <label key={`freeze-${col}`}>
            <input
              type="checkbox"
              checked={frozenColumns.includes(col)}
              onChange={() => toggleFreezeColumn(col)}
              disabled={!columnVisible[col]}
            />
            {col}
          </label>
        ))}
      </div>

      <div className="color-pickers">
        <label>Background <input type="color" value={customColors.backgroundColor} onChange={e => setCustomColors({ ...customColors, backgroundColor: e.target.value })} /></label>
        <label>Text <input type="color" value={customColors.foregroundColor} onChange={e => setCustomColors({ ...customColors, foregroundColor: e.target.value })} /></label>
        <label>Header Text <input type="color" value={customColors.headerTextColor} onChange={e => setCustomColors({ ...customColors, headerTextColor: e.target.value })} /></label>
        <label>Header BG <input type="color" value={customColors.headerBackgroundColor} onChange={e => setCustomColors({ ...customColors, headerBackgroundColor: e.target.value })} /></label>
        <label>Odd Row BG <input type="color" value={customColors.oddRowBackgroundColor} onChange={e => setCustomColors({ ...customColors, oddRowBackgroundColor: e.target.value })} /></label>
        <label>Resize <input type="color" value={customColors.resizeHandleColor} onChange={e => setCustomColors({ ...customColors, resizeHandleColor: e.target.value })} /></label>
      </div>

      <div className={gridTheme} style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onCellValueChanged={() => setEditInProgress(true)}
          pagination={true}
          paginationPageSize={15}
          getRowClass={params => (params.node.rowIndex % 2 !== 0 ? 'odd-row' : 'even-row')}
        />
      </div>

      <style>{`
        :root {
          --odd-bg: ${customColors.oddRowBackgroundColor};
          --even-bg: ${customColors.backgroundColor};
          --text-color: ${customColors.foregroundColor};
        }
        .${gridTheme} .ag-header {
          background-color: ${customColors.headerBackgroundColor} !important;
        }
        .${gridTheme} .ag-header-cell-label {
          color: ${customColors.headerTextColor} !important;
        }
        .${gridTheme} .ag-header-cell-resize::after {
          background-color: ${customColors.resizeHandleColor} !important;
        }
        .odd-row .ag-cell {
          background-color: var(--odd-bg) !important;
          color: var(--text-color) !important;
        }
        .even-row .ag-cell {
          background-color: var(--even-bg) !important;
          color: var(--text-color) !important;
        }
        .freeze-controls {
          margin: 15px 0;
          padding: 10px;
          background: #f0f0f0;
          border-radius: 5px;
        }
        .freeze-controls h3 {
          margin-top: 0;
        }
      `}</style>
    </div>
  );
};

export default EmployeeDirectory;
