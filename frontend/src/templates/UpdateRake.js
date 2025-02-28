import { Stack, Typography, Divider, Grid, TextField, Button} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import dayjs from 'dayjs';
import { toast } from 'react-toastify';


const UpdateRake = () => {

    const {state} = useLocation();
    const [values, setValues] = useState({
        serialNo : 0,
        rakeNo : "",
        commodity : "",
        srcStation : "",
        desStation : "",
        consignee : "",
        billingLine1 : "",
        billingLine2 : "",
        billingLine3 : "",
        oprName : state.username,
        noOfWagon : 0,
        locoNumber : "",
        rakePlacement : dayjs().format("DD/MM/YYYY HH:mm:ss"),
        completionAt : dayjs().format("DD/MM/YYYY HH:mm:ss"),
    });
    const url = "";
    // const url = "http://localhost:8000";

    const fetchData = () => {
        axios.get(url + "/update/rakeData/", {
            params: { wgid: state.wgid, serialNo: 'Latest', rake : state.rake },
        }).then((response) => {
            console.log(response.data[0]);
            let rakeData = response.data[0];
            let rakeDataCommodity = "";
            if (rakeData.commodity !== null) {
                rakeDataCommodity = rakeData.commodity;
            }
            setValues({
                serialNo : rakeData.serialNo,
                rakeNo : rakeData.rakeID,
                commodity : rakeDataCommodity,
                srcStation : rakeData.fromStation,
                desStation : rakeData.toStation,
                consignee : rakeData.cnsg,
                billingLine1 : "",
                billingLine2 : "",
                billingLine3 : "",
                oprName : state.username,
                noOfWagon : rakeData.wagonCount,
                locoNumber : rakeData.leadLoco,
                rakePlacement : dayjs().format("DD/MM/YYYY HH:mm:ss"),
                completionAt : dayjs().format("DD/MM/YYYY HH:mm:ss"),
            });
        });
    }

    useEffect(() => {
        // calling fetch data function to get WeighBride ids from server and load to autocomplete component
        fetchData();
    },[])

    const handleUpdate = () => {
        if (values.srcStation === "" || values.desStation === "" || values.commodity === "") {
            toast.warn("Please Fill Mandatory Fields", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            axios.post(url + '/update/rakeData/', {
                wgid: state.wgid,
                serialNo: values.serialNo,
                payload: values,
            })
            .then(function (response) {
                console.log(response.data);
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Try Again", {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
        }
    }

    const handleupdateValues = (event) => {
        let { name, value } = event.target;
        // if (name === "tareWt_manual" || name === "printReportAuto" || name === "printSummary") {
        //     value = event.target.checked;
        // }
        setValues({
            ...values,
            [name]: value,
        });
    }

    return(
        <Stack direction={'column'}sx={{ height: '90%' }} spacing={2}>
            <Typography variant='h5' fontWeight={500} paddingLeft={2} marginTop={2}>
                Rake Data Editing
            </Typography>
            <Divider sx={{ backgroundColor: '#006A71', opacity: 1, height: 4}}/>
            <Grid container direction={'column'} justifyContent={'space-evenly'} width={1}>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Serial Number</Typography>
                    <TextField autoComplete='off' size="small" name="serialNo"  value={values.serialNo} 
                        sx={{
                            paddingLeft: 3,
                        }}
                        inputProps={
                            { readOnly: true, }
                        }/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Rake Number</Typography>
                    <TextField autoComplete='off' size="small" name="rakeNo" value={values.rakeNo} 
                        sx={{
                            paddingLeft: 3,
                        }}
                        inputProps={
                            { readOnly: true, }
                        }/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Commodity*</Typography>
                    <TextField required autoComplete='off' size="small" name="commodity" value={values.commodity} onChange={handleupdateValues} sx={{
                        paddingLeft: 3,
                    }}/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Source Station*</Typography>
                    <TextField required autoComplete='off' size="small" name="srcStation" value={values.srcStation} onChange={handleupdateValues} sx={{
                        paddingLeft: 3,
                    }}/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Destination Station*</Typography>
                    <TextField required autoComplete='off' size="small" name="desStation" value={values.desStation} onChange={handleupdateValues} sx={{
                        paddingLeft: 3,
                    }}/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Consignee</Typography>
                    <TextField autoComplete='off' size="small" name="consignee" value={values.consignee} onChange={handleupdateValues} sx={{
                        paddingLeft: 3,
                    }}/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Billing Address Line 1</Typography>
                    <TextField autoComplete='off' size="small" name="billingLine1" value={values.billingLine1} onChange={handleupdateValues} sx={{
                        paddingLeft: 3,
                    }}/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Billing Address Line 2</Typography>
                    <TextField autoComplete='off' size="small" name="billingLine2" value={values.billingLine2} onChange={handleupdateValues} sx={{
                        paddingLeft: 3,
                    }}/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Billing Address Line 3</Typography>
                    <TextField autoComplete='off' size="small" name="billingLine3" value={values.billingLine3} onChange={handleupdateValues} sx={{
                        paddingLeft: 3,
                    }}/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Loadout Operator's Name</Typography>
                    <TextField autoComplete='off' size="small" name="oprName" value={values.oprName} 
                        sx={{
                            paddingLeft: 3,
                        }}
                        inputProps={
                            { readOnly: true, }
                        }
                    />
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Number of Wagons</Typography>
                    <TextField autoComplete='off' size="small" name="noOfWagon" value={values.noOfWagon} 
                        sx={{
                            paddingLeft: 3,
                        }}
                        inputProps={
                            { readOnly: true, }
                        }
                    />
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Loco Number</Typography>
                    <TextField autoComplete='off' size="small" name="locoNumber" value={values.locoNumber} onChange={handleupdateValues} sx={{
                        paddingLeft: 3,
                    }}/>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Rake Placement</Typography>
                    <TextField disabled autoComplete='off' size="small" name="rakePlacement" value={values.rakePlacement} 
                        sx={{
                            paddingLeft: 3,
                        }}
                        inputProps={
                            { readOnly: true, }
                        }
                    />
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Typography variant='subtitle1' width={1/9} align={'right'}>Completion At</Typography>
                    <TextField disabled autoComplete='off' size="small" name="completionAt" value={values.completionAt} 
                        sx={{
                            paddingLeft: 3,
                        }}
                        inputProps={
                            { readOnly: true, }
                        }
                    />
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={1}>
                    <Button variant="contained" onClick={handleUpdate}>Update</Button>
                </Grid>
            </Grid>
        </Stack>
    )
}

export default UpdateRake;