import React, { useState, useEffect, useRef } from 'react';

const UserDropdown = ({ account, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left user-dropdown rounded-full" ref={dropdownRef}>
      <button  
        type="button" 
        className="inline-flex justify-center w-full px-2 py-2 text-sm rounded-full font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-200" 
        id="user-menu-button" 
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        <svg 
          className="w-6 h-6"
          viewBox="0 0 48 48" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 0h48v48H0z" fill="none"/>
          <g id="Shopicon">
            <circle cx="24" cy="24" r="5"/>
            <circle cx="24" cy="11" r="5"/>
            <circle cx="24" cy="37" r="5"/>
          </g>
        </svg>
      </button>

      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" 
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="user-menu-button"
        >
          <div className="p-2" role="none">
            <button 
              id="user-account-button"
              className="flex items-center w-full p-2 text-sm font-semibold text-gray-700 rounded hover:bg-gray-100 focus:outline-none"
              onClick={() => {
                toggleDropdown();
                account();
              }}
              role="menuitem"
              aria-label="View your account"
            >
              <svg 
                version="1.0" 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-5 h-5 ml-1 mr-2 text-gray-500"
                aria-hidden="true"
              >
                <g 
                    transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                    fill="currentColor" 
                    stroke="none"
                >
                    <path 
                      d="M2380 5114 c-19 -2 -78 -9 -130 -14 -330 -36 -695 -160 -990 -336 -375 -224 -680 -529 -904 -904 -175 -292 -291 -632 -338 -990 -16 -123 -16 -497 0 -620 82 -623 356 -1150 820 -1581 256 -239 575 -425 922 -539 274 -91 491 -124 800 -124 228 0 329 9 530 50 689 141 1304 583 1674 1204 175 292 291 632 338 990 16 123 16 497 0 620 -47 358 -163 698 -338 990 -224 375 -529 680 -904 904 -289 173 -634 291 -980 336 -88 12 -438 21 -500 14z m385 -304 c583 -54 1146 -347 1517 -790 487 -581 652 -1337 452 -2067 -77 -281 -213 -550 -398 -785 -34 -43 -63 -78 -66 -78 -3 0 -19 43 -35 96 -85 284 -283 589 -512 790 -144 126 -341 247 -518 319 l-40 16 35 26 c63 47 216 208 253 266 142 221 202 460 177 704 -37 366 -251 681 -575 850 -674 350 -1488 -91 -1565 -850 -20 -197 18 -404 106 -579 71 -141 189 -287 305 -375 27 -20 49 -40 49 -43 0 -3 -33 -18 -73 -34 -270 -109 -540 -321 -729 -571 -109 -145 -213 -349 -264 -520 -15 -52 -31 -95 -34 -95 -8 0 -122 148 -179 233 -63 94 -174 310 -219 425 -78
                      198 -127 427 -144 675 -52 717 271 1445 839 1898 459 366 1041 542 1618 489z m5 -860 c257 -73 458 -274 536 -535 35 -119 37 -289 6 -406 -93 -347 -395 -579 -752 -579 -357 0 -659 232 -752 579 -31 117 -29 287 6 406 88 296 316 497 636 559 58 11 247 -3 320 -24z m-5 -1851 c310 -40 584 -178 821 -414 178 -178 290 -358 362 -585 26 -81 67 -271 59 -275 -1 -1 -31 -24 -67 -52 -308 -240 -679 -394 -1095 -454 -116 -17 -454 -17 -570 0 -416 60 -787 214 -1095 454 -36 28 -66 51 -67 52 -2 1 4 39 12 84 91 517 461 950 961 1124 221 77 431 98 679 66z"
                    />
                </g>
              </svg>
              <span>Your account</span>
            </button>  
            <button 
              className="flex items-center w-full p-2 text-sm font-semibold text-gray-700 rounded hover:bg-gray-100 focus:outline-none"
              onClick={() => {
                toggleDropdown();
                logout();
              }}
              role="menuitem"
              aria-label="Logout"
            >
              <svg 
                className="w-6 h-6 mr-2 text-gray-500" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path 
                  d="M9 7.67363C6.63505 8.79709 5 11.2076 5 14C5 17.866 8.13401 21 12 21C15.866 21 19 17.866 19 14C19 11.2076 17.3649 8.79709 15 7.67363M12 4V12" 
                  stroke="currentColor"
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span>Logout</span>
            </button>         
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;