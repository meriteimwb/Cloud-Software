import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs';

const columns = [
    {
        field: 'id',
        headerName: 'Loading Date',
        // width: 275,
        flex: 1,
        sortable: false,
    },
    {
        field: 'rakes',
        headerName: 'No. of Rakes',
        // width: 273,
        flex: 1,
        sortable: false,
    },
    {
        field: 'wagons',
        headerName: 'No. Of Wagons',
        // width: 275,
        flex: 1,
        sortable: false,
    },
    {
        field: 'quantityLoaded',
        headerName: 'Quantity Loaded',
        // width: 275,
        flex: 1,
        sortable: false,
    },
];

class DetailedWeighReport extends React.Component {

    constructor(props){
        super(props);
        console.log(props.printData);
        this.rakeid = props.printData.rakeid
        this.rows=props.printData.row_list
        this.reportTotalWagon = props.printData.reportTotalWagon
        this.reportTotalQuantity = props.printData.reportTotalQuantity
        this.fromDate = props.printData.fromDate
        this.tillDate = props.printData.tillDate
        this.wgidDetails = props.printData.wgidDetails
    }

    render(){
        return(
            <Stack direction={'column'} alignItems={'end'} width={1100}>
                <Stack direction={'row'} width={1} justifyContent={'space-between'}>
                    <Stack direction={'column'}>
                        <Typography variant="h5">Date of Report:{dayjs().format('DD/MM/YYYY')}</Typography>
                    </Stack>
                    <Stack direction={'column'} alignItems={"center"}>
                        <Typography variant="h5">{this.wgidDetails['heading1']}</Typography>
                        <Typography variant="h5">{this.wgidDetails['heading2']}</Typography>
                        <Typography variant="h5">{this.wgidDetails['heading3']}</Typography>
                    </Stack>
                    <Stack direction={'column'}>
                        <Typography variant="h5">Time of Report:{dayjs().format('HH:mm:ss')}</Typography>
                    </Stack>
                </Stack>
                <Box width={1100}>
                    <Typography variant="h5">Datewise Summary of Rakes Weighed From {this.fromDate} Till {this.tillDate}</Typography>
                </Box>
                <Box width={1}>
                    <DataGrid
                        autoHeight 
                        rows={this.rows}
                        columns={columns}
                        getRowHeight={() => 'auto'} 
                        sx={{
                            '&>.MuiDataGrid-main': {
                                // '&>.MuiDataGrid-columnHeaders': {
                                //   borderBottom: 'none',
                                // },
                              
                                '& div div div div >.MuiDataGrid-cell': {
                                  borderBottom: 'none',
                                },
                            },
                            marginTop:1,
                        }}
                        disableColumnMenu
                        hideFooter
                    />
                </Box>
                <Stack direction={"row"} width={650}>
                    <Typography variant="h5" fontWeight={800} width={100}>Total</Typography>
                    <Typography variant="h5" fontWeight={800} width={260}>{this.reportTotalWagon}</Typography>
                    <Typography variant="h5" fontWeight={800} width={200}>{this.reportTotalQuantity}</Typography>
                </Stack>
            </Stack>
        )   
    }
}

export default DetailedWeighReport;