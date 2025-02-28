import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs';

const columns = [
    {
        field: 'id',
        headerName: 'Sl No',
        width: 60,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'wagonType',
        headerName: 'W.Type',
        // width: 90,
        flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'wagonNo',
        headerName: 'Wagon Number',
        // width: 120,
        flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'noOfAxles',
        headerName: 'Axles',
        width: 70,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'carryingCapacity',
        headerName: 'CC',
        width: 80,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'pcarryingCapacity',
        headerName: 'P.CC',
        width: 80,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'grossWt',
        headerName: 'Gross',
        width: 80,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'tareWt',
        headerName: 'Tare',
        width: 80,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'netWt',
        headerName: 'Net',
        width: 80,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'overLoad',
        headerName: 'O.Load',
        width: 80,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'underLoad',
        headerName: 'U.Load',
        width: 80,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'remarks',
        headerName: 'Remarks',
        width: 88,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
];

class DetailedWeighReport extends React.Component {

    constructor(props){
        super(props);
        console.log(props.printData);
        this.rakeid = props.printData.rakeid
        this.rows = props.printData.row_list
        this.rakeDetails = props.printData.rakeDetails
        this.grossWt = props.printData.totalGrossWt
        this.tareWt = props.printData.totalTareWt
        this.netWt = props.printData.totalNetWt
        this.cc = props.printData.totalCC
        this.noOfWagons = props.printData.noOfWagons
        this.maxTrainSpeed = props.printData.maxTrainSpeed
        this.overLoad = props.printData.totalOverLoadWt
        this.underLoad = props.printData.totalUnderLoadWt
        this.wgidDetails = props.printData.wgidDetails
    }

    render(){
        return(
            <Stack direction={'column'} alignItems={'center'} maxWidth={1100}>
                <Typography variant="h5">{this.wgidDetails['heading1']}-{this.wgidDetails['heading2']}</Typography>
                {/* <Typography variant="h5">{this.wgidDetails['heading3']}</Typography> */}
                <Typography variant="h5">WEIGHING REPORT</Typography>
                <Stack direction={'row'} width={1} justifyContent={'space-evenly'}>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Serial No: {this.rakeDetails['serialNo']}</Typography>
                        <Typography variant="subtitle1">Rake Number: {this.rakeid}</Typography>
                        <Typography variant="subtitle1">Product: {this.rakeDetails['commodity']}</Typography>
                    </Stack>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Source: {this.rakeDetails['fromStation']}</Typography>
                        <Typography variant="subtitle1">Destination: {this.rakeDetails['toStation']}</Typography>
                        <Typography variant="subtitle1">Direction: {this.rakeDetails['direction']}</Typography>
                    </Stack>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Rake In Time: {this.rows[0]['weighingTime']}</Typography>
                        <Typography variant="subtitle1">Rake Out Time: {this.rows[this.rows.length - 1]['weighingTime']}</Typography>
                        <Typography variant="subtitle1">Conginee : {this.rakeDetails['cnsg']}</Typography>
                    </Stack>
                    <Typography variant="subtitle1">Print Date & Time : {dayjs().format('DD/MM/YYYY HH:mm')}</Typography>
                </Stack>
                <Box width={1}>
                    <DataGrid
                        autoHeight 
                        rows={this.rows}
                        columns={columns}
                        getRowHeight={() => 'auto'}
                        sx={{
                            marginTop:1,
                        }}
                        disableColumnMenu
                        hideFooter
                    />
                </Box>
                <Typography variant="h6" width={1}>Summary of Total Weights</Typography>
                <Stack direction={'row'} width={1} justifyContent={'space-between'}>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Gross Weight :{this.grossWt}</Typography>
                        <Typography variant="subtitle1">Tare Weight :{this.tareWt}</Typography>
                        <Typography variant="subtitle1">Net Weight :{this.netWt}</Typography>
                        <Typography variant="subtitle1">C.Capacity :{this.cc}</Typography>
                    </Stack>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">No. of Wagons :{this.noOfWagons}</Typography>
                        <Typography variant="subtitle1">Maximum Train Speed :{this.maxTrainSpeed}</Typography>
                    </Stack>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Over Load Wt.:{this.overLoad}</Typography>
                        <Typography variant="subtitle1">Under Load Wt.:{this.underLoad}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={'row'} width={1} justifyContent={'space-around'} marginTop={15}>
                    <Stack direction={'column'} alignItems={'center'}>
                        <Divider sx={{ backgroundColor: '#000', width: 300, opacity: 1}}/>
                        <Typography variant="h6">Signature of WB Operator</Typography>
                    </Stack>
                    <Divider sx={{ backgroundColor: '#000', width: 300, opacity: 1, height:1}}/>
                    <Divider sx={{ backgroundColor: '#000', width: 300, opacity: 1, height:1}}/>
                </Stack>
            </Stack>
        )   
    }
}

export default DetailedWeighReport;