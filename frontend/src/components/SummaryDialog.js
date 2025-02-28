import { Stack, Typography, TextField, RadioGroup, FormControlLabel, Radio, Autocomplete, DialogTitle, DialogActions, DialogContent, Dialog, Button } from '@mui/material';
import React from 'react';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SummaryDialog = (props) => {

    const { onClose, open, data, ...other } = props;
    const [fromDate, setfromDate] = React.useState(dayjs());
    const [tillDate, settillDate] = React.useState(dayjs());
    const [summaryReport, setSummaryReport] = React.useState("");
    const [consignee, setConsignee] = React.useState("");
    // const [consigneeList, setConsigneeList] = React.useState(data.label);
    const [hideConsignee, sethideConsignee] = React.useState(true)
    const [summaryOpen, setSummaryOpen] = React.useState(false);

    const handleClicksummaryReort = (e) => {
        setSummaryOpen(true)
    };

    const getsummaryReport = () => {
        onClose(consignee, fromDate, tillDate, summaryReport);
    }

    const handleFromDate = (newValue) => {
        setfromDate(newValue);
    };
    const handleConsignee = (event, newValue) => {
        console.log(newValue);
        setConsignee(newValue);
    };
    const handleTillDate = (newValue) => {
        settillDate(newValue);
    };

    const handleRadiogroup = (e, newValue) => {
        setSummaryReport(newValue);
        if (newValue === 'DCWR' | newValue === 'CWDWR') {
            sethideConsignee(false);
        } else {
            sethideConsignee(true);
        }
    };

    const handleClose = (newValue) => {
        onClose("Cancel");
    };

    // const Consignee =[
    //     {label: "ALL"},
    //     {label: "FGI"},
    // ]
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle>Summary Report</DialogTitle>
            <DialogContent>
                <Stack direction={'column'} width={{ sm: 250, md: 380, lg: 450}} spacing={1}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography >Report Required From </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DesktopDatePicker
                                views={['year', 'month', 'day']}
                                inputFormat="DD/MM/YYYY"
                                value={fromDate}
                                onChange={handleFromDate}
                                renderInput={(params) => <TextField variant='standard' {...params}  sx={{
                                    // svg: { color: '#fff' },
                                    // input: { color: '#fff', fontSize: '20px',},
                                    // input: { fontSize: '20px',},
                                    
                                }}/>}
                            />
                        </LocalizationProvider>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography >Report Required Till </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DesktopDatePicker
                                views={['year', 'month', 'day']}
                                inputFormat="DD/MM/YYYY"
                                value={tillDate}
                                onChange={handleTillDate}
                                renderInput={(params) => <TextField variant='standard' {...params}  sx={{
                                    // svg: { color: '#fff' },
                                    // input: { color: '#fff', fontSize: '20px',},
                                    // input: { fontSize: '20px',},
                                    
                                }}/>}
                            />
                        </LocalizationProvider>
                    </Stack>
                    <RadioGroup onChange={handleRadiogroup} >
                        <FormControlLabel value="DWDR" control={<Radio />} label="Datewise Detailed Report" />
                        <FormControlLabel value="DWSR" control={<Radio />} label="Datewise Summary Report" />
                        <FormControlLabel value="DCWR" control={<Radio />} label="Date & Consigneewise Report" />
                        <FormControlLabel value="CWDWR" control={<Radio />} label="Consigneewise & Datewise  Report" />
                    </RadioGroup>
                    <Stack direction={'row'} justifyContent={'space-evenly'} alignItems={'center'} sx={{ visibility: hideConsignee ? 'hidden': 'initial' }}>
                        <Typography>Select Consignee</Typography>
                        <Autocomplete
                            id="combo-box-demo"
                            options={data.label}
                            onChange={handleConsignee}
                            // isOptionEqualToValue={(option, value) => option.value === value.value}
                            sx={{ width: 200 }}
                            renderInput={(params) => <TextField {...params} label="Consignee" />}
                        />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={getsummaryReport}>Generate Report</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SummaryDialog;