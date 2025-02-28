import { Box } from '@mui/material';
import React from 'react';


const HomeLayout = () => {
    return (
        <Box sx={{
            width: 1,
            height: '100%',
            
        }}>
            <Box sx={{
                width: '30%',
                height: '100%',
                backgroundColor: "#093545",
            }}/>
            <Box sx={{
                width: '70%',
                height: '100%',
                backgroundColor: '#ffffff',
            }}/>

        </Box>
    );
}

export default HomeLayout;