// src/components/Navbar.js
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../contexts/AuthContext';
import NotificationContext from '../contexts/NotificationContext';
import UserDropdown from './UserDropdown';

import logo from '../assets/logo/logo.png';

import { useUserData, useAPIKeys, useQuoteFiles, useAdditionalInfo, useNotifications, useUpdateNotificationsMutation } from '../utilities/api';

import NotificationsModal from './NotificationsModal';
import UserAccountModal from './UserAccountModal';
import ContactInfoModal from './ContactInfoModal';
import SearchBar from './SearchBar';

// Logo component
const Logo = () => (
  <div className="flex items-center">
    <a href="#" aria-label="Go to homepage">
      <img src={logo} className="h-12 sm:h-16" alt="Quoten logo" />
    </a>
  </div>  
);



// ActionIcons component
const ActionIcons = ({ hasNotifications, logout, onOpenNotifications, onOpenUserAccount, onOpenContactInfoModal, avatarUrl }) => (
  <div className="relative flex items-center justify-end mr-10" role="toolbar" aria-label="User actions">
    <button 
      onClick={onOpenContactInfoModal}
      className="mx-2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200" 
      aria-label="Help"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 text-gray-600"
      >
        <path d="M9 9.00001C9.00011 8.45004 9.15139 7.91068 9.43732 7.44088C9.72325 6.97108 10.1328 6.58891 10.6213 6.33616C11.1097 6.08341 11.6583 5.96979 12.2069 6.00773C12.7556 6.04566 13.2833 6.23369 13.7323 6.55126C14.1813 6.86883 14.5344 7.30372 14.7529 7.8084C14.9715 8.31308 15.0471 8.86813 14.9715 9.41288C14.8959 9.95763 14.6721 10.4711 14.3244 10.8972C13.9767 11.3234 13.5185 11.6457 13 11.829C12.7074 11.9325 12.4541 12.1241 12.275 12.3775C12.0959 12.6309 11.9998 12.9337 12 13.244V14.5" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18V18.5001" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 23.25C18.2132 23.25 23.25 18.2132 23.25 12C23.25 5.7868 18.2132 0.75 12 0.75C5.7868 0.75 0.75 5.7868 0.75 12C0.75 18.2132 5.7868 23.25 12 23.25Z" stroke="#71717A" strokeWidth="1.5" strokeMiterlimit="10"/>
      </svg>
    </button>

    <div id="open-notifications-button" className="relative inline-block" onClick={onOpenNotifications}>
      <button 
        className="mx-2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200" 
        aria-label="Notifications"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="32" 
          height="32" 
          viewBox="0 0 256 256"
          className="fill-current text-gray-800"
        >
          <g fillOpacity="0.4902" fill="currentColor" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none">
            <g transform="scale(8,8)">
              <path d="M16,3c-1.10547,0 -2,0.89453 -2,2c0,0.08594 0.01953,0.16797 0.03125,0.25c-3.45703,0.88281 -6.03125,4.02344 -6.03125,7.75v9c0,0.56641 -0.43359,1 -1,1h-1v2h7.1875c-0.11328,0.31641 -0.1875,0.64844 -0.1875,1c0,1.64453 1.35547,3 3,3c1.64453,0 3,-1.35547 3,-3c0,-0.35156 -0.07422,-0.68359 -0.1875,-1h7.1875v-2h-1c-0.56641,0 -1,-0.43359 -1,-1v-8.71875c0,-3.75781 -2.51172,-7.10937 -6.03125,-8.03125c0.01172,-0.08203 0.03125,-0.16406 0.03125,-0.25c0,-1.10547 -0.89453,-2 -2,-2zM15.5625,7c0.14453,-0.01172 0.28906,0 0.4375,0c0.0625,0 0.125,0 0.1875,0c3.26563,0.09766 5.8125,2.96094 5.8125,6.28125v8.71875c0,0.35156 0.07422,0.68359 0.1875,1h-12.375c0.11328,-0.31641 0.1875,-0.64844 0.1875,-1v-9c0,-3.17578 2.44531,-5.77344 5.5625,-6zM16,25c0.5625,0 1,0.4375 1,1c0,0.5625 -0.4375,1 -1,1c-0.5625,0 -1,-0.4375 -1,-1c0,-0.5625 0.4375,-1 1,-1z"/>
            </g>
          </g>
        </svg>
        {hasNotifications && (
          <span 
            className="absolute top-2 right-4 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" 
            aria-label="You have notifications"
          ></span>
        )}
      </button>
    </div>
    
    <button 
      id="user-account-button"
      onClick={onOpenUserAccount}
      className='mx-2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200'
      aria-label="User profile"
    >
      {!avatarUrl ? (
        <svg 
          version="1.0" 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-6 h-6 ml-1 mr-2 text-gray-500"
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
      ) : (        
        <img src={avatarUrl} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-400" alt="User avatar" />
   
      )}              
      </button>
    
    <UserDropdown account={onOpenUserAccount} logout={logout}/>
  </div>
);


