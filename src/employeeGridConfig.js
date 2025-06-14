const dateFilterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    const dateParts = cellValue.split('-');
    const cellDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    if (cellDate < filterLocalDateAtMidnight) return -1;
    if (cellDate > filterLocalDateAtMidnight) return 1;
    return 0;

  }
};

export const employeeColumnDefs = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 80 
  },
  { 
    field: 'name', 
    headerName: 'Employee Name',
    filter: 'agTextColumnFilter',
    floatingFilter: true
  },
];