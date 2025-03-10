import React, { useState, useEffect, useRef } from 'react';

const FlexibleMiniModal = ({ purpose = 'display', onSelect, items, trigger, triggerSelector = '.mini-modal-trigger' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);

  // Character width for width calculation
  const charWidth = 8;

  useEffect(() => {
    const handleEvent = (e) => {
      const isTriggerElement = e.target.closest(triggerSelector);
      const isOutsideModal = !modalRef.current?.contains(e.target) && !document.querySelector(triggerSelector)?.contains(e.target);
    
      if (trigger === "click") {
        if (isTriggerElement) {
          setPosition({ x: e.clientX, y: e.clientY });
          setIsVisible(prev => !prev);
        } else if (isVisible && isOutsideModal) {
          setIsVisible(false);
        }
      } else {
        if (isTriggerElement) {
          setPosition({ x: e.clientX, y: e.clientY });
          setIsVisible(true);
        } else if (isVisible && isOutsideModal) {
          setIsVisible(false);
        }
      }
    };

    document.addEventListener(trigger, handleEvent);
    return () => document.removeEventListener(trigger, handleEvent);
  }, [isVisible, trigger, triggerSelector]);

  useEffect(() => {
    // Calculate max width based on content length
    if (items && items.length > 0) {
      const maxItemLength = Math.max(...items.map(item => (purpose === 'display' ? item : item.item).length));
      const estimatedWidth = maxItemLength * charWidth + 40; // Extra 40 for right padding
      setMaxWidth(estimatedWidth);
    }
  }, [items, purpose, charWidth]);

  useEffect(() => {
    if (modalRef.current) {
      const newLeft = position.x - maxWidth;
      modalRef.current.style.left = `${newLeft}px`;
      modalRef.current.style.width = `${maxWidth}px`;
    }
  }, [position, maxWidth]);

  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed z-[9999]"
      ref={modalRef}
      style={{ 
        top: `${position.y + 20}px`, 
        left: `${position.x - maxWidth}px`,
        width: `${maxWidth}px`
      }}
    >
      <div className="bg-white border border-gray-300 rounded-md p-4 shadow-lg">
        <ul className="space-y-0">
          {items.map((item, idx) => (
            <li 
              key={idx} 
              className={`text-sm text-gray-800 pb-2 hover:cursor-pointer ${purpose !== "actions" ?  ' border-t border-b border-gray-200' : ''}`}
              onClick={() => onSelect(item.action)}
              aria-label={purpose === 'display' ? item : item.item}
            >
              {purpose === 'display' ? item : item.item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FlexibleMiniModal;