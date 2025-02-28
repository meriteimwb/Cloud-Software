import React, { useEffect, useRef } from "react";
import DetailedWeighReport from '../components/DetailedWeighReport.js'
import ReactToPrint from "react-to-print";
import { Box, Button } from "@mui/material";

const PrintReport = () => {

    let componentRef = useRef();

    useEffect(() => {
        // localStorage.pagedata = "your Data";
        console.log(localStorage.getItem('RakeID'));
        console.log(localStorage.getItem('ReportType'));
        // set the data in state and use it through the component
        localStorage.removeItem("RakeID");
        localStorage.removeItem("ReportType");
        // removing the data from localStorage.  Since if user clicks for another invoice it overrides this data
    })

    return(
        <Box width={1} >
            <DetailedWeighReport ref={(el) => (componentRef = el)} />

            <ReactToPrint
                trigger={() => <Button variant="contained">Print</Button>}
                content={() => componentRef}
            />
        </Box>
    )
}

export default PrintReport;