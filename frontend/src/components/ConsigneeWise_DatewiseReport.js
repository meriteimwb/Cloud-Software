import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'
import TableTotalValue from "./TableTotalvalue.js";
import dayjs from 'dayjs';

const columns = [
    {
        field: 'id',
        headerName: 'Sl. No',
        width: 200,
        
        // flex: 1,
        sortable: false,
    },
    {
        field: 'consignee',
        headerName: 'Consignee',
        // width: 60,
        flex: 1,
        sortable: false,
        renderCell: (params) => (
            <><Typography variant="h6" fontWeight={800}>{params.value}</Typography></>
        )
    },
    {
        field: 'loadingDate',
        headerName: 'Loading Date',
        // width: 90,
        flex: 1,
        sortable: false,
    },
    {
        field: 'noOfWagons',
        headerName: 'No. Of Wagons',
        // width: 120,
        flex: 1,
        sortable: false,
        renderCell: (params) => (
            <TableTotalValue data={[params, params.row.totalWagons]} />
        )
    },
    {
        field: 'quantityLoaded',
        headerName: 'Quantity Loaded',
        // width: 70,
        flex: 1,
        sortable: false,
        renderCell: (params) => (
            <TableTotalValue data={[params, params.row.totalQuantity]} />
        )
    }
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
                    <Typography variant="h5">Consigneewise List of Rakes Weighed From {this.fromDate} Till {this.tillDate}</Typography>
                </Box>
                <Box width={1}>
                    <DataGrid
                        initialState={{
                            columns: {
                            columnVisibilityModel: {
                                // Hide columns status and traderName, the other columns will remain visible
                                id: false,
                                // traderName: false,
                            },
                            },
                        }}
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