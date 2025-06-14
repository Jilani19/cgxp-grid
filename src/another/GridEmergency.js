import React, { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

const loadScript = (src) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [src]);
};

const GridEmergency = () => {
  loadScript('https://unpkg.com/ag-grid-community@31.1.1/dist/ag-grid-community.min.js');
  
  return (
    <div 
      className="ag-theme-alpine"
      style={{
        height: '150px',
        width: '300px',
        border: '2px solid red',
        margin: '20px auto'
      }}
    >
      <AgGridReact
        rowData={[{ name: 'Emergency Row' }]}
        columnDefs={[{ field: 'name' }]}
        onGridReady={(params) => {
          console.log('Grid ready:', params);
          params.api.sizeColumnsToFit();
        }}
      />
    </div>
  );
};

export default GridEmergency;