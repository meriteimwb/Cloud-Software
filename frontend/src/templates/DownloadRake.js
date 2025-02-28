import React, { useEffect, useState } from 'react';
import { Stack, Typography, Divider, Autocomplete, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DataGrid } from '@mui/x-data-grid'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import ProgressDialog from '../components/ProgressDialog';

const useStyles = makeStyles({
    root: {
        height: 6,
        backgroundColor: '#006A71',
    },
});

const columns = [
    {
        field: 'id',
        headerName: 'Position No',
        flex: 1,
        sortable: false,
    },
    {
        field: 'wagonType',
        headerName: 'Wagon Type',
        flex: 1,
        sortable: false,
    },
    {
        field: 'wagonNo',
        headerName: 'Wagon No',
        flex: 1,
        sortable: false,
    },
    {
        field: 'printedTare',
        headerName: 'Printed Tare',
        flex: 1,
        sortable: false,
    },
    {
        field: 'carryingCapacity',
        headerName: 'Carrying Capacity',
        flex: 1,
        sortable: false,
    },
];

const DownloadRake = () => {
    
    // axios.defaults.timeout = 60000;

    const [rakeID, setrakeid] = useState({
        'rake': [],
    });

    const [selectedRake, setSelecteRake] = useState("")

    const navigate = useNavigate();
    const {state} = useLocation();

    console.log(state.wgid);

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);

    const url = "";
    // const url = "http://localhost:8000";

    const handlerakeid = () => (event, value) => {
        console.log(value);
        setSelecteRake(value)
        axios.get(url + '/getrakedetails/', {
            timeout: 600000,
            params: {rakeid: value},
        }) 
        .then(function (response) {
            console.log(response.data);
            let row_list = [];
            response.data.forEach(wagondetails => {
                let row_value = {};
                row_value['id'] = wagondetails['wgseqNo'];
                row_value['wagonType'] = wagondetails['wgType'];
                row_value['wagonNo'] = wagondetails['wgNumb'];
                row_value['printedTare'] = wagondetails['wgTare'];
                row_value['carryingCapacity'] = 0.0;
                console.log(row_value);
                row_list.push(row_value);
            });
            setRows(row_list);
        })
        .catch(function (error) {
            console.log(error);
        });
    }


    const fetchRakeDetails = () => {
        axios.post(url + '/getrakedetails/', {
            username: state.username,
            password: state.password,
            date: state.date,
            wgid: state.wgid,
        })
        .then(function (response) {
            let rakeids = [];
            response.data.forEach(rakeid => {
                rakeids.push(rakeid['rakeID']);
            });
            console.log(rakeids);
            setrakeid({ 'rake' : rakeids.sort()});
            setOpen(false)
        })
        .catch(function (error) {
            console.log(error);
            setOpen(false)
            toast.error("Try Again", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
    }

    const handleSave = () => {
        axios.post(url + '/weighing/rakes/', {
            rakeID: selectedRake,
            reverse : false,
            wgid: state.wgid,
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data === 'Rake Selected') {
                toast.success("Rake Selected Successfully", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error(response.data, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
        setOpen(true)
        // calling fetch data function to get WeighBride ids from server and load to autocomplete component
        fetchRakeDetails();
    },[])

    return(
        <Stack direction={'column'} sx={{ height : '90%'}}>
            <Typography variant='h5' width={400} fontWeight={700} textAlign={'center'}>
                DOWNLOAD RAKE DATA FROM FOIS
            </Typography>
            <Divider sx={{ backgroundColor: '#006A71', opacity: 1, height: 4}}/>
            <Stack direction={'row'} marginTop={2} spacing={5} sx={{ height : '100%'}}>
                <Stack direction={'column'}>
                    <Stack direction={'column'} spacing={0}>
                        <Typography variant='h6' fontWeight={400}>Rake Details</Typography>
                        <Typography variant='subtitle2' fontWeight={300}>Wagon Number and Tare Weight</Typography>
                    </Stack>
                </Stack>
                <Stack direction={'column'} width={1} >
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} paddingLeft={10} paddingRight={10}>
                        <Autocomplete
                            id="combo-box-demo"
                            options={rakeID.rake}
                            onChange={handlerakeid()}
                            sx={{ width: 250, height: 55, 
                                input: {
                                    "&::placeholder": {
                                       opacity: 1,
                                    },
                                    color: '#fff'
                                },
                            }}
                            renderInput={(params) => <TextField {...params} InputLabelProps={{shrink: false}} placeholder="Rake ID" sx={{
                                backgroundColor: '#093545',
                                borderRadius: 2.5,
                            }} />}
                        />
                        <Button variant='contained' onClick={handleSave} sx={{ 
                            width: 200,
                            height: 55,
                            backgroundColor: '#093545',
                            borderRadius: 2.5,
                        }}>SAVE</Button>
                    </Stack>
                    <DataGrid
                        rows={rows}
                        columns={columns} 
                        sx={{
                            marginTop:3
                        }}
                        disableColumnMenu
                        hideFooter
                        />
                </Stack>
            </Stack>
            <ProgressDialog 
                open={open}
                // onClose={handleClose}
                // value={dialogValue}
            />
        </Stack>
    );
}

export default DownloadRake;