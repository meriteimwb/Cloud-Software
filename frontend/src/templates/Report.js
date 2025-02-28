import React, { useEffect, useState, useRef } from 'react';
import { Stack, Typography, Divider, Button, Box, Dialog, Toolbar, AppBar, IconButton, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios'
import { toast } from 'react-toastify';
import ReportDialog from '../components/ReportDialog';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import DetailedWeighReport from '../components/DetailedWeighReport.js'
import WeighingOnlyReport from '../components/WeighingOnlyReport.js'
import WeighingReport from '../components/WeighingReport.js'
import DateWise_DetailedReport from '../components/DateWise_DetailedReport'
import DateWise_SummaryReport from '../components/DateWise_SummaryReport'
import Date_ConsigneeWiseReport from '../components/Date_ConsigneeWiseReport'
import ConsigneeWise_DatewiseReport from '../components/ConsigneeWise_DatewiseReport'
import SummaryDialog from '../components/SummaryDialog.js'
import ReactToPrint from "react-to-print";

const columns = [
    {
        field: 'id',
        headerName: 'Rake Number',
        flex: 1,
        sortable: false,
    },
    {
        field: 'weigmentTime',
        headerName: 'Date & Time of Weighing',
        flex: 1,
        sortable: false,
    },
    {
        field: 'wagonCount',
        headerName: 'No of Wagons',
        flex: 1,
        sortable: false,
    },
    {
        field: 'commodity',
        headerName: 'Commodity',
        flex: 1,
        sortable: false,
    },
    {
        field: 'netWt',
        headerName: 'Total Net Weight',
        flex: 1,
        sortable: false,
    },
    {
        field: 'foisStatus',
        headerName: 'FOIS Status',
        flex: 1,
        sortable: false,
    },
];

ReportDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const Report = () => {

    const {state} = useLocation();
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedPrint, setSelectedPrint] = useState({})
    const [datewiseDetailedReport, setdatewiseDetailedReport] = useState({})
    const [summaryOpen, setSummaryOpen] = React.useState(false);
    const [consigneeList, setconsigneeList] = React.useState({
        'label': [],
    });
    // const url = "http://localhost:8000";
    const url = "";

    const [open, setOpen] = React.useState(false);
    
    const [value, setValue] = React.useState('Dione');

    let componentRef = useRef();

    //This useeffect will trigger when Report page renders
    useEffect (() => {
        const getReportDetails = () => {
            axios.get(url + '/rakes/report/', {
                params: { wgid: state.wgid },
            })
            .then(function (response) {
                console.log(response.data);
                if (response.data === 'Fail') {
                    toast.error("Try Again", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    let row_list = [];
                    response.data.data.forEach(rakedetails => {
                        let row_value = {};
                        row_value['id'] = rakedetails['rakeID'];
                        row_value['weigmentTime'] = dayjs(rakedetails['weightmentTime']).format("YYYY-MM-DD HH:mm:ss");
                        row_value['netWt'] = rakedetails['totalNetWt'].toFixed(2);
                        if (rakedetails['commodity'] === null || rakedetails['commodity'] === "") {
                            row_value['commodity'] = response.data.commodity;
                        } else {
                            row_value['commodity'] = rakedetails['commodity'];
                        }
                        row_value['wagonCount'] = rakedetails['wagonCount'];
                        if (rakedetails['isUploaded']) {
                            row_value['foisStatus'] = "Uploaded to FOIS";
                        } else {
                            row_value['foisStatus'] = "Upload Pending";
                        }
                        console.log(row_value);
                        row_list.push(row_value);
                    });
                    setRows(row_list);
                    console.log(response.data.cnsg);
                    setconsigneeList({'label' : response.data.cnsg})
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        // calling getReportDetails function to get RakeDetails report from server
        getReportDetails();
    }, []);

    //This function is ued to upload rake details to FOIS
    const handleUpload = () => {
        console.log(selectedRows);
        const rakes = [];
        selectedRows.forEach(rake => {
            rakes.push(rake['id'])
        });
        selectedRows.forEach(rake => {
            // rakes.push(rake['id'])
            axios.post(url + '/rakes/report/', {
                username: state.username,
                password: state.password,
                wgid: state.wgid,
                rake: rake['id'],
            })
            .then(function (response) {
                console.log(response.data);
                if (response.data === 'S') {
                    toast.success("Uploaded to FOIS Successfully", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    
                    var rowIndex = rows.findIndex(obj => obj.id === rake['id']);
                    setRows((prevRows) => {
                        const rowToUpdateIndex = rowIndex;
                        return prevRows.map((row, index) =>
                            index === rowToUpdateIndex ? { ...row, 
                                foisStatus: "Uploaded Successfully"
                            } : row,
                        );
                    });
                    // rakes.forEach(rake => {
                        
                    // })
                } else {
                    toast.error(response.data, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Try Again", {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
        })
    };

    const handleClicksummaryReort = (e) => {
        setSummaryOpen(true)
    };

    const handleSummaryClose = (consignee, fromDate, tillDate, summaryReport) => {
        if (consignee !== "Cancel") {
            const formattedFromDate = dayjs(fromDate).format('YYYY-MM-DD');
            const formattedTillDate = dayjs(tillDate).format('YYYY-MM-DD');
            console.log(formattedFromDate + " 00:00:00");
            console.log(formattedTillDate + " 00:00:00");
            console.log(summaryReport);
            console.log(consignee);
            axios.get(url + '/print/summaryreport/', {
                params: { 
                    wgid: state.wgid,
                    fromDate: formattedFromDate + " 00:00:00",
                    tillDate: formattedTillDate + " 23:59:59",
                    reportType: summaryReport,
                    consignee: consignee,
                },
            })
            .then(function (response) {
                console.log(response.data);
                if (response.data === 'Fail') {
                    toast.error("Try Again", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    let rakeDetails = response.data['Rake'];
                    console.log(rakeDetails);
                    let wgidDetails = response.data['WGID'][0];
                    console.log(wgidDetails);
                    let row_list = [];
                    let totalWagons = 0;
                    let totalrakes = 0;
                    let totalQuantity = 0;
                    let prevRakeDate = "";
                    let prevConsignee = "";
                    let firstvalue =[];
                    let reportTotalWagon = 0;
                    let reportTotalQuantity = 0;
                    let quantityLoaded =[];
                    let count = 1;
                    if (summaryReport === "DWDR") {
                        // response = JSON.parse(response);
                        rakeDetails.forEach(rakedetails => {
                            let row_value = {};
                            let datetime = dayjs(rakedetails['weightmentTime']);
                            let rakeDate = dayjs(datetime).format('DD/MM/YYYY');
                            row_value['id'] = count;
                            console.log(rakeDate + ', ' + prevRakeDate);
                            if (rakeDate === prevRakeDate) {
                                console.log("Inside Prev Date");
                                row_value['weighingDate'] = "";
                                totalWagons = totalWagons + rakedetails['wagonCount'];
                                totalQuantity = totalQuantity + rakedetails['totalNetWt'];
                            } else {
                                console.log("Inside New Date");
                                row_value['weighingDate'] = rakeDate;
                                firstvalue.push(count - 1)
                                prevRakeDate = rakeDate;
                                totalWagons = rakedetails['wagonCount'];
                                totalQuantity = rakedetails['totalNetWt'];
                            }
                            // row_value['weighingDate'] = rakeDate;
                            row_value['time'] = dayjs(datetime).format('HH:mm');
                            row_value['rakeNumber'] = rakedetails['rakeID'];
                            row_value['consignee'] = rakedetails['cnsg'];
                            row_value['noOfWagons'] = rakedetails['wagonCount'];
                            row_value['quantityLoaded'] = rakedetails['totalNetWt'].toFixed(3);
                            row_value['totalWagons'] = totalWagons;
                            row_value['totalQuantity'] = totalQuantity.toFixed(3);
                            row_value['isLast'] = false;
                            
                            // console.log(row_value);
                            row_list.push(row_value);
                            count = count + 1;

                            reportTotalWagon = reportTotalWagon + rakedetails['wagonCount'];
                            reportTotalQuantity = reportTotalQuantity + rakedetails['totalNetWt'];
                        });
                        // console.log(firstvalue);
                        firstvalue.push(count - 1)
                        for (let index = 0; index < firstvalue.length; index++) {
                            if (firstvalue[index] !== 0) {
                                row_list[firstvalue[index] - 1]['isLast'] = true;
                            }
                        }
                        console.log(row_list);
                        setSelectedPrint({
                            row_list: row_list,
                            selectedButton: "DWDR",
                            reportTotalWagon: reportTotalWagon,
                            reportTotalQuantity: reportTotalQuantity.toFixed(3),
                            fromDate: formattedFromDate,
                            tillDate: formattedTillDate,
                            wgidDetails: wgidDetails,
                        })
                    } else if (summaryReport === "DWSR") {
                        let row_value = {};
                        let isLast = false;
                        let rakeDate;
                        rakeDetails.forEach(rakedetails => {
                            // console.log(rakedetails);
                            let datetime = dayjs(rakedetails['weightmentTime']);
                            rakeDate = dayjs(datetime).format('DD/MM/YYYY');
                            if (rakeDate === prevRakeDate) {
                                console.log("Inside Prev Date");
                                // row_value['id'] = "";
                                totalWagons = totalWagons + rakedetails['wagonCount'];
                                totalrakes = totalrakes + 1;
                                totalQuantity = totalQuantity + rakedetails['totalNetWt'];
                                isLast = true
                            } else {
                                console.log("Inside New Date");
                                if (isLast) {
                                    // console.log("Inside Last");
                                    row_value['rakes'] = totalrakes;
                                    row_value['wagons'] = totalWagons;
                                    row_value['quantityLoaded'] = totalQuantity.toFixed(3);
                                    // console.log(row_value);
                                    row_list.push(row_value);
                                    row_value = {};
                                }
                                row_value['id'] = rakeDate;
                                // row_value['weighingDate'] = rakeDate;
                                prevRakeDate = rakeDate;
                                totalrakes = 1
                                totalWagons = rakedetails['wagonCount'];
                                totalQuantity = rakedetails['totalNetWt'];
                                isLast = true;
                            }
                            reportTotalWagon = reportTotalWagon + rakedetails['wagonCount'];
                            reportTotalQuantity = reportTotalQuantity + rakedetails['totalNetWt'];
                        });
                        if (isLast) {
                            // console.log("Inside Last");
                            row_value['rakes'] = totalrakes;
                            row_value['wagons'] = totalWagons;
                            row_value['quantityLoaded'] = totalQuantity.toFixed(3);
                            // console.log(row_value);
                            row_list.push(row_value);
                            row_value = {};
                        }
                        console.log(row_list);
                        setSelectedPrint({
                            row_list: row_list,
                            selectedButton: "DWSR",
                            reportTotalWagon: reportTotalWagon,
                            reportTotalQuantity: reportTotalQuantity.toFixed(3),
                            fromDate: formattedFromDate,
                            tillDate: formattedTillDate,
                            wgidDetails: wgidDetails,
                        })
                    } else if (summaryReport === "DCWR") {
                        rakeDetails.forEach(rakedetails => {
                            let row_value = {};
                            let datetime = dayjs(rakedetails['weightmentTime']);
                            let rakeDate = dayjs(datetime).format('DD/MM/YYYY');
                            row_value['id'] = count;
                            if (rakeDate === prevRakeDate) {
                                console.log("Inside Prev Date");
                                row_value['loadingDate'] = "";
                                totalWagons = totalWagons + rakedetails['wagonCount'];
                                totalQuantity = totalQuantity + rakedetails['totalNetWt'];
                            } else {
                                console.log("Inside New Date");
                                row_value['loadingDate'] = rakeDate;
                                firstvalue.push(count - 1)
                                prevRakeDate = rakeDate;
                                totalWagons = rakedetails['wagonCount'];
                                totalQuantity = rakedetails['totalNetWt'];
                            }
                            row_value['consignee'] = rakedetails['cnsg'];
                            row_value['noOfWagons'] = rakedetails['wagonCount'];
                            row_value['quantityLoaded'] = rakedetails['totalNetWt'].toFixed(3);
                            row_value['totalWagons'] = totalWagons;
                            row_value['totalQuantity'] = totalQuantity.toFixed(3);
                            row_value['isLast'] = false;
                            
                            // console.log(row_value);
                            row_list.push(row_value);
                            count = count + 1;

                            reportTotalWagon = reportTotalWagon + rakedetails['wagonCount'];
                            reportTotalQuantity = reportTotalQuantity + rakedetails['totalNetWt'];
                        });
                        // console.log(firstvalue);
                        firstvalue.push(count - 1)
                        for (let index = 0; index < firstvalue.length; index++) {
                            if (firstvalue[index] !== 0) {
                                row_list[firstvalue[index] - 1]['isLast'] = true;
                            }
                        }
                        console.log(row_list);
                        setSelectedPrint({
                            row_list: row_list,
                            selectedButton: "DCWR",
                            reportTotalWagon: reportTotalWagon,
                            reportTotalQuantity: reportTotalQuantity.toFixed(3),
                            fromDate: formattedFromDate,
                            tillDate: formattedTillDate,
                            wgidDetails: wgidDetails,
                        });
                    } else if (summaryReport === "CWDWR") {
                        rakeDetails.forEach(rakedetails => {
                            let row_value = {};
                            let datetime = dayjs(rakedetails['weightmentTime']);
                            let rakeDate = dayjs(datetime).format('DD/MM/YYYY');
                            let rakeConsignee = rakedetails['cnsg'];
                            row_value['id'] = count;
                            if (rakeConsignee === prevConsignee) {
                                console.log("Inside Prev Date");
                                row_value['consignee'] = "";
                                totalWagons = totalWagons + rakedetails['wagonCount'];
                                totalQuantity = totalQuantity + rakedetails['totalNetWt'];
                            } else {
                                console.log("Inside New Date");
                                row_value['consignee'] = rakeConsignee;
                                firstvalue.push(count - 1)
                                prevConsignee = rakeConsignee;
                                totalWagons = rakedetails['wagonCount'];
                                totalQuantity = rakedetails['totalNetWt'];
                            }
                            row_value['loadingDate'] = rakeDate;
                            row_value['noOfWagons'] = rakedetails['wagonCount'];
                            row_value['quantityLoaded'] = rakedetails['totalNetWt'].toFixed(3);
                            row_value['totalWagons'] = totalWagons;
                            row_value['totalQuantity'] = totalQuantity.toFixed(3);
                            row_value['isLast'] = false;
                            
                            // console.log(row_value);
                            row_list.push(row_value);
                            count = count + 1;

                            reportTotalWagon = reportTotalWagon + rakedetails['wagonCount'];
                            reportTotalQuantity = reportTotalQuantity + rakedetails['totalNetWt'];
                        });
                        // console.log(firstvalue);
                        firstvalue.push(count - 1)
                        for (let index = 0; index < firstvalue.length; index++) {
                            if (firstvalue[index] !== 0) {
                                row_list[firstvalue[index] - 1]['isLast'] = true;
                            }
                        }
                        console.log(row_list);
                        setSelectedPrint({
                            row_list: row_list,
                            selectedButton: "CWDWR",
                            reportTotalWagon: reportTotalWagon,
                            reportTotalQuantity: reportTotalQuantity.toFixed(3),
                            fromDate: formattedFromDate,
                            tillDate: formattedTillDate,
                            wgidDetails: wgidDetails,
                        });
                    }
                }
                
            })
        }
        setSummaryOpen(false);
    };

    // This function is used to open the DialogReport Component
    const handleClickListItem = (e) => {

        let { name, value } = e.target;
        let rakeid = selectedRows[0]['id'];
        let totalGrossWt = 0.00;
        let totalTareWt = 0.00;
        let totalNetWt = 0.00;
        let totalCC = 0.00;
        let maxTrainSpeed = 0.00;
        let totalOverLoadWt = 0.00;
        let totalUnderLoadWt = 0.00;
        let selectedButton = e.target.id;
        console.log(selectedButton)
        axios.get(url + '/print/report/', {
            params: { 
                wgid: state.wgid,
                rake: rakeid,
            },
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data === 'Fail') {
                toast.error("Try Again", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                let row_list = [];
                let rakeDetails = response.data['Rake'];
                console.log(rakeDetails);
                let wagonDetails = response.data['Wagon'];
                console.log(wagonDetails);
                let wgidDetails = response.data['WGID'];
                console.log(wgidDetails);
                if (rakeDetails[0]['commodity'] === "" || rakeDetails[0]['commodity'] === null) {
                    // console.log(wgidDetails['commodity']);
                    rakeDetails[0]['commodity'] = wgidDetails[0]['commodity'];
                    console.log(rakeDetails);
                }
                wagonDetails.forEach(wagondetails => {
                    let row_value = {};
                    let wagonTime = dayjs(wagondetails['WagonWeighingTime'], 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm');
                    row_value['id'] = wagondetails['wgseqNo'];
                    row_value['weighingTime'] = wagonTime;
                    row_value['wagonType'] = wagondetails['wgType'];
                    row_value['wagonNo'] = wagondetails['wgOwnRail'] + wagondetails['wgNumb'];
                    row_value['tareWt'] = wagondetails['wgTareWt'].toFixed(2);
                    row_value['carryingCapacity'] = wagondetails['cc'].toFixed(2);
                    row_value['pcarryingCapacity'] = wagondetails['pcc'].toFixed(2);
                    row_value['noOfAxles'] = wagondetails['noOfAxles'];
                    row_value['grossWt'] = wagondetails['grossWt'].toFixed(2);
                    row_value['netWt'] = wagondetails['netWt'].toFixed(2);
                    let overload = wagondetails['netWt'] - row_value['carryingCapacity'];
                    let underload = row_value['carryingCapacity'] - wagondetails['netWt'];
                    if (overload > 0 ) {
                        overload = overload.toFixed(2);
                        underload = 0.0.toFixed(2);
                        row_value['overLoad'] = overload;
                        row_value['underLoad'] = underload;
                    } else {
                        overload = 0.0.toFixed(2);
                        underload = underload.toFixed(2);
                        row_value['overLoad'] = overload;
                        row_value['underLoad'] = underload;
                    }
                    let remarks = "";
                    if (wagondetails['speed'] > 15) {
                        remarks = "OS"
                    } 
                    // else {
                    //     if (overload > 0.0) {
                    //         remarks = "OL"
                    //     }
                    // }
                    if (name === 'WOR') {
                        row_value['remarks'] = remarks;
                        row_value['speed'] = wagondetails['speed'];
                    } else if (name === 'WR') {
                        row_value['remarks'] = remarks;
                        row_value['speed'] = wagondetails['speed'];
                    } else if (name === 'DWR') {
                        row_value['remarks'] = wagondetails['speed'];
                        row_value['speed'] = wagondetails['speed'];
                    }
                    // console.log(row_value);
                    row_list.push(row_value);
                    totalOverLoadWt = totalOverLoadWt + parseFloat(overload);
                    totalUnderLoadWt = totalUnderLoadWt + parseFloat(underload);
                    totalGrossWt = totalGrossWt + wagondetails['grossWt'];
                    totalTareWt = totalTareWt + wagondetails['wgTareWt'];
                    totalNetWt = totalNetWt + wagondetails['netWt'];
                    totalCC = totalCC + wagondetails['cc'];
                });
                setSelectedPrint({
                    totalOverLoadWt: totalOverLoadWt.toFixed(2),
                    totalUnderLoadWt: totalUnderLoadWt.toFixed(2),
                    totalGrossWt: totalGrossWt.toFixed(2),
                    totalTareWt: totalTareWt.toFixed(2),
                    totalNetWt: totalNetWt.toFixed(2),
                    totalCC: totalCC,
                    maxTrainSpeed: 0.00,
                    noOfWagons : row_list.length,
                    row_list: row_list,
                    rakeDetails: rakeDetails[0],
                    wgidDetails: wgidDetails[0],
                    rakeid: rakeid,
                    selectedButton: selectedButton
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        
    };

    useEffect(() => {
        if (Object.keys(selectedPrint).length !== 0) {
            setOpen(true);
        }
    }, [selectedPrint])
    
    // This function is used to get value when DialogReport component selected a radio button for printing
    const handleClose = (newValue) => {
        if (open) {
            setOpen(false);
        }
        if (summaryOpen) {
            setSummaryOpen(false)
        }
        
        // if (value !== newValue) {
        //     setValue(newValue);
        // }
        // console.log(newValue);
        // console.log(selectedRows[0]['id']);
        // localStorage.setItem("RakeID", selectedRows[0]['id'])
        // localStorage.setItem("ReportType", newValue)
        // window.open("/print/report", '_blank')
    };

    // // This use effect will triigger whenever value variable changed.
    // useEffect(() => {
    //     console.log(value);
    // }, [value]);

    const customPageStyle = `
        @page {
            size: auto;
            margin: 5mm;
        }
        @media print:last-child {
            page-break-after: auto;
       }
    `;
    
    // @media all {
    //     .pagebreak {
    //         overflow: hidden; 
    //         height: 0; 
    //     }
    // }

    // @media print {
    //     html, body {
    //         height: initial !important;
    //         overflow: initial !important;
    //     }
    // }
    // .page-break {
    //     margin-top: 1rem;
    //     display: block;
    //     page-break-before: auto;
    // }

    let printButton;
    switch (selectedPrint.selectedButton) {
        case "DWR":
            printButton = <DetailedWeighReport printData={selectedPrint} ref={(el) => (componentRef = el)} />    
            break;
        case "WOR":
            printButton = <WeighingOnlyReport printData={selectedPrint} ref={(el) => (componentRef = el)} />    
            break;
        case "WR":
            printButton = <WeighingReport printData={selectedPrint} ref={(el) => (componentRef = el)} />    
            break;
        case "DWDR":
            printButton = <DateWise_DetailedReport printData={selectedPrint} ref={(el) => (componentRef = el)} />
            break;
        case "DWSR":
            printButton = <DateWise_SummaryReport printData={selectedPrint} ref={(el) => (componentRef = el)} />
            break
        case "DCWR":
            printButton = <Date_ConsigneeWiseReport printData={selectedPrint} ref={(el) => (componentRef = el)} />
            break
        case "CWDWR":
            printButton = <ConsigneeWise_DatewiseReport printData={selectedPrint} ref={(el) => (componentRef = el)} />
            break
        default:
            break;
    }

    return(
        <Stack direction={'column'} sx={{ height: '90%' }} spacing={4} paddingTop={2}>
            <Typography variant='h5' fontWeight={700} paddingLeft={2} marginTop={2}>
                REPORTS AND UPLOAD 
            </Typography>
            <Divider sx={{ backgroundColor: '#006A71', opacity: 1, height: 4}}/>
            <Box paddingLeft={2} paddingRight={2} sx={{ height: '75%'}}>
                <DataGrid
                    checkboxSelection
                    rows={rows}
                    columns={columns}
                    sx={{
                        marginTop:1,
                    }}
                    disableColumnMenu
                    hideFooter
                    onSelectionModelChange={(ids) => {
                        const selectedIDs = new Set(ids);
                        const selectedRowData = rows.filter((row) =>
                            selectedIDs.has(row.id.toString())
                        );
                        setSelectedRows(selectedRowData)
                    }}
                />
            </Box>
            <Stack direction={'row'} justifyContent={'flex-end'} spacing={5} paddingRight={10}>
                <Button variant='contained' id='WOR' name='WOR' onClick={handleClickListItem} sx={{ 
                    width: 200,
                    height: 60,
                    backgroundColor: '#093545',
                    borderRadius: 2.5,
                    float: 'right',
                }}>Weighing Only Report</Button>
                <Button variant='contained' id='WR' name='WR' onClick={handleClickListItem} sx={{ 
                    width: 200,
                    height: 60,
                    backgroundColor: '#093545',
                    borderRadius: 2.5,
                    float: 'right',
                }}>Weighing Report</Button>
                <Button variant='contained' id='DWR' name='DWR' onClick={handleClickListItem} sx={{ 
                    width: 200,
                    height: 60,
                    backgroundColor: '#093545',
                    borderRadius: 2.5,
                    float: 'right',
                }}>Detailed Weighing Report</Button>
                <Button variant='contained' id='summaryReport' onClick={handleClicksummaryReort} sx={{ 
                    width: 200,
                    height: 60,
                    backgroundColor: '#093545',
                    borderRadius: 2.5,
                    float: 'right',
                }}>Summary Report</Button>
                <Button variant='contained' onClick={handleUpload} sx={{ 
                    width: 200,
                    height: 60,
                    backgroundColor: '#093545',
                    borderRadius: 2.5,
                    float: 'right',
                }}>UPLOAD TO FOIS</Button>
            </Stack>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Preview
                        </Typography>
                        <ReactToPrint
                            trigger={() => <Button variant="contained" sx={{backgroundColor: '#093545',borderRadius: 2.5}}>
                                Print
                                </Button>}
                            content={() => componentRef}
                            pageStyle= {customPageStyle}
                            documentTitle='Merit'
                        />
                    </Toolbar>
                </AppBar>
                <Box width={1} >
                    { printButton }
                </Box>
            </Dialog>
            <SummaryDialog open={summaryOpen} onClose={handleSummaryClose} data={consigneeList} />
        </Stack>
    )
}

export default Report;