import React, { useState } from 'react';
import NotificationContext from '../contexts/NotificationContext';
import { fetchNotifications, updateNotifications } from '../utilities/api';

export const NotificationProvider = ({ children }) => {
  const [hasUnviewedNotifications, setHasUnviewedNotifications] = useState(false);

  const refreshNotifications = async () => {
    try {
      // const response = await fetchNotifications();
      // const hasUnviewed = response.notifications.some(notification => !notification.viewed);
      // setHasUnviewedNotifications(hasUnviewed);
    } catch (error) {
      // Handle error silently
    }
  };

  const markNotificationsAsViewed = async () => {
    try {
      // await updateNotifications();
      setHasUnviewedNotifications(false);
    } catch (error) {
      // Handle error silently 
    }
  };

  return (
    <NotificationContext.Provider 
      value={{
        hasUnviewedNotifications,
        refreshNotifications,
        markNotificationsAsViewed,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};