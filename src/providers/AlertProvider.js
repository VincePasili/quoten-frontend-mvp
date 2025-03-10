// src/contexts/AlertProvider.js
import React, { useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AlertContext from '../contexts/AlertContext'; 

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const showAlert = ({ message, severity = 'success' }) => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
      <Snackbar open={alert.open} autoHideDuration={7000} onClose={closeAlert}>
        <MuiAlert 
            elevation={6} 
            variant="filled" 
            onClose={closeAlert} 
            severity={alert.severity}
            sx={{
                maxWidth: '500px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
        >
          {alert.message}
        </MuiAlert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
