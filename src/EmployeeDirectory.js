import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { employeeData } from './employeeData';
import './EmployeeDirectory.css';

const EmployeeDirectory = () => {
  const [rowData, setRowData] = useState(employeeData);
  const [editInProgress, setEditInProgress] = useState(false);
  const [originalData] = useState(employeeData);
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
      filter: 'agNumberColumnFilter',
      sort: 'asc',
      editable: false,
      lockPosition: true,
      cellStyle: { backgroundColor: '#f5f5f5' },
      hide: !columnVisible.id,
      pinned: isMobile ? false : 'left',
      headerTooltip: 'Employee ID',
      tooltipField: 'id'
    },
    { 
      field: 'name', 
      headerName: isMobile ? 'Name' : 'Full Name',
      filter: 'agTextColumnFilter',
      floatingFilter: !isMobile,
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
      },
      hide: !columnVisible.name,
      width: isMobile ? 120 : undefined,
      tooltipField: 'name'
    },
    { 
      field: 'position', 
      headerName: isMobile ? 'Role' : 'Job Title',
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
      },
      hide: !columnVisible.position,
      width: isMobile ? 120 : undefined,
      tooltipField: 'position'
    },
    { 
      field: 'department', 
      headerName: isMobile ? 'Dept' : 'Department',
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
      },
      hide: !columnVisible.department,
      width: isMobile ? 100 : undefined,
      tooltipField: 'department'
    },
    { 
      field: 'salary', 
      headerName: isMobile ? 'Salary' : 'Annual Salary',
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
      }),
      hide: !columnVisible.salary,
      width: isMobile ? 100 : undefined,
      tooltipField: 'salary',
      tooltipValueGetter: params => `$${params.value.toLocaleString()}`
    },
    { 
      field: 'hireDate', 
      headerName: isMobile ? 'Hired' : 'Hire Date',
      filter: 'agDateColumnFilter',
      valueFormatter: params => isMobile 
        ? new Date(params.value).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' })
        : new Date(params.value).toLocaleDateString(),
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
      },
      hide: !columnVisible.hireDate,
      width: isMobile ? 100 : undefined,
      tooltipValueGetter: params => new Date(params.value).toLocaleDateString()
    },
    { 
      field: 'email', 
      headerName: isMobile ? 'Email' : 'Email Address',
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
      },
      hide: !columnVisible.email,
      width: isMobile ? 150 : undefined,
      tooltipField: 'email'
    }
  ], [columnVisible, isMobile]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: !isMobile,
    flex: isMobile ? undefined : 1,
    minWidth: isMobile ? 80 : 150,
    editable: false,
    cellClass: 'editable-cell',
    wrapText: true,
    autoHeight: true,
    suppressSizeToFit: isMobile,
    tooltipComponentParams: {
      color: '#fff',
      backgroundColor: '#333',
      borderRadius: '5px',
      padding: '10px',
      maxWidth: '300px'
    }
  }), [isMobile]);

  const paginationProps = useMemo(() => ({
    pagination: true,
    paginationPageSize: isMobile ? 10 : 15,
    paginationAutoPageSize: false,
    suppressPaginationPanel: isMobile,
    domLayout: isMobile ? 'autoHeight' : 'normal'
  }), [isMobile]);

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

  const toggleColumnVisibility = (column) => {
    setColumnVisible(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    if (isMobile) {
      params.api.sizeColumnsToFit();
    } else {
      params.api.sizeColumnsToFit();
    }
  }, [isMobile]);

  const MobilePagination = ({ api }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
      if (api) {
        setCurrentPage(api.paginationGetCurrentPage());
        setTotalPages(api.paginationGetTotalPages());
        
        const listener = () => {
          setCurrentPage(api.paginationGetCurrentPage());
          setTotalPages(api.paginationGetTotalPages());
        };
        
        api.addEventListener('paginationChanged', listener);
        return () => api.removeEventListener('paginationChanged', listener);
      }
    }, [api]);

    const goToPage = (page) => {
      api.paginationGoToPage(page);
    };

    const goToNext = () => {
      api.paginationGoToNextPage();
    };

    const goToPrevious = () => {
      api.paginationGoToPreviousPage();
    };

    if (totalPages <= 1) return null;

    return (
      <div className="mobile-pagination">
        <button 
          onClick={goToPrevious} 
          disabled={currentPage === 0}
          className="pagination-button prev-button"
        >
          Previous
        </button>
        
        <span className="page-info">
          {currentPage + 1} / {totalPages}
        </span>
        
        <button 
          onClick={goToNext} 
          disabled={currentPage >= totalPages - 1}
          className="pagination-button next-button"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="employee-directory-container">
      <h1 className="directory-title">cGxP Tech Employee Directory</h1>
      
      <div className="control-panel">
        <div className="action-buttons">
          <button
            onClick={handleSave}
            disabled={!editInProgress}
            className={`save-button ${editInProgress ? 'active' : 'disabled'}`}
          >
            {isMobile ? 'Save' : 'Save All Changes'}
          </button>
          <button
            onClick={handleCancel}
            disabled={!editInProgress}
            className={`cancel-button ${editInProgress ? 'active' : 'disabled'}`}
          >
            {isMobile ? 'Revert' : 'Revert All'}
          </button>
        </div>
        
        <div className="column-toggle-container">
          <span className="column-toggle-label">Columns:</span>
          <div className="column-checkboxes">
            {Object.keys(columnVisible).map(col => (
              <label key={col} className="column-toggle-item">
                <input
                  type="checkbox"
                  checked={columnVisible[col]}
                  onChange={() => toggleColumnVisibility(col)}
                />
                <span>{isMobile ? col.substring(0, 3) : col}</span>
              </label>
            ))}
          </div>
        </div>
        
        {editInProgress && (
          <span className="unsaved-changes-message">
            {isMobile ? 'Unsaved changes!' : 'You have unsaved changes!'}
          </span>
        )}
      </div>

      <div className={`ag-theme-alpine grid-container ${isMobile ? 'mobile-view' : ''}`}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          {...paginationProps}
          suppressRowClickSelection={true}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          stopEditingWhenCellsLoseFocus={true}
          singleClickEdit={true}
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
          getRowStyle={params => ({
            background: editInProgress ? '#fff8e1' : 'white'
          })}
          suppressDragLeaveHidesColumns={true}
          suppressMakeColumnVisibleAfterUnGroup={true}
          animateRows={true}
          rowDragManaged={true}
          suppressMoveWhenRowDragging={true}
          onColumnMoved={() => setEditInProgress(true)}
          onColumnPinned={() => setEditInProgress(true)}
          onColumnVisible={() => setEditInProgress(true)}
          suppressHorizontalScroll={false}
          alwaysShowHorizontalScroll={isMobile}
          tooltipShowDelay={isMobile ? 500 : 200}
          tooltipMouseTrack={isMobile}
        />
      </div>

      {isMobile && gridApi && (
        <MobilePagination api={gridApi} />
      )}

      <div className="footer-info">
        <div className="employee-count">
          Showing {rowData.length} employees
        </div>
        {isMobile && (
          <div className="mobile-hint">
            ← Scroll → to see all columns
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;