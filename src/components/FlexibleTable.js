import React, { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable, MRT_TablePagination } from 'material-react-table';
import FlexibleTableCell from './FlexibleTableCell';

const isActionsColumn = (columnId) => {return columnId && columnId === "actions"}

const FlexibleTable = ({ 
  data = [], 
  columns = [], 
  showColumnActions = true, 
  maxCellHeight = "130px", 
  showTopToolbar = false, 
  showBottomToolbar = false,
  enableColumnOrdering=false,
  columnsWithPellets = [],
  columnsWithColorMarkers = [],
  addRowButtonText = "Add Item",
  addRowButtonId= "add-row-button",
  actionItems = [],
  noAddButton = false,
  onAction,
  firstColumnClassNames,
  customCellClasses,
  buttonActionActive = false
}) => {
  const defaultColumn = {
    name: "No Columns",
    accessorKey: "noData",
    header: () => "No Columns To Display",
    Cell: () => "No Data",
  };

  const commonProps = {
    estimatedCharacterWidth: 8,
    pelletPadding: 20,
  };

  const memoizedColumns = useMemo(() => 
    columns.length === 0 ? [defaultColumn] : columns.map((column, index) => ({
      ...column,
      header: '',
      Header: ({ column }) => (
        <div 
          className={`flex items-center text-sm font-normal p-3 ${isActionsColumn(column.columnDef.id) ? "hover:cursor-pointer" : ""}`}
          onClick={(event) => {
            if(isActionsColumn(column.columnDef.id)){
              onAction("update_columns", null, event)
            }
          }}
        >
          <span className="inline-block w-6 h-6 leading-6 overflow-hidden">
            {column.columnDef.icon}
          </span>
          <span className="header-text font-semibold text-gray-900">
            {column.columnDef.name}
          </span>
        </div>
      ),
      Cell: ({ column, row, cell }) => (
        <FlexibleTableCell 
          columnId={index.toString()} // Convert to string since columnId in FlexibleTableCell expects a string
          columnDefination={column.columnDef} 
          rowDefination={row.rowDefination}
          cellValue={cell.getValue()} 
          maxCellHeight={maxCellHeight} 
          {...commonProps}
          columnsWithPellets={columnsWithPellets}
          columnsWithColorMarkers={columnsWithColorMarkers}
          actionItems={actionItems}
          onAction={(action) => onAction(action, row.original)}
          firstColumnClassNames = {firstColumnClassNames}
          customCellClasses={customCellClasses}
          buttonActionActive={buttonActionActive}
        />
      ),
      muiTableHeadCellProps: {
        sx: {
          border: '1px solid #ddd', 
          ...column.muiTableHeadCellProps?.sx
        },
      },
      muiTableBodyCellProps: {
        sx: {
          border: '1px solid #eff2f6',
          padding: '4px',
          paddingLeft: '10px',
          ...column.muiTableBodyCellProps?.sx
        },
      },
      enableColumnActions: showColumnActions,
    }))
  , [columns, maxCellHeight, showColumnActions, columnsWithColorMarkers]);

  const table = useMaterialReactTable({
    data: data.length === 0 ? [{ noData: "No Data Available" }] : data,
    columns: memoizedColumns,
    enableTopToolbar: showTopToolbar,
    enableBottomToolbar: showBottomToolbar,
    enableColumnOrdering: enableColumnOrdering,
    renderBottomToolbar: ({ table }) => (
      <div className="flex items-center justify-end px-4 py-3 border-t border-gray-200">
        {data.length > 10 && 
          <div className="flex items-center space-x-2">
            <MRT_TablePagination 
              table={table} 
              position="bottom"
              showRowsPerPage={true}
              rowsPerPageOptions={[10, 20, 50, 100]}
              muiTablePaginationProps={{
                sx: {
                  '& .MuiTablePagination-selectLabel': {
                    color: 'black',
                  },
                  '& .MuiTablePagination-select': {
                    color: 'black',
                  },
                  '& .MuiTablePagination-displayedRows': {
                    color: 'black',
                  },
                  '& .MuiIconButton-root': {
                    color: 'black',
                  },
                },
              }}
            />
          </div>
        }

        {!noAddButton && (
          <button 
            id = {addRowButtonId}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold font-mono py-1 px-4 rounded-full transition duration-300 ease-in-out"
            onClick={() => onAction("create")}
          >
            {addRowButtonText}
          </button>
        )}
      </div>
    ),
    muiTablePaperProps: {
      sx: {
        border: '2px solid #eff2f6', 
        borderBottom: '0px',
        boxShadow: 'none',
      },
    },
    muiTableContainerProps: {
      sx: {
        paddingBottom: '0px',
      },
    },
    
  });

  return columns.length === 0 && data.length === 0 
    ? <div>No data or columns to display.</div>
    : <MaterialReactTable table={table} />;
};

export default FlexibleTable;