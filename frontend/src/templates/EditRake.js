import { Stack, Typography, Divider, Autocomplete, TextField, Button, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import WarningDialog from '../components/WarningDialog';
import { toast } from 'react-toastify';
import Settings from '@mui/icons-material/Settings';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';


const EditRake = () => {

    const {state} = useLocation();
    const navigate = useNavigate();
    const url = "";
    // const url = "http://localhost:8000";
    const [rakeID, setrakeid] = useState([]);
    const [selectedRake, setSelectedRake] = useState("")
    const [editable, setEditable] = useState(false)
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        title: "",
        content: "",
        command: "",
    })

    const columns = [
        {
            field: 'id',
            headerName: 'Position No',
            flex: 1,
            sortable: false,
        },
        {
            field: 'wgOwnRail',
            headerName: 'Owning Railway',
            flex: 1,
            sortable: false,
            editable: editable,
        },
        {
            field: 'wagonType',
            headerName: 'Wagon Type',
            flex: 1,
            sortable: false,
            editable: editable,
        },
        {
            field: 'wagonNo',
            headerName: 'Wagon No',
            flex: 1,
            sortable: false,
            editable: editable,
        },
        {
            field: 'tareWt',
            headerName: 'Tare Wt',
            flex: 1,
            sortable: false,
            editable: false,
        },
        {
            field: 'carryingCapacity',
            headerName: 'Carrying Capacity',
            flex: 1,
            sortable: false,
            editable: editable,
        },
        {
            field: 'permissibleCC',
            headerName: 'Permissible CC',
            flex: 1,
            sortable: false,
            editable: editable,
        },
    ];
    

    useEffect(() => {
        // calling fetch data function to get WeighBride ids from server and load to autocomplete component
        axios.get(url + '/rake/edit/details/', {
            params: {wgid: state.wgid},
        })
        .then(function (response) {
            console.log(response.data);
            let rakeids = [];
            response.data.forEach(rakeid => {
                rakeids.push(rakeid['rakeID']);
            });
            console.log(rakeids);
            setrakeid(rakeids);
        })
        .catch(function (error) {
            console.log(error);
        });
    },[])

    const handlerakeid = (event, value) => {

        setSelectedRake(value)
        setEditable(false)
        axios.post(url + '/rake/edit/details/', {
            rakeid: value,
            wgid: state.wgid,
        })
        .then(function (response) {
            let row_list = [];
            response.data.forEach(wagondetails => {
                let row_value = {};
                row_value['id'] = wagondetails['wgseqNo'];
                row_value['wagonType'] = wagondetails['wgType'];
                row_value['wagonNo'] = wagondetails['wgNumb'];
                row_value['carryingCapacity'] = 0.0;
                row_value['noOfAxles'] = wagondetails['noOfAxles'];
                row_value['grossWt'] = wagondetails['grossWt'];
                row_value['tareWt'] = wagondetails['wgTareWt'];
                row_value['netWt'] = wagondetails['netWt'];
                row_value['speed'] = wagondetails['speed'];
                row_value['wgOwnRail'] = wagondetails['wgOwnRail'];
                row_value['carryingCapacity'] = wagondetails['cc'];
                row_value['permissibleCC'] = wagondetails['pcc'];
                console.log(row_value);
                row_list.push(row_value);
            });
            setRows(row_list);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const handleReverse = () => {
        const tempwagonNo = [];
        const tempwagonType = [];
        const tempOwnRail = [];
        const temptareWt = [];
        rows.forEach(row => {
            tempwagonNo.push(row.wagonNo);
            tempwagonType.push(row.wagonType);
            tempOwnRail.push(row.wgOwnRail);
            temptareWt.push(row.tareWt);
        });
        tempwagonNo.reverse();
        tempwagonType.reverse();
        tempOwnRail.reverse();
        temptareWt.reverse();
        for (let index = 0; index < tempwagonNo.length; index++) {
            setRows(rows => rows.map(obj => {
                if (obj.id === index + 1) {
                    console.log(tempwagonNo[index]);
                    console.log(obj.wagonNo);
                    return {...obj, wagonNo: tempwagonNo[index], wagonType: tempwagonType[index], wgOwnRail: tempOwnRail[index], tareWt: temptareWt[index]};
                }
                return obj;
            }));
        }
        console.log(rows);
        // setRows(rows);
    }

    const handleSwap = (ids) => {
        const selectedIDs = new Set(ids);
        console.log(selectedIDs);
        if (ids.length === 2) {
            const selectedRowData = rows.filter((row) =>
                selectedIDs.has(row.id)
            );
            console.log(selectedRowData[0].id);
            setDialogValue({
                title: "Rearrange",
                content: "Are you sure you want Swap/Reorder," + selectedRowData[0].id + "," + selectedRowData[1].id,
                command: "Rearrange",
            })
        }
        
    }

    const handleEdit = () => {
        setEditable(true)
    }

    const handleSave = () => {
        setDialogValue({
            title: "Edit Save",
            content: "Are you sure you want to save the modifications",
            command: "Save",
        })
    }

    useEffect(() => {
        if (dialogValue.title !== "") {
            setOpen(true)
        }
    }, [dialogValue])

    const handleClose = (command, payload) => {
        setOpen(false);
        console.log(command);
        if (command === "Save") {
            console.log(rows);
            axios.post(url + '/rake/edit/save/', {
                wgid: state.wgid,
                rake: selectedRake,
                wagons: rows,
            })
            .then(function (response) {
                console.log(response.data);
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Try Again", {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
        } else if (command === "Reset") {
            handlerakeid("event", selectedRake);
        } else if (command === "Swap") {
            let payloadList = payload.split(",");
            console.log(payloadList);
            const tempwagon1 = [rows[parseInt(payloadList[0]) - 1].wagonNo, rows[parseInt(payloadList[0]) - 1].wagonType, rows[parseInt(payloadList[0]) - 1].wgOwnRail, rows[parseInt(payloadList[0]) - 1].tareWt];
            const tempwagon2 = [rows[parseInt(payloadList[1]) - 1].wagonNo, rows[parseInt(payloadList[1]) - 1].wagonType, rows[parseInt(payloadList[1]) - 1].wgOwnRail, rows[parseInt(payloadList[1]) - 1].tareWt];
            setRows((prevRows) => {
                const rowToUpdateIndex = parseInt(payloadList[0]) - 1;
                console.log(rowToUpdateIndex);
                return prevRows.map((row, index) =>
                    index === rowToUpdateIndex ? { ...row, 
                        wagonNo: tempwagon2[0],
                        wagonType: tempwagon2[1],
                        wgOwnRail: tempwagon2[2],
                        tareWt: tempwagon2[3],
                    } : row,
                );
            });
            setRows((prevRows) => {
                const rowToUpdateIndex = parseInt(payloadList[1]) - 1;
                console.log(rowToUpdateIndex);
                return prevRows.map((row, index) =>
                    index === rowToUpdateIndex ? { ...row, 
                        wagonNo: tempwagon1[0],
                        wagonType: tempwagon1[1],
                        wgOwnRail: tempwagon1[2],
                        tareWt: tempwagon1[3],
                    } : row,
                );
            });
        } else if (command === "Reorder1") {
            let payloadList = payload.split(",");
            let tempwagon = rows[parseInt(payloadList[0]) - 1];
            for (let index = parseInt(payloadList[0]); index < parseInt(payloadList[1]); index++) {
                let tempwagonNo = rows[index].wagonNo;
                let tempwagonType = rows[index].wagonType;
                let tempOwnRail = rows[index].wgOwnRail;
                let temptareWt = rows[index].tareWt;
                setRows((prevRows) => {
                    const rowToUpdateIndex = index - 1;
                    return prevRows.map((row, index) =>
                        index === rowToUpdateIndex ? { ...row, 
                            wagonNo: tempwagonNo,
                            wagonType: tempwagonType,
                            wgOwnRail: tempOwnRail,
                            tareWt: temptareWt,
                        } : row,
                    );
                });
            }
            setRows((prevRows) => {
                const rowToUpdateIndex = parseInt(payloadList[1]) - 1;
                return prevRows.map((row, index) =>
                    index === rowToUpdateIndex ? { ...row, 
                        wagonNo: tempwagon.wagonNo,
                        wagonType: tempwagon.wagonType,
                        wgOwnRail: tempwagon.wgOwnRail,
                        tareWt: tempwagon.tareWt,
                    } : row,
                );
            });
        } else if (command === "Reorder2") {
            let payloadList = payload.split(",");
            console.log(payloadList);
            let tempwagon = rows[parseInt(payloadList[0]) - 1];
            console.log(tempwagon);
            for (let index = parseInt(payloadList[0]) - 1; index > parseInt(payloadList[1]) - 1; index--) {
                console.log(index);
                let tempwagonNo = rows[index - 1].wagonNo;
                let tempwagonType = rows[index - 1].wagonType;
                let tempOwnRail = rows[index - 1].wgOwnRail;
                let temptareWt = rows[index - 1].tareWt;
                console.log(tempwagonNo, tempwagonType);
                setRows((prevRows) => {
                    const rowToUpdateIndex = index;
                    return prevRows.map((row, index) =>
                        index === rowToUpdateIndex ? { ...row, 
                            wagonNo: tempwagonNo,
                            wagonType: tempwagonType,
                            wgOwnRail: tempOwnRail,
                            tareWt: temptareWt,
                        } : row,
                    );
                });
            }
            setRows((prevRows) => {
                const rowToUpdateIndex = parseInt(payloadList[1]) - 1;
                return prevRows.map((row, index) =>
                    index === rowToUpdateIndex ? { ...row, 
                        wagonNo: tempwagon.wagonNo,
                        wagonType: tempwagon.wagonType,
                        wgOwnRail: tempwagon.wgOwnRail,
                        tareWt: tempwagon.tareWt,
                    } : row,
                );
            });
        } else {
            
        }
    }

    const handleCellEditCommit = React.useCallback(
        ({ id, field, value }) => {
            console.log(id , field, value);
            setRows((prevRows) => {
                const rowToUpdateIndex = id - 1;
                return prevRows.map((row, index) =>
                    index === rowToUpdateIndex ? { ...row, 
                        [field]: value, 
                    } : row,
                );
            });
        },
        [rows],
    );

    const handleRakeEdit = () => {
        console.log("inside Edit");
        if (selectedRake === "") {
            toast.warn("Please Select RakeID", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            navigate("/update/rake", { state : { username : state.username, wgid: state.wgid, password: state.password, rake : selectedRake }});
        }
    }

    return(
        <Stack direction={'column'} sx={{ height: '90%' }} spacing={2} paddingTop={2}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant='h5' fontWeight={700} paddingLeft={2}>
                    EDIT WAGON DATA
                </Typography>
                <Box paddingRight={2} display={'inline-flex'} alignItems={'center'} sx={{ cursor: 'pointer'}} onClick={handleRakeEdit}>
                    <Settings fontSize='large'></Settings>
                    <Typography variant='h6'>Update Rake</Typography>
                </Box>
                
            </Stack>
            
            <Divider sx={{ backgroundColor: '#006A71', opacity: 1, height: 4}}/>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Autocomplete
                    id="rakeID"
                    options={rakeID}
                    onChange={handlerakeid}
                    sx={{ width: 250, height: 55, paddingLeft: 2, input: {color: '#fff'
                        },
                    }}
                    renderInput={(params) => <TextField {...params} sx={{
                        backgroundColor: '#093545',
                        borderRadius: 2.5,
                    }} />}
                />
                <Stack direction={'row'} paddingRight={10} spacing={5}>
                    <Button variant='contained' onClick={handleReverse} sx={{ 
                        width: 200,
                        height: 55,
                        backgroundColor: '#093545',
                        borderRadius: 2.5,
                    }}>Reverse</Button>
                    <Button variant='contained' onClick={handleEdit} sx={{ 
                        width: 200,
                        height: 55,
                        backgroundColor: '#093545',
                        borderRadius: 2.5,
                    }}>Edit</Button>
                </Stack>
            </Stack>
            <Box paddingLeft={2} paddingRight={2} sx={{ height: '70%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    sx={{
                        marginTop:1,
                    }}
                    disableColumnMenu
                    onCellEditCommit={handleCellEditCommit}
                    hideFooter
                    checkboxSelection={editable}
                    disableSelectionOnClick
                    onSelectionModelChange={handleSwap}
                />
            </Box>
            <Box flex paddingRight={10} paddingTop={3}>
                <Button variant='contained' onClick={handleSave} sx={{ 
                    width: 200,
                    height: 55,
                    backgroundColor: '#093545',
                    borderRadius: 2.5,
                    float: 'right',
                }}>SAVE</Button>
            </Box>
            <WarningDialog 
                open={open}
                onClose={handleClose}
                value={dialogValue}
            />
        </Stack>
    );
}

export default EditRake;