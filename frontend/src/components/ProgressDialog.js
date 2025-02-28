import { CircularProgress } from "@mui/material";
import React from "react";
import { DialogTitle, DialogContent, DialogActions, Dialog, DialogContentText } from '@mui/material';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



function ProgressDialog(props) {
    const { onClose, open, ...other } = props;
    // const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        onClose();
    };
    
    // const handleOk = () => {
    //     onClose(value);
    // };
    return(
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Downloading from Fois"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description" alignItems={'center'}>
                    <CircularProgress />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default ProgressDialog;