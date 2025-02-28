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
        width: 150,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'wagonNo',
        headerName: 'Wagon Number',
        width: 150,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'noOfAxles',
        headerName: 'Axles',
        width: 100,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'tareWt',
        headerName: 'Tare Wt.',
        width: 120,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'grossWt',
        headerName: 'Gross Wt.',
        width: 120,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'netWt',
        headerName: 'Net Wt.',
        width: 120,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'speed',
        headerName: 'Speed Km/Hr',
        width: 120,
        // flex: 1,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'remarks',
        headerName: 'Remarks',
        width: 150,
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
        this.rows=props.printData.row_list
        this.rakeDetails = props.printData.rakeDetails
        this.grossWt= props.printData.totalGrossWt
        this.tareWt= props.printData.totalTareWt
        this.netWt= props.printData.totalNetWt
        this.cc= props.printData.totalCC
        this.noOfWagons= props.printData.noOfWagons
        this.maxTrainSpeed= props.printData.maxTrainSpeed
        this.overLoad=props.printData.totalOverLoadWt
        this.underLoad=props.printData.totalUnderLoadWt
        this.wgidDetails = props.printData.wgidDetails
    }

    render(){
        // this.rows.push({'id': '', 'wagonNo': 'Total', 'tareWt': this.tareWt, 'grossWt': this.grossWt, 'netWt': this.netWt})
        console.log(this.rows);
        return(
            <Stack direction={'column'} alignItems={'center'} maxWidth={1100}>
                <Typography variant="subtitle1">{this.wgidDetails['heading1']}-{this.wgidDetails['heading2']}</Typography>
                {/* <Typography variant="h5">{this.wgidDetails['heading3']}</Typography> */}
                <Typography variant="subtitle1">WEIGHING REPORT</Typography>
                <Stack direction={'row'} width={1} justifyContent={'space-evenly'}>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Serial No: {this.rakeDetails['serialNo']}</Typography>
                        <Typography variant="subtitle1">Rake Number: {this.rakeid}</Typography>
                        <Typography variant="subtitle1">Source: {this.rakeDetails['fromStation']}</Typography>
                    </Stack>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Product: {this.rakeDetails['commodity']}</Typography>
                        <Typography variant="subtitle1">Direction: {this.rakeDetails['direction']}</Typography>
                        <Typography variant="subtitle1">Destination: {this.rakeDetails['toStation']}</Typography>
                    </Stack>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Rake In Time: {this.rows[0]['weighingTime']}</Typography>
                        <Typography variant="subtitle1">Rake Out Time: {this.rows[this.rows.length - 1]['weighingTime']}</Typography>
                        <Typography variant="subtitle1">Conginee : {this.rakeDetails['cnsg']}</Typography>
                    </Stack>
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
                <Stack direction={"row"} width={1}>
                    <Typography variant="subtitle1" marginLeft={40}>Total</Typography>
                    <Typography variant="subtitle1" fontWeight={800} marginLeft={17}>{this.tareWt}</Typography>
                    <Typography variant="subtitle1" fontWeight={800} marginLeft={8}>{this.grossWt}</Typography>
                    <Typography variant="subtitle1" fontWeight={800} marginLeft={7}>{this.netWt}</Typography>
                    <Typography variant="subtitle1" fontWeight={800} marginLeft={8}>(All Weights are in Tons)</Typography>
                </Stack>
                <Stack direction={'row'} width={1} justifyContent={'space-around'} marginTop={5}>
                    <Stack direction={'column'} alignItems={'center'}>
                        <Divider sx={{ backgroundColor: '#000', width: 300, opacity: 1}}/>
                        <Typography variant="subtitle1">Signature of WB Operator</Typography>
                    </Stack>
                    <Divider sx={{ backgroundColor: '#000', width: 300, opacity: 1, height:1}}/>
                </Stack>
            </Stack>
        )   
    }
}

export default DetailedWeighReport;