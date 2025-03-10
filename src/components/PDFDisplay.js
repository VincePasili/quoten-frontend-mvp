import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePdfUrl } from '../utilities/api'; 

const PDFDisplay = () => {
  const navigate = useNavigate();
  const { pdfUrl } = usePdfUrl();

  // Optionally, if there's no URL stored you can redirect back or show a message
  if (!pdfUrl) {
    return (
      <Box sx={{ p: 2 }}>
        <p>No PDF available to display.</p>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <iframe 
          title="PDF Viewer"
          src={`${pdfUrl}#toolbar=0`} 
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </Box>
    </Box>
  );
};

export default PDFDisplay;
