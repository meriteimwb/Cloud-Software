import { FormControlLabel, Radio, RadioGroup, Stack, Button  } from "@mui/material";
import React from "react";
import { DialogTitle, DialogContent, DialogActions, Dialog } from '@mui/material';

function ReportDialog(props) {
    console.log("Inside Report Dialog");

    const { onClose, value: valueProp, open, ...other } = props;
    const [value, setValue] = React.useState(valueProp);
    const radioGroupRef = React.useRef(null);

    const handleCancel = () => {
        onClose();
    };
    
    const handleOk = () => {
        onClose(value);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
        >
            <DialogTitle>Report Type</DialogTitle>
            <DialogContent>
                <RadioGroup 
                    row
                    ref={radioGroupRef}
                    onChange={handleChange}
                    value={value}
                    >
                    <FormControlLabel value={"datewiseReport"} control={<Radio />} label="Datewise Detailed Report" />
                    <FormControlLabel value={"datewiseSummaryReport"} control={<Radio />} label="Datewise Summary Report" />
                    <FormControlLabel value={"dateConsigReport"} control={<Radio />} label="Date & Consigneewise Report" />
                    <FormControlLabel value={"consigDatewiseReport"} control={<Radio />} label="Consigneewise & Datewise Report" />
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>GENERATE REPORT</Button>
            </DialogActions>
        </Dialog>
    );
  }
  
export default ReportDialog;