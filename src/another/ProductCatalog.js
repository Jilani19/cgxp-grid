import React from 'react';
import DataGridComponent from '../DataGridComponent';

const dateFilterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    const dateParts = cellValue.split('-');
    const cellDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    if (cellDate < filterLocalDateAtMidnight) return -1;
    if (cellDate > filterLocalDateAtMidnight) return 1;
    return 0;
  }
};

const defaultColDef = {
  sortable: true,
  resizable: true,
  flex: 1,
  minWidth: 120
};

const ProductCatalog = () => {
  const rowData = [
    { 
      id: 1, name: "Laptop", category: "Electronics", 
      price: 999, stock: 45, lastRestock: "2023-07-10", 
      supplier: "TechSupplies" 
    },
  ];

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 80 },
    { 
      field: 'name', 
      headerName: 'Product Name',
      filter: 'agTextColumnFilter',
      floatingFilter: true
    },
  ];

  return (
    <DataGridComponent
      title="Product Catalog"
      rowData={rowData}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      enableFilters={true}
    />
  );
};

export default ProductCatalog;