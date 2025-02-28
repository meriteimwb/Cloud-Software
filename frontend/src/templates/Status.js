import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Stack, Typography, Divider, Button, Grid, FormControlLabel, Switch } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MqttService from '../components/MqttService'
import SwitchStyle from '../components/SwitchStyle'
import WarningDialog from '../components/WarningDialog';


const Status = () => {

    const {state} = useLocation();
    // const [inputRows, setInputRows] = useState([]);
    // const [outputRows, setOutputRows] = useState([]);
    const [client, setClient] = useState(null);
    const [weight, setWeight] = useState(0.0);
    // const [switchLabel, setSwitchLabel] = useState("");
    const inputTopic = "/Merit/" + state.wgid + "/InputStatus/"
    const weightTopic = "/Merit/" + state.wgid + "/WeightStatus/"
    const commandTopic = "/Merit/" + state.wgid + "/Status/"
    const outputTopic = "/Merit/" + state.wgid + "/OutputStatus/"
    const errorStatusTopic = "/Merit/" + state.wgid + "/ErrorStatus/"
    const controlTopic = "/Merit/" + state.wgid + "/Status/Control/"    // [(1-16),0/1]/ RESET
    const [subscribed, setSubscribed] = useState({
        input: false,
        output: false,
        weight: false
    });
    const [open, setOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        title: "",
        content: "",
        command: "",
    })

    const [inputState, setInputState] = useState({
        TrackSwitch1A: false,
        TrackSwitch1B: false,
        TrackSwitch2A: false,
        TrackSwitch2B: false,
        TrackSwitch3A: false,
        TrackSwitch3B: false,
        TrackSwitch4A: false,
        TrackSwitch4B: false,
        StartWeigh: false,
        EndWeigh: false,
        Aos_In_Dir_5A: false,
        Aos_In_Dir_5B: false,
        Aos_Out_Dir_6B: false,
        Aos_Out_Dir_6A: false,
        pin15: false,
        pin16: false
    })

    const [outputState, setOutputState] = useState({
        SystemReady: false,
        OverSpeedLampRelay: false,
        AlarmHooter: false,
        pin4: false,
        pin5: false,
        pin6: false,
        pin7: false,
        pin8: false,
        SystemReadyLamp: false,
        OverSpeedLamp: false,
        AdvanceOverSpeedLamp: false,
        UnknownVehicle: false,
        ADFailure: false,
        pin14: false,
        pin15: false,
        pin16: false,
    });

    const [switchLabel, setSwitchLabel] = useState({
        SystemReady: "",
        OverSpeedLampRelay: "",
        AlarmHooter: "",
        pin4: "",
        pin5: "",
        pin6: "",
        pin7: "",
        pin8: "",
        SystemReadyLamp: "",
        OverSpeedLamp: "",
        AdvanceOverSpeedLamp: "",
        UnknownVehicle: "",
        ADFailure: "",
        pin14: "",
        pin15: "",
        pin16: "",
    });

    function getBoolean(value) {
        if (value === 0) {
            return false;
        } else {
            return true
        }
    }

    const handleMessage = (payload, topic) => {
        if (topic === inputTopic) {
            console.log("Input Topic is : " + getBoolean(payload['TrackSwitch1A']));
            setInputState({
                TrackSwitch1A: getBoolean(payload['TrackSwitch1A']),
                TrackSwitch1B: getBoolean(payload['TrackSwitch1B']),
                TrackSwitch2A: getBoolean(payload['TrackSwitch2A']),
                TrackSwitch2B: getBoolean(payload['TrackSwitch2B']),
                TrackSwitch3A: getBoolean(payload['TrackSwitch3A']),
                TrackSwitch3B: getBoolean(payload['TrackSwitch3B']),
                TrackSwitch4A: getBoolean(payload['TrackSwitch4A']),
                TrackSwitch4B: getBoolean(payload['TrackSwitch4B']),
                StartWeigh: getBoolean(payload['StartWeigh']),
                EndWeigh: getBoolean(payload['EndWeigh']),
                Aos_In_Dir_5A: getBoolean(payload['Aos_In_Dir_5A']),
                Aos_In_Dir_5B: getBoolean(payload['Aos_In_Dir_5B']),
                Aos_Out_Dir_6B: getBoolean(payload['Aos_Out_Dir_6B']),
                Aos_Out_Dir_6A: getBoolean(payload['Aos_Out_Dir_6A']),
                pin15: getBoolean(payload['pin15']),
                pin16: getBoolean(payload['pin16'])

            })
        } else if (topic === outputTopic) {
            console.log("Output Topic is : " + payload);
            setOutputState({
                SystemReady: getBoolean(payload['SystemReady']),
                OverSpeedLampRelay: getBoolean(payload['OverSpeedLampRelay']),
                AlarmHooter: getBoolean(payload['AlarmHooter']),
                pin4: getBoolean(payload['pin4']),
                pin5: getBoolean(payload['pin5']),
                pin6: getBoolean(payload['pin6']),
                pin7: getBoolean(payload['pin7']),
                pin8: getBoolean(payload['pin8']),
                SystemReadyLamp: getBoolean(payload['SystemReadyLamp']),
                OverSpeedLamp: getBoolean(payload['OverSpeedLamp']),
                AdvanceOverSpeedLamp: getBoolean(payload['AdvanceOverSpeedLamp']),
                UnknownVehicle: getBoolean(payload['UnknownVehicle']),
                ADFailure: getBoolean(payload['ADFailure']),
                pin14: getBoolean(payload['pin14']),
                pin15: getBoolean(payload['pin15']),
                pin16: getBoolean(payload['pin16']),
            })
        } else if (topic === weightTopic) {
            console.log("Weight Topic is : " + payload);
            let weight = payload['SignOfWeight'] + payload['Weight'];
            setWeight(weight)
        } else if (topic === errorStatusTopic) {
            console.log(payload);
            setDialogValue({
                title: "Error",
                content: payload['ErrorMessage'],
                command: "Status"
            });
            setOpen(true);
        }
    }

    const switchoutputHandler = (event) => {
        let { name, value } = event.target;
        value = event.target.checked;

        let position = Object.keys(outputState).indexOf(name) + 1;
        console.log(position);
        setOutputState({
            ...outputState,
            [name]: value,
        });
        if (value) {
            setSwitchLabel({
                ...switchLabel,
                [name]: "FON",
            });
        } else{
            setSwitchLabel({
                ...switchLabel,
                [name]: "",
            });
        }
        MqttService.publish(client, controlTopic, position + "," + value)
    };

    const handleReset = () => {
        MqttService.publish(client, controlTopic, "RESET")
    }
    
    const subHandler = (topic) => {
        console.log(topic);
        if (topic === inputTopic) {
            setSubscribed({
                ...subscribed,
                input : true
            });
        } else if (topic === outputTopic) {
            setSubscribed({
                ...subscribed,
                output : true
            }); 
        } else if (topic === weightTopic) {
            setSubscribed({
                ...subscribed,
                weight : true
            });
        } 
    }

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        const mqttClient = MqttService.getclient()
        setClient(mqttClient);
        MqttService.subscribe(mqttClient, inputTopic, subHandler)
        MqttService.subscribe(mqttClient, outputTopic, subHandler)
        MqttService.subscribe(mqttClient, weightTopic, subHandler)
        MqttService.subscribe(mqttClient, errorStatusTopic, subHandler)
        MqttService.publish(mqttClient, commandTopic,"Initiate")
        const callBack = (mqttMessage, topic) => handleMessage(mqttMessage, topic);
        MqttService.onMessage(mqttClient, callBack);
        return () => {
            console.log("Inside unmount");
            MqttService.publish(mqttClient, commandTopic,"Terminate")
            MqttService.closeConnection(mqttClient);
        }
    }, []);

    return(
        <Stack direction={'column'} sx={{ height: '90%' }} spacing={4} paddingTop={2}>
            <Typography variant='h5' fontWeight={700} paddingLeft={2} marginTop={2}>
                System Status 
            </Typography>
            <Divider sx={{ backgroundColor: '#006A71', opacity: 1, height: 4}}/>
            <Grid container direction={'row'} justifyContent={'center'} >
                <Grid container direction={'column'} justifyContent={'space-evenly'} width={1/3}>
                    <Grid container direction={'row'}>
                        <Typography variant='h6' fontWeight={700} width={1/3} align={'center'}>Sl.No</Typography>
                        <Typography variant='h6' fontWeight={700} width={1/3}>Input Details</Typography>
                        <Typography variant='h6' fontWeight={700}>Status</Typography>
                    </Grid>
                    <Grid container direction={'row'} mt={0.5}>
                        <Typography variant='body1' width={1/3} align={'center'}>1</Typography>
                        <Typography variant='body1' width={1/3}>Track Switch 1A</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.TrackSwitch1A}/>}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>2</Typography>
                        <Typography variant='body1' width={1/3}>Track Switch 1B</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.TrackSwitch1B}/>}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>3</Typography>
                        <Typography variant='body1' width={1/3}>Track Switch 2A</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.TrackSwitch2A}/>}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>4</Typography>
                        <Typography variant='body1' width={1/3}>Track Switch 2B</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.TrackSwitch2B}/>}/>
                    </Grid>
                    <Grid  container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>5</Typography>
                        <Typography variant='body1' width={1/3}>Track Switch 3B</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.TrackSwitch3B} />}/>
                        
                    </Grid>
                    <Grid  container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>6</Typography>
                        <Typography variant='body1' width={1/3}>Track Switch 3A</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.TrackSwitch3A} />}/>
                        
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>7</Typography>
                        <Typography variant='body1' width={1/3}>Track Switch 4B</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.TrackSwitch4B} />}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>8</Typography>
                        <Typography variant='body1' width={1/3}>Track Switch 4A</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.TrackSwitch4A} />}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>9</Typography>
                        <Typography variant='body1' width={1/3}>Start Weigh</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.StartWeigh} />}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>10</Typography>
                        <Typography variant='body1' width={1/3}>End Weigh</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.EndWeigh} />}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>11</Typography>
                        <Typography variant='body1' width={1/3}>AOS In Dir 5A</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.Aos_In_Dir_5A} />}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>12</Typography>
                        <Typography variant='body1' width={1/3}>AOS In Dir 5B</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.Aos_In_Dir_5B} />}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>13</Typography>
                        <Typography variant='body1' width={1/3}>AOS Out Dir 6B</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.Aos_Out_Dir_6B} />}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>14</Typography>
                        <Typography variant='body1' width={1/3}>AOS Out Dir 6A</Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.Aos_Out_Dir_6A} />}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>15</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.pin15} />}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>16</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={inputState.pin16} />}/>
                    </Grid>
                </Grid>
                <Grid container direction={'column'} width={1/3}>
                    <Grid container direction={'row'}>
                        <Typography variant='h6' fontWeight={700} width={1/3} align={'center'}>Sl.No</Typography>
                        <Typography variant='h6' fontWeight={700} width={1/3}>Output Details</Typography>
                        <Typography variant='h6' fontWeight={700}>Status</Typography>
                    </Grid>
                    <Grid container direction={'row'} mt={0.5}>
                        <Typography variant='body1' width={1/3} align={'center'}>1</Typography>
                        <Typography variant='body1' width={1/3}>System Ready (Relay)</Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.SystemReady} name="SystemReady" onChange={switchoutputHandler} />} 
                            label={switchLabel.SystemReady} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>2</Typography>
                        <Typography variant='body1' width={1/3}>Overspeed Lamp (Relay)</Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.OverSpeedLampRelay} name="OverSpeedLampRelay" onChange={switchoutputHandler}/>}
                            label={switchLabel.OverSpeedLampRelay} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>3</Typography>
                        <Typography variant='body1' width={1/3}>Alarm Hooter</Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.AlarmHooter} name="AlarmHooter" onChange={switchoutputHandler}/>}
                            label={switchLabel.AlarmHooter} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>4</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.pin4} name="pin4" onChange={switchoutputHandler}/>}
                            label={switchLabel.pin4} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>5</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.pin5} name="pin5" onChange={switchoutputHandler}/>}
                            label={switchLabel.pin5} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>6</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.pin6} name="pin6" onChange={switchoutputHandler}/>}
                            label={switchLabel.pin6} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>7</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.pin7} name="pin7" onChange={switchoutputHandler}/>} 
                            label={switchLabel.pin7} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>8</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.pin8} name="pin8" onChange={switchoutputHandler}/>}
                            label={switchLabel.pin8} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>9</Typography>
                        <Typography variant='body1' width={1/3}>System Ready Lamp</Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.SystemReadyLamp} name="SystemReadyLamp" onChange={switchoutputHandler}/>}
                            label={switchLabel.SystemReadyLamp} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>10</Typography>
                        <Typography variant='body1' width={1/3}>Overspeed Lamp</Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.OverSpeedLamp} name="OverSpeedLamp" onChange={switchoutputHandler}/>}
                            label={switchLabel.OverSpeedLamp} sx={{ color: 'green' }}/>
                        
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>11</Typography>
                        <Typography variant='body1' width={1/3}>Advance Overspeed Lamp</Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.AdvanceOverSpeedLamp} name="AdvanceOverSpeedLamp" onChange={switchoutputHandler}/>}
                            label={switchLabel.AdvanceOverSpeedLamp} sx={{ color: 'green' }}/>
                        
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>12</Typography>
                        <Typography variant='body1' width={1/3}>Unknown Vechicle</Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.UnknownVehicle} name="UnknownVehicle" onChange={switchoutputHandler}/>}
                            label={switchLabel.UnknownVehicle} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>13</Typography>
                        <Typography variant='body1' width={1/3}>AD Failure</Typography>
                        <FormControlLabel name="ADFailure" control={<SwitchStyle checked={outputState.ADFailure} name="ADFailure" onChange={switchoutputHandler}/>}
                            label={switchLabel.ADFailure} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>14</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.pin14} name="pin14" onChange={switchoutputHandler}/>}
                            label={switchLabel.pin14} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>15</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.pin15} name="pin15" onChange={switchoutputHandler}/>}
                            label={switchLabel.pin15} sx={{ color: 'green' }}/>
                    </Grid>
                    <Grid container direction={'row'} mt={1}>
                        <Typography variant='body1' width={1/3} align={'center'}>16</Typography>
                        <Typography variant='body1' width={1/3}></Typography>
                        <FormControlLabel control={<SwitchStyle checked={outputState.pin16} name="pin16" onChange={switchoutputHandler}/>}
                            label={switchLabel.pin16} sx={{ color: 'green' }}/>
                    </Grid>
                </Grid>
            </Grid>
            <Stack direction={'row'} aligns={'center'} justifyContent={'space-around'} paddingTop={3}>
                <Typography variant='body1'>Weight : {weight}</Typography>
                <Button variant='contained' onClick={handleReset} sx={{ 
                    width: 200,
                    height: 55,
                    backgroundColor: '#093545',
                    borderRadius: 2.5,
                    float: 'right',
                }}>RESET</Button>
            </Stack>
            <WarningDialog 
                open={open}
                onClose={handleClose}
                value={dialogValue}
            />
        </Stack>
    )
}

export default Status;