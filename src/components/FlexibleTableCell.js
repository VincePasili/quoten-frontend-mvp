import React, { useState, useCallback, useRef } from 'react';
import { Tooltip } from '@mui/material';
import { ActionsIcon, ColoredCircleIcon, MoreIcon } from './Icons';
import FlexibleMiniModal from './FlexibleMiniModal';

const getColorFromWord = (str) => {
  const cleanStr = str.replace(/\s/g, '').toUpperCase();
  let hash = 0;
  for (let i = 0; i < cleanStr.length; i++) {
    hash = (hash * 31 + cleanStr.charCodeAt(i)) | 0; 
  }
  // Ensure the hue value is within 0-359 range
  return `hsl(${(hash % 360 + 360) % 360}, 80%, 35%)`;
};

// Helper function for calculating dynamic width
const calculateDynamicWidth = (cellValue, pelletPadding, estimatedCharacterWidth, isColorMarkerColumn) => {
  if (Array.isArray(cellValue)) {
    const maxLength = cellValue[0] ? cellValue[0].length + 5 : 5;
    return Math.max(maxLength * estimatedCharacterWidth, pelletPadding);
  }
  if (isColorMarkerColumn) {
    return Math.max(cellValue.length * estimatedCharacterWidth, pelletPadding);
  }
  return pelletPadding;
};

const FlexibleTableCell = ({
  columnId,
  cellValue,
  columnDefination,
  maxCellHeight = 20,
  maxCellWidth = '150px',
  pelletPadding = 20,
  estimatedCharacterWidth = 8,
  columnsWithPellets = [],
  columnsWithColorMarkers = [],
  actionItems = [],
  onAction,
  firstColumnClassNames = 'text-sm font-bold',
  customCellClasses = '',
  buttonActionActive
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  const isFirstColumn = columnId === '0';
  const isColorMarkerColumn = columnsWithColorMarkers.includes(columnDefination.accessorKey);
  const isPelletColumn = columnsWithPellets.includes(columnDefination.accessorKey);

  const dynamicWidth = calculateDynamicWidth(cellValue, pelletPadding, estimatedCharacterWidth, isColorMarkerColumn);

  const handleAction = useCallback((action) => {
    if (onAction) {
      onAction(action);
    }
  }, [onAction]);

 
  const renderContent = () => {
    if(columnDefination.id === "actions") {
        return (
          <div className="flex items-center mini-modal-trigger px-3" >
          <ActionsIcon/>
          <FlexibleMiniModal 
            purpose="actions"
            items={actionItems} 
            onSelect={handleAction}
            trigger='click' 
            triggerSelector='.mini-modal-trigger' 
            />
        </div>
        );
    }

    if(columnDefination.id === "buttons") {
      return (
        <div 
          onClick={() => handleAction('upvote')} 
          className="flex items-center justify-center px-3"
        >
          {buttonActionActive ? (
            <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin-slow" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                </path>
            </svg>
          ) : (
            columnDefination.buttonIcon
          )}
        </div>
      );
  }

    if (Array.isArray(cellValue) && cellValue.length > 0) {
      return (
        <div className="flex items-center">
          <span className="bg-gray-300 text-gray-800 px-2.5 py-1.5 rounded-full text-xs font-semibold">
            {cellValue[0]}
          </span>
          {cellValue.length > 1 && (
            <div
              className="relative z-0 mini-modal-trigger-hover"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <MoreIcon className="ml-2 h-4 w-4 cursor-pointer" />
              {<FlexibleMiniModal items={cellValue.slice(1)} trigger='mousemove' triggerSelector='.mini-modal-trigger-hover'  />}
            </div>
          )}
        </div>
      );
    }
    if (isPelletColumn) {
      return (
        <span className="flex bg-gray-300 text-gray-800 px-3 my-2 py-1 rounded-full text-xs font-semibold">
          {isColorMarkerColumn && <ColoredCircleIcon color={getColorFromWord(cellValue)} />}
          {cellValue}
        </span>
      );
    }
    return (
      <Tooltip 
        title={cellValue} 
        placement="top" 
        arrow
        PopperProps={{
          popperOptions: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 10],
                },
              },
            ],
          },
        }}
      >
        <span 
          className={`my-1 ${isFirstColumn && firstColumnClassNames ? firstColumnClassNames : customCellClasses + " text-center" } w-full truncate`}
          style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {(Array.isArray(cellValue) && cellValue.length == 0) ? "No " + columnDefination.name : cellValue}
        </span>
      </Tooltip>
    );
  };

  return (
    <div
      className={`text-sm ${isFirstColumn && firstColumnClassNames ? firstColumnClassNames : ''}`}
      style={{ minWidth: dynamicWidth, maxWidth: isPelletColumn ? dynamicWidth + 80 : maxCellWidth,  maxHeight: maxCellHeight }}
      aria-label={`Cell for ${columnDefination.name}`}
    >
      {renderContent()}
    </div>
  );
};

export default FlexibleTableCell;
