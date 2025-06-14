const dateFilterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    const dateParts = cellValue.split('-');
    const cellDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    if (cellDate < filterLocalDateAtMidnight) return -1;
    if (cellDate > filterLocalDateAtMidnight) return 1;
    return 0;
  }
};

export const columnDefs = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 80 
  },
  { 
    field: 'title', 
    headerName: 'Job Title',
    filter: 'agTextColumnFilter',
    floatingFilter: true
  },
  { 
    field: 'company', 
    headerName: 'Company',
    filter: 'agTextColumnFilter'
  },
  { 
    field: 'location', 
    headerName: 'Location',
    filter: 'agSetColumnFilter',
    filterParams: {
      values: ['San Francisco', 'New York', 'Remote', 'Boston']
    }
  },
  { 
    field: 'salary', 
    headerName: 'Salary',
    filter: 'agNumberColumnFilter',
    filterParams: {
      filterOptions: ['equals', 'lessThan', 'greaterThan'],
      suppressAndOrCondition: true
    },
    valueFormatter: params => `$${params.value.toLocaleString()}`
  },
  { 
    field: 'type', 
    headerName: 'Job Type',
    filter: 'agSetColumnFilter',
    filterParams: {
      values: ['Full-time', 'Part-time', 'Contract', 'Internship']
    }
  },
  { 
    field: 'postedDate', 
    headerName: 'Posted Date',
    filter: 'agDateColumnFilter',
    filterParams: dateFilterParams
  },
  { 
    field: 'status', 
    headerName: 'Status',
    filter: 'agSetColumnFilter',
    filterParams: {
      values: ['Active', 'Pending', 'Closed']
    }
  }
];