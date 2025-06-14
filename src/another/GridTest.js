import React from 'react';
import { AgGridReact } from 'ag-grid-react';

const useStyle = (url) => {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [url]);
};

export const GridTest = () => {
  useStyle('https://unpkg.com/ag-grid-community@latest/styles/ag-grid.css');
  useStyle('https://unpkg.com/ag-grid-community@latest/styles/ag-theme-alpine.css');

  return (
    <div 
      className="ag-theme-alpine" 
      style={{ 
        height: '150px', 
        width: '300px',
        border: '2px solid red' 
      }}
    >
      <AgGridReact
        rowData={[{ name: 'Test Row' }]}
        columnDefs={[{ field: 'name' }]}
      />
    </div>
  );
};