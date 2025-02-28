// WithNav.js (Stand-alone Functional Component)
import React from 'react';
import NavigationBar from './NavigationBar';
import { Outlet } from 'react-router';
import { Box } from '@mui/material';


const WithNavBar = () => {
  console.log("Inside Nav BAr");
    return (
      <Box width={1} height={'100vh'}>
        <NavigationBar />
        <Outlet />
      </Box>
    );
}

export default WithNavBar;