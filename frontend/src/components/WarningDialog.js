import { FormControlLabel, Radio, RadioGroup, Stack, Button, Typography, Divider  } from "@mui/material";
import React, {useRef} from "react";
import { DialogTitle, DialogContent, DialogActions, Dialog, DialogContentText , TextField} from '@mui/material';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function WarningDialog(props) {
    const { onClose, open, value, ...other } = props;

    const alxesEliminatedRef = useRef();
    // const [open, setOpen] = React.useState(false);
    let list;
    if (value.title === "Rearrange") {
        list = value.content.split(",");        
    }


    const handleClose = () => {
        onClose();
    };

    const handleReset = () => {
        onClose("Reset", 0);
    };
    
    const handleOk = () => {
        if (value.command === 'Initiate') {
            onClose(value.command, alxesEliminatedRef.current.value);
        } else {
            onClose(value.command,0);
        }
        
    };

    const handleSwap = () => {
        onClose("Swap", list[1] + "," + list[2])
    }

    const handleReorder1 = () => {
        onClose("Reorder1", list[1] + "," + list[2])
    }

    const handleReorder2 = () => {
        onClose("Reorder2", list[2] + "," + list[1])
    }

    let isdialogContent = true;
    let dialogContent;
    if (value.command === 'Initiate') {
        dialogContent = <><DialogContentText id="alert-dialog-slide-description">
            {value.content}
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="axlesToBeEliminated"
                label="Axles to be eliminated"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={0}
                inputRef={alxesEliminatedRef}
            />
        </>
    } else if (value.command === 'Version') {
        console.log(value.content[0]);
        let wg_ver = value.content[0];
        let cloud_ver = value.content[1];
        // dialogContent = "Hello";
        dialogContent = <Stack direction={'column'}>
            <Typography variant='h6'>Inmotion Scale Version : {value.content[0]}</Typography>
            <Typography variant='h6'>Release Date: {value.content[1]}</Typography>
            <Divider sx={{ backgroundColor: '#006A71', opacity: 1, height: 1}}/>
            <Typography variant='h6'>Scada Version : {value.content[2]}</Typography>
            <Typography variant='h6'>Release Date : {value.content[3]}</Typography>
            <Divider sx={{ backgroundColor: '#006A71', opacity: 1, height: 1}}/>
            <Typography variant='h6'>Cloud Version : {value.content[4]}</Typography>
            <Typography variant='h6'>Release Date : {value.content[5]}</Typography>
        </Stack>
    } else if (value.command === 'Rearrange') {
        
        const listContent = list[0] + " Postion No " + list[1] + " and " + list[2];
        dialogContent = <><DialogContentText id="alert-dialog-slide-description">
        {/* {value.content} */}
        {listContent}
        </DialogContentText></>
    } else {
        dialogContent = <><DialogContentText id="alert-dialog-slide-description">
        {value.content}
        </DialogContentText></>
    }
    let button;
    if (value.title === 'Error') {
      button = <Button onClick={handleClose}>Okay</Button>;
    } else if (value.title === 'Edit Save') {
        button = <><Button onClick={handleOk}>Yes</Button><Button onClick={handleClose}>No</Button><Button onClick={handleReset}>Reset</Button></>;
    } else if (value.title === 'Railwagon Weighing System') {
        button = <Button onClick={handleOk}>Okay</Button>;
    } else if (value.title === 'Rearrange') {
        // let list = value.content.split(",");
        button = <><Button onClick={handleSwap}>Swap</Button>
        <Button onClick={handleReorder1}>ReOrder {list[1]} to {list[2]}</Button>
        <Button onClick={handleReorder2}>ReOrder {list[2]} to {list[1]}</Button></>;
    } else {
      button = <><Button onClick={handleOk}>Yes</Button><Button onClick={handleClose}>No</Button></>;
    }
    return(
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{value.title}</DialogTitle>
            <DialogContent>
                
                {dialogContent}
            </DialogContent>
            <DialogActions>
                {button}
                {/* {value.title === 'Error'}
                ? <Button onClick={handleClose}>Okay</Button>
                :
                <>
                    <Button onClick={handleOk}>Yes</Button>
                    <Button onClick={handleClose}>No</Button>
                </> */}
                
            </DialogActions>
        </Dialog>
    )
}

export default WarningDialog;