// WithNav.js (Stand-alone Functional Component)
import React from 'react';
import { Stack, Typography, Divider } from "@mui/material";


const TableTotalValue = (props) => {
    // console.log("Inside Nav BAr");
    // console.log(props);
    let textvalue;
    if (props.data[0].row.isLast) {
        textvalue = <>
            <Typography variant="h6">{props.data[0].value}</Typography>
            <Divider sx={{ backgroundColor: '#000', width: 150,  opacity: 1}}/>
            <Typography variant={'h6'} fontWeight={800}>{props.data[1]}</Typography>
        </>
    } else {
        textvalue = <><Typography variant="h6">{props.data[0].value}</Typography></>
    }
    return (
        <Stack direction={'column'}>
            {textvalue}
        </Stack>
    );
}

export default TableTotalValue;