const Navbar = ({ className }) => {
  const { logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserAccountModalOpen, setIsUserAccountModalOpen] = useState(false);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);
  const [hasUnviewedNotifications, setHasUnviewedNotifications] = useState(false);

  const { userData, clearUserData, refreshUserData } = useUserData();
  const { notifications, refreshNotifications } = useNotifications();
  const { updateNotificationsMutate } = useUpdateNotificationsMutation();
  
  const { clearApiKeys } = useAPIKeys();
  const { clearQuoteFiles } = useQuoteFiles();
  const { clearQuoteExtraInfo } = useAdditionalInfo();

  useEffect(() => {
    refreshNotifications();
    refreshUserData();
  }, []);
  
  useEffect(() => {
    setHasUnviewedNotifications(notifications?.some(notification => !notification.viewed));
  }, [notifications, hasUnviewedNotifications]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = async () => {
      setIsModalOpen(true);
      if (hasUnviewedNotifications) {
        updateNotificationsMutate();
      }
    
  };

  const handleOpenUserAccount = () => {
    setIsUserAccountModalOpen(true);
  };

  const handleCloseUserAccount = () => {
    setIsUserAccountModalOpen(false);
  };

  const handleOpenContactInfo = () => {
    setIsContactInfoModalOpen(true);
  };
  
  const handleCloseContactInfo = () => {
    setIsContactInfoModalOpen(false);
  };

  const handleLogout = () => {
    clearUserData();
    clearApiKeys();
    clearQuoteExtraInfo();
    clearQuoteFiles();
    logout();
  }
  

  return (
    <div>
      <div className={`${className} hidden sm:grid grid-cols-3 items-center`} role="navigation" aria-label="Main navigation">
        <Logo />
        <SearchBar />
        <ActionIcons 
          hasNotifications={hasUnviewedNotifications} 
          onOpenNotifications={handleOpenModal} 
          logout={handleLogout} 
          onOpenUserAccount={handleOpenUserAccount} 
          onOpenContactInfoModal={handleOpenContactInfo}
          avatarUrl={userData?.avatarUrl}
        />
      </div>
      <div className='sm:hidden grid grid-rows-2'>
        <div className='grid grid-flow-col grid-cols-2 gap-4 items-center p-2' role="navigation" aria-label="Mobile navigation">
          <Logo />
          <ActionIcons 
            hasNotifications={hasUnviewedNotifications} 
            onOpenNotifications={handleOpenModal} 
            logout={handleLogout} 
            onOpenUserAccount={handleOpenUserAccount} 
            onOpenContactInfoModal={handleOpenContactInfo}
            avatarUrl={userData?.avatarUrl}
          />
        </div>
        <div className='grid mx-2'>
          <SearchBar />
        </div>
      </div>
      
      {isModalOpen && (
        <div className='max-w-40'>
          <NotificationsModal onClose={handleCloseModal} />
        </div>
      )}
      
      {isUserAccountModalOpen && (
        <UserAccountModal open={isUserAccountModalOpen} onClose={handleCloseUserAccount} />
      )}

      {isContactInfoModalOpen && (
        <ContactInfoModal open={isContactInfoModalOpen} onClose={handleCloseContactInfo} />
      )}
    </div>
  );
};

export default Navbar;