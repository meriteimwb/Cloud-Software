import React, { useEffect, useState } from 'react';
import { Stack, Typography, Divider, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import MqttService from '../components/MqttService'
import WarningDialog from '../components/WarningDialog';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import { Client } from 'mqtt';

const columns = [
    {
        field: 'id',
        headerName: 'Position No',
        flex: 1,
        sortable: false,
    },
    {
        field: 'wagonType',
        headerName: 'Wagon Type',
        flex: 1,
        sortable: false,
    },
    {
        field: 'wagonNo',
        headerName: 'Wagon No',
        flex: 1,
        sortable: false,
    },
    {
        field: 'carryingCapacity',
        headerName: 'Carrying Capacity',
        flex: 1,
        sortable: false,
        
    },
    {
        field: 'noOfAxles',
        headerName: 'No Of Axles',
        flex: 1,
        sortable: false,
    },
    {
        field: 'grossWt',
        headerName: 'Gross Weight',
        flex: 1,
        sortable: false,
    },
    {
        field: 'tareWt',
        headerName: 'Tare Weight',
        flex: 1,
        sortable: false,
    },
    {
        field: 'netWt',
        headerName: 'Net Weight',
        flex: 1,
        sortable: false,
    },
    {
        field: 'speed',
        headerName: 'Speed',
        flex: 1,
        sortable: false,
    },
];

const Weighment = () => {

    const {state} = useLocation();
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [count, setCount] = useState(1);
    const [minNetWt, setminNetWt] = useState(0);
    const [subscribed, setSubscribed] = useState(false);

    let initialFlag = true;
    const [client, setClient] = useState(null);
    const [rakeID, setRakeID] = useState("");
    const [notify, setNotify] = useState("Initial");
    const [direction, setDirection] = useState("Direction : ");
    const [systemStatus, setSystemStatus] = useState("error");
    const weighmentTopic = "/Merit/" + state.wgid + "/Weighment/"
    const weighmentResendTopic = "/Merit/" + state.wgid + "/Weighment/sendFrom/"
    const commandTopic = "/Merit/" + state.wgid + "/COMMAND/"
    const inputTopic = "/Merit/" + state.wgid + "/InputStatus/"
    const outputTopic = "/Merit/" + state.wgid + "/OutputStatus/"
    const errorStatusTopic = "/Merit/" + state.wgid + "/ErrorStatus/"
    const commandStatusTopic = "/Merit/" + state.wgid + "/Status/"
    const [disableInitiate, setDisableInitiate] = useState(true);
    const [disableTerminate, setDisableTerminate] = useState(true);
    const [open, setOpen] = useState(false);
    // let prevSerialNum = 1;
    const [dialogValue, setDialogValue] = useState({
        title: "",
        content: "",
        command: "",
    })
    const [switchStatus, setSwitchStatus]= useState({
        TrackSwitch1A: "#EA6C5B", 
        TrackSwitch1B: "#EA6C5B", 
        TrackSwitch2A: "#EA6C5B", 
        TrackSwitch2B: "#EA6C5B", 
        TrackSwitch3A: "#EA6C5B", 
        TrackSwitch3B: "#EA6C5B", 
        TrackSwitch4A: "#EA6C5B", 
        TrackSwitch4B: "#EA6C5B"
    })
    const [switchCount, setSwitchCount]= useState({
        SW1: 0,
        SW2: 0,
        SW3: 0,
        SW4: 0,
        AxleRcvd: 0,
        AxleIgnored: 0,
        speedTL1: 0,
        speedTL2: 0,
        speedWeigh: 0,
    })

    const url = "";
    // const url = "http://localhost:8000";

    useEffect(() => {
        const getWeighingDetails = () => {
            axios.get(url + '/weighing/rakes/', {
                params: { wgid: state.wgid },
            })
            .then(function (response) {
                console.log(response.data);
                if (response.data === 'Rakes not selected for weighment') {
                    toast.error(response.data, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    setDisableInitiate(true);
                } else if(response.data === 'Fail') {
                    toast.error("Try again", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    setDisableInitiate(true);
                }else {
                    const rake = response.data['rake'];
                    setRakeID(rake);
                    const data1 = response.data['data'];
                    const wgidsettings = response.data['wgidSettings']
                    setminNetWt(wgidsettings[0]['minNetWtForUL_Cal']);
                    let row_list = [];
                    data1.forEach(wagondetails => {
                        let row_value = {};
                        row_value['id'] = wagondetails['wgseqNo'];
                        row_value['wagonType'] = wagondetails['wgType'];
                        row_value['wagonNo'] = wagondetails['wgNumb'];
                        row_value['tareWt'] = wagondetails['wgTareWt'].toFixed(2);
                        row_value['carryingCapacity'] = wagondetails['cc'].toFixed(2);
                        row_value['noOfAxles'] = wagondetails['noOfAxles'];
                        row_value['grossWt'] = wagondetails['grossWt'].toFixed(2);
                        row_value['netWt'] = wagondetails['netWt'].toFixed(2);
                        row_value['speed'] = wagondetails['speed'];
                        row_value['startTime'] = "";
                        row_value['endTime'] = "";
                        row_value['direction'] = "IN";
                        row_value['Updated'] = false;
                        // console.log(row_value);
                        row_list.push(row_value);
                    });
                    setRowCount(row_list.length);
                    setRows(row_list);
                    setCount(1);
                    setDisableInitiate(false);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        // calling fetch data function to get WeighBride ids from server and load to autocomplete component
        getWeighingDetails();
    },[])

    useEffect(() => {
        console.log(rowCount, count);
        initialFlag = true;
        const mqttClient = MqttService.getclient();
        setClient(mqttClient);
        MqttService.subscribe(mqttClient, weighmentTopic, subHandler);
        MqttService.subscribe(mqttClient, inputTopic, subHandler);
        MqttService.subscribe(mqttClient, outputTopic, subHandler);
        MqttService.subscribe(mqttClient, errorStatusTopic, subHandler);
        const callBack = (mqttMessage, topic, mqttClient) => handleMessage(mqttMessage, topic, mqttClient);
        MqttService.onMessage(mqttClient, callBack);
        return () => {
            console.log("Inside unmount");
            MqttService.unsubscribe(mqttClient, weighmentTopic);
            MqttService.unsubscribe(mqttClient, inputTopic);
            MqttService.unsubscribe(mqttClient, outputTopic);
            MqttService.unsubscribe(mqttClient, errorStatusTopic);
            MqttService.closeConnection(mqttClient);
            // setInitialFlag(true);
        }
    }, [rowCount])

    const handleClose = (newValue, axlesToBeEliminated) => {
        setOpen(false);
        console.log(newValue);
        if (newValue === "Initiate") {
            if (subscribed) {
                setRows(rows.map((row) => ({ ...row, 
                    netWt : 0.0.toFixed(2),
                    grossWt : 0.0.toFixed(2),
                    noOfAxles : 0,
                    speed : 0.0.toFixed(1),
                })));
                setSwitchCount({
                    SW1: 0,
                    SW2: 0,
                    SW3: 0,
                    SW4: 0,
                    AxleRcvd: 0,
                    AxleIgnored: 0,
                    speedTL1: 0,
                    speedTL2: 0,
                    speedWeigh: 0,
                });
                console.log("Already Subscribed");
            }
            MqttService.publish(client, commandTopic, "Initiate," + axlesToBeEliminated)
            // MqttService.publish(client, commandStatusTopic, "Initiate")
            setDisableTerminate(true);
            toast.success("Initiate Sent Successfully", {
                position: toast.POSITION.TOP_RIGHT
            });
            initialFlag = false;
        } else if (newValue === "Terminate") {
            // MqttService.publish(client, commandStatusTopic, "Terminate")
            // MqttService.unsubscribe(client, weighmentTopic)
            // MqttService.closeConnection(client);
            let row_list = [];
            rows.forEach(wagondetails => {
                if (wagondetails['Updated'] === true) {
                    row_list.push(wagondetails);
                }
            });
            axios.post(url + '/weighing/rakes/save/', {
                wgid: state.wgid,
                rake: rakeID,
                wagons: row_list,
            })
            .then(function (response) {
                console.log(response.data);
                MqttService.publish(client, commandTopic, "Terminate");
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT
                });
                setDisableTerminate(true);
                setDisableInitiate(true);
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Try Again", {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
            setCount(1)
        } else{

        }
    };

    function getSwitchStatus(value){
        if (value === 0) {
            return "#EA6C5B"
        } else {
            return "#70B89D"
        }
    }

    const handleMessage = (payload, topic, mqttClient) => {
        console.log(payload);
        try {
            if (topic === weighmentTopic) {
                if (payload['Message'] === 'UnknownVehicle') {
                    console.log("UnknownVehicle");
                    // MqttService.unsubscribe(client, weighmentTopic)
                    setDialogValue({
                        title: "Error",
                        content: "Unknown vechicle has been detected. Please reinitiate weighment",
                        command: "Initiate"
                    })
                    // setOpen(true)
                } else {
                    var array_value = payload['WagonSerialNumber'] - 1;
                    setNotify(payload['Message']);
                    setSwitchCount({
                        SW1: payload['AxleCountPair1'],
                        SW2: payload['AxleCountPair2'],
                        SW3: payload['AxleCountPair3'],
                        SW4: payload['AxleCountPair4'],
                        AxleRcvd: payload['AxleWeight'],
                        AxleIgnored: payload['AxleIgnore'],
                        speedTL1: payload['SpeedTLPair1'],
                        speedTL2: payload['SpeedTLPair2'],
                        speedWeigh: payload['SpeedFromWeigh'],
                    });
                    if (payload['WE'] === true) {
                        if (disableTerminate) {
                            setDisableTerminate(false);
                        }
                        if (payload['WagonType'] === -3 || payload['WagonType'] === -4) {
                            console.log("Loco Sensed");
                        } else {
                            if (initialFlag) {
                                console.log("Initial Flag is " + initialFlag);
                                initialFlag = false;
                                MqttService.publish(mqttClient, weighmentResendTopic, "1");
                            } else {
                                setRows((prevRows) => {
                                    // console.log("Inside Prev rows");
                                    // console.log("Row Length is : ", prevRows.length);
                                    const rowToUpdateIndex = payload['WagonSerialNumber'] - 1;
                                    let isPreviousUpdated = false;
                                    if (rowToUpdateIndex === 0) {
                                        isPreviousUpdated = true;
                                    } else if (rowToUpdateIndex === -1) {
                                        isPreviousUpdated = false;
                                        rowToUpdateIndex = 2;
                                    } else {
                                        isPreviousUpdated = prevRows[rowToUpdateIndex - 1].Updated;
                                    }
                                    if (isPreviousUpdated) {
                                        let direction = "";
                                        if (payload['Direction'] === 1) {
                                            direction = "IN";
                                        } else if (payload['Direction'] === 2) {
                                            direction = "OUT";
                                        }
                                        else {
                                            direction = "Otherwise";
                                        }
                                        setDirection("Direction : " + direction);

                                        if (payload['WagonSerialNumber'] > prevRows.length) {
                                            console.log("Adding Extra rows");
                                            let row_value = {};
                                            row_value['id'] = payload['WagonSerialNumber'];
                                            row_value['wagonType'] = "";
                                            row_value['wagonNo'] = "";
                                            row_value['tareWt'] = 0.0;
                                            row_value['carryingCapacity'] = 0.0.toFixed(2);
                                            row_value['noOfAxles'] = payload['WagonType'];
                                            if (payload['WagonSpeed'] > 15) {
                                                row_value['grossWt'] = 0.0.toFixed(2);
                                                row_value['netWt'] = 0.0.toFixed(2);
                                            } else {
                                                row_value['grossWt'] = payload['WagonWeight'].toFixed(2);
                                                row_value['netWt'] = payload['WagonWeight'].toFixed(2);
                                            }
                                            row_value['speed'] = payload['WagonSpeed'];
                                            row_value['startTime'] = payload['StartTime'];
                                            row_value['endTime'] = payload['EndTime'];
                                            row_value['direction'] = payload['Direction'];
                                            row_value['Updated'] = true;
                                            setRows([...prevRows, row_value]);
                                        } else {
                                            let netWt = 0.0.toFixed(2);
                                            let grossWt = 0.0.toFixed(2);
                                            if (payload['WagonSpeed'] <= 15) {
                                                netWt = (payload['WagonWeight'] - prevRows[array_value]['tareWt']).toFixed(2);
                                                grossWt = payload['WagonWeight'].toFixed(2);
                                                console.log("Minimum Net Weight is " + minNetWt);
                                                if (netWt < minNetWt) {
                                                    netWt = 0.0.toFixed(2);
                                                }
                                            }
                                            return prevRows.map((row, index) =>
                                            index === rowToUpdateIndex ? { ...row,
                                                netWt : netWt,
                                                grossWt : grossWt,
                                                noOfAxles : payload['WagonType'],
                                                direction : payload['Direction'],
                                                speed : payload['WagonSpeed'],
                                                startTime: payload['StartTime'],
                                                endTime : payload['EndTime'],
                                                Updated : true,
                                            } : row,
                                        );
                                        }
                                        
                                    } else {
                                        MqttService.publish(mqttClient, weighmentResendTopic, "" + rows[rowToUpdateIndex - 1].id);
                                        // console.log(prevRows);
                                        setRows(prevRows);
                                    }
                                });
                            }
                        }
                    }
                }
            } else if (topic === inputTopic) {
                setSwitchStatus({
                    TrackSwitch1A: getSwitchStatus(payload['TrackSwitch1A']), 
                    TrackSwitch1B: getSwitchStatus(payload['TrackSwitch1B']), 
                    TrackSwitch2A: getSwitchStatus(payload['TrackSwitch2A']), 
                    TrackSwitch2B: getSwitchStatus(payload['TrackSwitch2B']), 
                    TrackSwitch3A: getSwitchStatus(payload['TrackSwitch3A']), 
                    TrackSwitch3B: getSwitchStatus(payload['TrackSwitch3B']), 
                    TrackSwitch4A: getSwitchStatus(payload['TrackSwitch4A']), 
                    TrackSwitch4B: getSwitchStatus(payload['TrackSwitch4B'])
                })
            } else if (topic === outputTopic) {
                if (payload['SystemReady'] === 0) {
                    setSystemStatus('error');
                } else {
                    setSystemStatus('success');
                }
            } else if (topic === errorStatusTopic) {
                console.log(payload);
                setDialogValue({
                    title: "Error",
                    content: payload['ErrorMessage'],
                    command: "Status"
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const subHandler = (topic) => {
        console.log(topic);
        setSubscribed(true)
    }

    const  handleInitiate = () => {
        setDialogValue({
            title: "Confirm",
            content: "Are you sure you want to Initiate",
            command: "Initiate",
        })
        // setOpen(true)
    }

    const handleTerminate = () => {
        setDialogValue({
            title: "Confirm",
            content: "Are you sure you want to Terminate",
            command: "Terminate"
        })
        // setOpen(true)
    }

    useEffect(() => {
        if (dialogValue.title !== "") {
            setOpen(true)
        }
    }, [dialogValue])

    const boxStyle = {
        width:65,
        height: 25,
        textAlign: 'center',
        borderRadius: 1,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)'
    }

    return(
        <Stack direction={'column'} sx={{ height: '90%' }} paddingTop={2}>

            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingRight={10}>
                <Typography variant='h5' fontWeight={700} paddingLeft={2}>
                    WEIGHMENT
                </Typography>
                <Button variant='contained' disabled={disableInitiate} onClick={handleInitiate} sx={{ 
                    width: 200,
                    height: 55,
                    backgroundColor: '#093545',
                    borderRadius: 2.5,
                }}>INITIATE</Button>
            </Stack>
            <Typography variant='body1' fontWeight={400} paddingLeft={2}>
                Rake ID : {rakeID}
            </Typography>
            <Divider sx={{ backgroundColor: '#006A71', opacity: 1, height: 4}}/>

            <Stack direction={'column'} paddingLeft={2} paddingRight={2} sx={{ height: '74%'}} spacing={2}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    sx={{
                        marginTop:1,
                    }}
                    disableColumnMenu
                    hideFooter
                />

                <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography variant='body2' fontWeight={400} paddingLeft={5}>
                        {notify}
                    </Typography>
                    <Typography variant='body2' fontWeight={400}>
                        {direction}
                    </Typography>
                    <Stack direction={'row'} paddingRight={5}><CircleRoundedIcon color={systemStatus} />Status</Stack>
                </Stack>
            </Stack>

            <Divider sx={{ backgroundColor: '#006A71', opacity: 1, height: 4, marginTop: 2}} />
            <Stack direction={'row'} justifyContent={'space-between'}paddingLeft={5 }>
                <Stack direction={'column'} spacing={2}>
                    <Typography variant='subtitle1'>Track Switch Status</Typography>
                    <Stack direction={'row'} spacing={2}>
                        <Box style={boxStyle} backgroundColor={switchStatus.TrackSwitch1A}>
                            <Typography variant='subtitle1'>Tx 1A</Typography>
                        </Box>
                        <Box style={boxStyle} backgroundColor={switchStatus.TrackSwitch2A}>
                            <Typography variant='subtitle1'>Tx 2A</Typography>
                        </Box>
                        <Box style={boxStyle} backgroundColor={switchStatus.TrackSwitch3A}>
                            <Typography variant='subtitle1'>Tx 3A</Typography>
                        </Box>
                        <Box style={boxStyle} backgroundColor={switchStatus.TrackSwitch4A}>
                            <Typography variant='subtitle1'>Tx 4A</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                        <Box style={boxStyle} backgroundColor={switchStatus.TrackSwitch1B}>
                            <Typography variant='subtitle1'>Tx 1B</Typography>
                        </Box>
                        <Box style={boxStyle} backgroundColor={switchStatus.TrackSwitch2B}>
                            <Typography variant='subtitle1'>Tx 2B</Typography>
                        </Box>
                        <Box style={boxStyle} backgroundColor={switchStatus.TrackSwitch3B}>
                            <Typography variant='subtitle1'>Tx 3B</Typography>
                        </Box>
                        <Box style={boxStyle} backgroundColor={switchStatus.TrackSwitch4B}>
                            <Typography variant='subtitle1'>Tx 4B</Typography>
                        </Box>
                    </Stack>
                </Stack>
                <Stack direction={'column'} spacing={2}>
                    <Typography variant='subtitle1'>Track Switch Count</Typography>
                    <Stack direction={'row'} spacing={15}>
                        <Typography variant='subtitle1'>SW1: {switchCount.SW1}</Typography>
                        <Typography variant='subtitle1'>SW2: {switchCount.SW2}</Typography>
                    </Stack>
                    <Stack direction={'row'} spacing={15}>
                        <Typography variant='subtitle1'>SW3: {switchCount.SW3}</Typography>
                        <Typography variant='subtitle1'>SW4: {switchCount.SW4}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={'column'} spacing={2}>
                    <Typography variant='subtitle1'>Axle Counts</Typography>
                    <Typography variant='subtitle1'>Rcvd: {switchCount.AxleRcvd}</Typography>
                    <Typography variant='subtitle1'>Ignored: {switchCount.AxleIgnored}</Typography>
                </Stack>
                <Stack direction={'column'} spacing={0}textAlign={'center'}>
                    <Typography variant='subtitle1'>Speed</Typography>
                    <Typography variant='subtitle1'>{switchCount.speedTL1}</Typography>
                    <Typography variant='subtitle1'>{switchCount.speedTL2}</Typography>
                    <Typography variant='subtitle1'>{switchCount.speedWeigh}</Typography>
                </Stack>
                <Box flex paddingRight={10} paddingTop={3}>
                    <Button variant='contained' disabled={disableTerminate} onClick={handleTerminate} sx={{ 
                        width: 200,
                        height: 55,
                        backgroundColor: '#093545',
                        borderRadius: 2.5,
                        float: 'right',
                    }}>TERMINATE</Button>
                </Box>
            </Stack>
            <WarningDialog 
                open={open}
                onClose={handleClose}
                value={dialogValue}
            />
        </Stack>
    );
}

export default Weighment;