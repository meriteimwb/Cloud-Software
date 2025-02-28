import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs';

const columns = [
    {
        field: 'id',
        headerName: 'Sl No',
        width: 60,
        headerAlign: 'center',
        // flex: 1,
        sortable: false,
        align: 'center',
    },
    {
        field: 'noOfAxles',
        headerName: 'Axles',
        width: 150,
        // flex: 1,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
    },
    {
        field: 'grossWt',
        headerName: 'Weight (In Tons)',
        width: 200,
        headerAlign: 'center',
        align: 'center',
        // flex: 1,
        sortable: false,
    },
    {
        field: 'weighingTime',
        headerName: 'Weighing Time',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        // flex: 1,
        sortable: false,
    },
    {
        field: 'speed',
        headerName: 'Speed Km/Hr',
        headerAlign: 'center',
        align: 'center',
        width: 150,
        // flex: 1,
        sortable: false,
    },
    {
        field: 'remarks',
        headerName: 'Remarks',
        headerAlign: 'center',
        align: 'center',
        width: 338,
        // flex: 1,
        sortable: false,
    },
];

class DetailedWeighReport extends React.Component {

    constructor(props){
        super(props);
        console.log(props.printData);
        this.rakeid = props.printData.rakeid
        this.rows=props.printData.row_list
        this.weight= props.printData.totalGrossWt
        this.tareWt= props.printData.totalTareWt
        this.rakeDetails = props.printData.rakeDetails
        this.netWt= props.printData.totalNetWt
        this.cc= props.printData.totalCC
        this.noOfWagons= props.printData.noOfWagons
        this.maxTrainSpeed= props.printData.maxTrainSpeed
        this.overLoad=props.printData.totalOverLoadWt
        this.underLoad=props.printData.totalUnderLoadWt
        this.wgidDetails = props.printData.wgidDetails
    }

    
    render(){
        // useEffect (() => {
        //     this.rows.push({'id': '', 'grossWt': this.weight})
        // }, []);
    
        return(
            <Stack direction={'column'} alignItems={'center'} maxWidth={1100}>
                <Typography variant="h5">{this.wgidDetails['heading1']}-{this.wgidDetails['heading2']}</Typography>
                <Typography variant="h5">{this.wgidDetails['heading3']}</Typography>
                <Typography variant="h5">WEIGHING REPORT</Typography>
                <Stack direction={'row'} width={1} justifyContent={'space-between'}>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Serial No: {this.rakeDetails['serialNo']}</Typography>
                        <Typography variant="subtitle1">Rake Number: {this.rakeid}</Typography>
                        <Typography variant="subtitle1">Rake In Time: {this.rows[0]['weighingTime']}</Typography>
                    </Stack>
                    <Stack direction={'column'}>
                        <Typography variant="subtitle1">Direction: {this.rakeDetails['direction']}</Typography>
                        <Typography variant="subtitle1">Rake Out Time: {this.rows[this.rows.length - 1]['weighingTime']}</Typography>
                    </Stack>
                </Stack>
                <Box width={1}>
                    <DataGrid
                        autoHeight 
                        rows={this.rows}
                        columns={columns}
                        getRowHeight={() => 'auto'}
                        sx={{
                            marginTop:2,
                        }}
                        disableColumnMenu
                        hideFooter
                    />
                </Box>
                <Stack  width={530}>
                    {/* Gross Weight is used */}
                    <Typography variant="subtitle1" fontWeight={800}>{this.weight}</Typography>
                </Stack>
                <Stack direction={'row'} width={1} justifyContent={'space-around'} marginTop={15}>
                    <Stack direction={'column'} alignItems={'center'}>
                        <Divider sx={{ backgroundColor: '#000', width: 300, opacity: 1}}/>
                        <Typography variant="h6">Signature of WB Operator</Typography>
                    </Stack>
                    <Divider sx={{ backgroundColor: '#000', width: 300, opacity: 1, height:1}}/>
                </Stack>
            </Stack>
        )   
    }
}

export default DetailedWeighReport;