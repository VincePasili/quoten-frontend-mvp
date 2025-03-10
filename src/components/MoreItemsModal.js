import React, { useState, useEffect, useRef } from 'react';

const MoreItemsModal = ({ items }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (modalRef.current) {
      const modalWidth = modalRef.current.offsetWidth;
      const newLeft = position.x - modalWidth;
      modalRef.current.style.left = `${newLeft}px`;
    }
  }, [position]);

  return (
    <div 
      className="fixed z-[9999]"
      ref={modalRef}
      style={{ top: `${position.y + 20}px` }}
    >
      <div className="bg-white border border-gray-300 rounded-md p-4 shadow-lg">
        <ul className="space-y-0">
          {items.map((item, idx) => (
            <li 
              key={idx} 
              className="text-sm text-gray-800 border-t border-b border-gray-200 py-2"
              aria-label={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoreItemsModal;