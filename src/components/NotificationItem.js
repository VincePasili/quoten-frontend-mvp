// NotificationItem.js

import React from 'react';
import { TeamIcon, ProjectsIcon, QuoteIcon, ThumbsUpIcon } from './Icons';

const ICON_MAP = {
  'quote_upvoted': ThumbsUpIcon,
  'quote_created': QuoteIcon,
  'new_member': TeamIcon,
  'new_project': ProjectsIcon,
};

const COLOR_MAP = {
  'quote_upvoted': 'bg-gray-300 text-gray-700',
  'quote_created': 'bg-blue-600 text-white', 
  'new_member': 'bg-blue-600 text-white',
  'new_project': 'bg-green-500 text-white',
};

const NotificationItem = ({ 
  content, 
  type, 
  scope, 
  projectName, 
  timeAgo,
  onUndo, 
  className = '',
  maxLineWidth = 32,
}) => {
  const Icon = ICON_MAP[type] || (() => <div>No Icon</div>);
  const boldText = scope === 'project' ? projectName : 
    ({
      'quote_upvoted': 'Quote Upvoted',
      'quote_created': 'Quote Created',
      'new_member': 'New Team Member Added',
      'new_project': 'New Project Added',
    }[type] || '');

  const breakText = (text, width) => text.split(' ').reduce((acc, word) => {
    if (!acc.length || acc[acc.length - 1].length + word.length + 1 > width) {
      acc.push(word);
    } else {
      acc[acc.length - 1] += ' ' + word;
    }
    return acc;
  }, []).join('\n');

  const brokenContent = breakText(content, maxLineWidth);

  return (
    <div className={`p-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer ${className}`}>
      <div className="flex items-start">
        <div className={`mr-2 mt-1.5 ${COLOR_MAP[type]} rounded-full p-2`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">{boldText}</p>
          <span className="text-sm text-gray-800">
            {brokenContent.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < brokenContent.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        </div>
      </div>
      {type === 'quote_upvoted' && onUndo && (
        <div className="ml-10 mt-2 flex justify-left">
          <button 
            className="text-xs text-blue-700 font-bold hover:underline"
            onClick={onUndo}
          >
            Undo
          </button>
        </div>
      )}
      <div className="mr-10 mt-4 flex justify-end">
          <span className="text-xs text-gray-700 font-bold">{timeAgo}</span>
      </div>
    </div>
  );
};

export default NotificationItem;