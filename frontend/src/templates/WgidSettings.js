import { Button, Checkbox, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import MqttService from '../components/MqttService'
 

const WgidSettings = () => {

    const {state} = useLocation();
    const url = "";
    // const url = "http://localhost:8000";
    const [client, setClient] = useState(null);
    const controlTopic = "/Merit/" + state.wgid + "/Status/Control/"    // ScoreBoard,0/1

    const [settings, setSettings] = useState({
        heading1: "",
        heading2: "",
        heading3: "",
        stationName: "",
        minNetWtForUL_Cal: "0.0",
        commodity: "COAL",
        srcStation: "",
        tareWt_manual: false,
        overLoadExceed: "0.0",
        underLoadIfLess: "0.0",
        signature1: "",
        signature2: "",
        printSummary: false,
        printReportAuto: false,
        weighController: ""
    })

    const saveSettings = () => {
        let payload_to_send = 0;
        if (settings.weighController === 'remoteScoreBoard') {
            payload_to_send = 1;
        } else {
            payload_to_send = 0;
        }
        MqttService.publish(client, controlTopic, "ScoreBoard," + payload_to_send);
        axios.post(url + '/wgidsettings/', {
            wgid: state.wgid,
            settings: settings,
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
    }

    useEffect(() => {
        axios.get(url + "/wgidsettings/", {
            params: { wgid: state.wgid },
        }).then((response) => {
            console.log(response.data);
            if (response.data === 'Fail') {
                toast.error("Try Again", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                setSettings({
                    heading1: response.data[0]['heading1'],
                    heading2: response.data[0]['heading2'],
                    heading3: response.data[0]['heading3'],
                    stationName: response.data[0]['stationName'],
                    minNetWtForUL_Cal: response.data[0]['minNetWtForUL_Cal'],
                    commodity: response.data[0]['commodity'],
                    srcStation: response.data[0]['srcStation'],
                    tareWt_manual: response.data[0]['tareWt_manual'],
                    overLoadExceed: response.data[0]['overLoadExceed'],
                    underLoadIfLess: response.data[0]['underLoadIfLess'],
                    signature1: response.data[0]['signature1'],
                    signature2: response.data[0]['signature2'],
                    printSummary: response.data[0]['printSummary'],
                    printReportAuto: response.data[0]['printReportAuto'],
                    weighController: response.data[0]['weighController']
                })
            }
        });
        const mqttClient = MqttService.getclient()
        setClient(mqttClient);
        return () => {
            console.log("Inside unmount");
            MqttService.closeConnection(mqttClient);
        }
    }, []);

    const handleSettings = (event) => {
        let { name, value } = event.target;
        if (name === "tareWt_manual" || name === "printReportAuto" || name === "printSummary") {
            value = event.target.checked;
        }
        setSettings({
            ...settings,
            [name]: value,
        });
    }

    return(
        <Stack direction={'column'} sx={{ height: '90%' }} spacing={2} paddingTop={2} >
            <Typography variant='h4' paddingLeft={5}>Railcar Weighing System - Setup</Typography>
            <Stack direction={'row'} width={1}>
                <Stack direction={'column'} sx={{ width: '60%'}}>
                    <Stack direction={'row'} width={1} justifyContent={'space-evenly'} alignItems={'center'}>
                        <Typography variant='body1'>Heading Line 1</Typography>
                        <TextField size="small" sx={{ width: '70%'}} name="heading1" value={settings.heading1} onChange={handleSettings}/>
                    </Stack>
                    <Stack direction={'row'} width={1} justifyContent={'space-evenly'} alignItems={'center'} marginTop={2}>
                        <Typography variant='body1'>Heading Line 2</Typography>
                        <TextField size="small" sx={{ width: '70%'}} name="heading2" value={settings.heading2} onChange={handleSettings}/>
                    </Stack>
                    <Stack direction={'row'} width={1} justifyContent={'space-evenly'} alignItems={'center'} marginTop={2}>
                        <Typography variant='body1'>Heading Line 3</Typography>
                        <TextField size="small" sx={{ width: '70%'}} name="heading3" value={settings.heading3} onChange={handleSettings}/>
                    </Stack>
                </Stack>
                <Stack direction={'column'} sx={{ width: '30%'}}>
                    <Stack direction={'row'} width={1} justifyContent={'center'} alignItems={'center'}>
                        <Typography variant='body1' width={150}>WeighBridge ID</Typography>
                        <TextField size="small" sx={{ width: '40%'}} name="wgid" value={state.wgid} contentEditable={false}/>
                    </Stack>
                    <Stack direction={'row'} width={1} justifyContent={'center'} alignItems={'center'} marginTop={2}>
                        <Typography variant='body1' width={150}>Station Name</Typography>
                        <TextField size="small" sx={{ width: '40%'}} name="stationName" value={settings.stationName} onChange={handleSettings}/>
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction={'row'} sx={{ width: '90%'}} alignItems={'center'} paddingTop={2} paddingLeft={40}>
                <Typography variant='subtitle1' width={150}>Port to which scale is connected</Typography>
                <TextField size='small' sx={{ paddingLeft: '10px', width: '10%' }} name="port" value={"Auto"} contentEditable={false}/>
                <Typography variant='subtitle1' paddingLeft={10} width={250}>Min. Net Weight for UL Calculation</Typography>
                <TextField size='small' sx={{ paddingLeft: '10px', width: '10%' }} name="minNetWtForUL_Cal" value={settings.minNetWtForUL_Cal} onChange={handleSettings}/>
            </Stack>
            <Stack direction={'row'} justifyContent={'space-around'} width={1}>
                <Stack direction={'column'} sx={{ width: '25%'}} alignItems={'center'}>
                    <Stack direction={'row'} width={1} justifyContent={'center'} alignItems={'center'}>
                        <Typography variant='body1' width={150}>Default Commodity</Typography>
                        <TextField size="small" sx={{ width: '40%'}} name="commodity" value={settings.commodity} onChange={handleSettings}/>
                    </Stack>
                    <Stack direction={'row'} width={1} justifyContent={'center'} alignItems={'center'} marginTop={2}>
                        <Typography variant='body1' width={150}>Default Source Station</Typography>
                        <TextField size="small" sx={{ width: '40%'}} name="srcStation" value={settings.srcStation} onChange={handleSettings}/>
                    </Stack>
                    <FormControlLabel control={<Checkbox onChange={handleSettings} name='tareWt_manual' checked={settings.tareWt_manual}/>} label="Tare Weight Entry Manual Only" sx={{ marginTop: '10px' }} />
                </Stack>
                <Stack direction={'column'} sx={{ width: '25%'}} border={1} paddingLeft={2}>
                    <Typography variant='h6' paddingLeft={5} fontWeight={800}>OL/UL Values</Typography>
                    <Stack direction={'row'} width={1} alignItems={'center'}>
                        <Typography variant='body1' width={150}>Declare Over Load if Exceeding</Typography>
                        <TextField size="small" sx={{ width: '40%', marginLeft:'10px' }} name="overLoadExceed" value={settings.overLoadExceed} onChange={handleSettings}/>
                    </Stack>
                    <Stack direction={'row'} width={1} alignItems={'center'} marginTop={2}>
                        <Typography variant='body1' width={150}>Declare Under Load if Less than</Typography>
                        <TextField size="small" sx={{ width: '40%',marginLeft:'10px'}} name="underLoadIfLess" value={settings.underLoadIfLess} onChange={handleSettings}/>
                    </Stack>
                </Stack>
                <Stack direction={'column'} sx={{ width: '25%', visibility: 'hidden' }} border={1} paddingLeft={2} >
                    <Typography variant='h6' paddingLeft={5} fontWeight={800}>Printout Options</Typography>
                    <FormControlLabel control={<Checkbox onChange={handleSettings} name='printSummary' checked={settings.printSummary}/>} label="Print Summary as Detailed Report" sx={{ marginTop: '10px'}}/>
                    <FormControlLabel disabled control={<Checkbox onChange={handleSettings} name='printReportAuto' checked={settings.printReportAuto}/>} label="Print Report Automatically" sx={{ marginTop: '10px'}}/>
                </Stack>
            </Stack>
            <Stack direction={'row'} width={1} justifyContent={'center'} paddingTop={2} alignItems={'center'}>
                <Stack direction={'column'} sx={{ width: '30%'}} alignItems={'center'}>
                    <Stack direction={'row'} width={1} justifyContent={'center'} alignItems={'center'}>
                        <Typography variant='body1' width={100}>Signature 1</Typography>
                        <TextField size="small" sx={{ width: '50%'}} name="signature1" value={settings.signature1} onChange={handleSettings}/>
                    </Stack>
                    <Stack direction={'row'} width={1} justifyContent={'center'} alignItems={'center'} marginTop={2}>
                        <Typography variant='body1' width={100}>Signature 2</Typography>
                        <TextField size="small" sx={{ width: '50%'}} name="signature2" value={settings.signature2} onChange={handleSettings}/>
                    </Stack>
                </Stack>
                <Stack direction={'column'} sx={{ width: '30%'}} border={1} paddingLeft={5}>
                    <Typography variant='h6' paddingLeft={0} fontWeight={800}>Weight Control Port Option</Typography>
                    <RadioGroup value={settings.weighController} onChange={handleSettings} name="weighController">
                        <FormControlLabel value="remoteScoreBoard" control={<Radio />} label="Use for Remote ScoreBoard" />
                        <FormControlLabel value="serialPrintout" control={<Radio />} label="Use for Serial Printout" />
                    </RadioGroup>
                </Stack>
            </Stack>
            <Stack direction={'row'} width={1} justifyContent={'center'} paddingTop={2}>
                <Button variant="contained" onClick={saveSettings}>Update</Button>
            </Stack>
        </Stack>
    );

}

export default WgidSettings;