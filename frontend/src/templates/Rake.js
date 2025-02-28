import React from 'react';
import { Stack, Grid, Button, Box, TextField, Divider } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Rake = () => {
    const [value, setValue] = React.useState(dayjs());

    const handleChange = (newValue) => {
        // console.log(newValue);
        
        // console.log(date);
        setValue(newValue);
    };

    const navigate = useNavigate();
    const {state} = useLocation();

    const handleDownload = () => {
        const formattedDate = dayjs(value).format('DD-MM-YYYY');
        navigate("/rake/download", { state : { username : state.username,  wgid: state.wgid, date: formattedDate, password: state.password }});
    }

    const handleEdit = () => {
        const formattedDate = dayjs(value).format('DD-MM-YYYY');
        navigate("/rake/edit", { state : { username : state.username,  wgid: state.wgid, date: formattedDate, password: state.password }});
    }

    return(
        <Grid
            sx={{height:'92%'}}
            container
            direction="row"
            alignItems="center"
            justifyContent="space-evenly"
        >
            <Stack direction={'column'} spacing={20}>
                <Button variant='contained' onClick={handleEdit} sx={{
                    width: { sm: 150, md: 250, lg: 350},
                    height: 100,
                    borderRadius: 7,
                    backgroundColor:'#30475E',
                    fontSize: '32px',
                }}
                >RAKE DETAILS</Button>
                <Button variant='contained' onClick={handleDownload} sx={{
                    width: { sm: 150, md: 250, lg: 350},
                    height: 100,
                    borderRadius: 7,
                    backgroundColor:'#F05454',
                    fontSize: '32px',
                }}
                >DOWNLOAD</Button>
            </Stack>
            <Divider orientation="vertical" variant="middle" sx={{
                height: '70%',
                backgroundColor: '#000',
            }}/>
            <Box sx={{
                    width: { sm: 150, md: 250, lg: 350},
                    height: 100,
                    borderRadius: 7,
                    backgroundColor: '#121212',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DesktopDatePicker
                        views={['year', 'month', 'day']}
                        inputFormat="DD/MM/YYYY"
                        value={value}
                        onChange={handleChange}
                        renderInput={(params) => <TextField variant='standard' {...params}  sx={{
                            svg: { color: '#fff' },
                            input: { color: '#fff', fontSize: '20px',},
                            
                        }}/>}
                    />
                </LocalizationProvider>
            </Box>
        </Grid>
    );
}

export default Rake;