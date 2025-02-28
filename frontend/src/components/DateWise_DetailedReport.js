import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'
import TableTotalValue from "./TableTotalvalue.js";
import dayjs from 'dayjs';


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
        const columns = [
            {
                field: 'id',
                headerName: 'Sl. No',
                width: 200,
                
                // flex: 1,
                sortable: false,
            },
            {
                field: 'weighingDate',
                headerName: 'Weighing Date',
                width: 200,
                // flex: 1,
                sortable: false,
                renderCell: (params) => (
                    <><Typography variant="h6" fontWeight={800}>{params.value}</Typography></>
                )
            },
            {
                field: 'time',
                headerName: 'Time',
                width: 150,
                // flex: 1,
                sortable: false,
                
                // renderCell: (params) => (
                //     <Test data={params.value} />
                //     // <Stack direction={'column'}>
                //     //     {
                //     //         params.value.forEach(element => {
                //     //             console.log(element);
                //     //             <Typography variant="body1">{element}</Typography>
                //     //         })
                //     //     }
                //     //     {/* <Typography>{params.value}</Typography> */}
                //     //     {/* {
                //     //         Array.isArray(params.value)
                //     //         ? 
                //     //         params.map((param) => {
                //     //             return (
                //     //                 <Typography>{param.value}</Typography>
                //     //             );
                //     //         })*
                //     //     : null} */}
                //     // </Stack>
                // )
            },
            {
                field: 'rakeNumber',
                headerName: 'Rake Number',
                width: 200,
                // flex: 1,
                sortable: false,
            },
            {
                field: 'consignee',
                headerName: 'Consignee',
                width: 195,
                // flex: 1,
                sortable: false,
            },
            {
                field: 'noOfWagons',
                headerName: 'No. Of Wagons',
                width: 150,
                // flex: 1,
                sortable: false,
                renderCell: (params) => (
                    <TableTotalValue data={[params, params.row.totalWagons]} />
                )
            },
            {
                field: 'quantityLoaded',
                headerName: 'Quantity Loaded',
                width: 200,
                // flex: 1,
                sortable: false,
                renderCell: (params) => (
                    <TableTotalValue data={[params, params.row.totalQuantity]} />
                )
            },
        ];
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
                    <Typography variant="h5">List of All Rakes Weighed From {this.fromDate} Till {this.tillDate}</Typography>
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
                <Stack direction={"row"} width={450}>
                    <Typography variant="h5" fontWeight={800} width={100}>Total</Typography>
                    <Typography variant="h5" fontWeight={800} width={150}>{this.reportTotalWagon}</Typography>
                    <Typography variant="h5" fontWeight={800} width={200}>{this.reportTotalQuantity}</Typography>
                </Stack>
            </Stack>
        )   
    }
}

export default DetailedWeighReport;