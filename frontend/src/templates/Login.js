import React, { useEffect, useState } from 'react';
import loginbackground from '../asserts/background.jpg'
import axios from 'axios'
import { Autocomplete, Grid, Stack, Button, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const myStyle={
    backgroundImage: `url(${loginbackground})`,
    height:'100vh',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
};

const Login = () => {

    const [weighbridgeid, setweighbridgeid] = useState({
        'wgid': [],
    });

    const url = "";
    // const url = "http://localhost:8000";

    const [cred, setCred] = useState ({
        "username": '',
        "password": '',
        "wgid": '',
    });

    const navigate = useNavigate();

    const fetchData = () => {
        axios.get(url + "/getwgid/").then((response) => {
            let wgids = [];
            response.data.forEach(wgid1 => {
                wgids.push(wgid1['wgid']);
            });
            console.log(wgids);
            setweighbridgeid({ 'wgid' : wgids });
        });
    }
    useEffect(() => {
        // calling fetch data function to get WeighBride ids from server and load to autocomplete component
        fetchData();
    },[])

    const handleUsername = () => (event) => {
        // console.log(event.target.value);
        setCred({...cred,
            "username": event.target.value
        });
    }

    const handlepassword = () => (event) => {
        setCred({...cred,
            "password": event.target.value
        });
    }

    const handlewgid = () => (event, value) => {
        setCred({...cred,
            "wgid": value
        });
    }

    const submit_login = () => {
        console.log(cred.username);
        if (cred.wgid === "") {
            toast.warn("Please Select Weigh Bridge ID", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            axios.post(url + '/login/', {
                username: cred.username,
                password: cred.password,
            })
            .then(function (response) {
                console.log(response.data);
                if(response.data === "Invalid login details" || response.data === "Your account is disabled"){
                    toast.error(response.data, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    navigate("/", { state : { username : cred.username,  wgid: cred.wgid, password: cred.password }});
                    // navigate("/", { state : cred.username });
                }
                
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    return(
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={myStyle}
            >
            {/* <Grid item xs={3} > */}
                <Stack direction={'column'} spacing={5} padding={5} sx={{
                    width: { sm: 250, md: 380, lg: 450},
                    borderRadius: 7,
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,.46)'
                }}>
                    <Stack direction={'column'} alignItems={'center'} spacing={0} >
                        <Typography color={'white'} variant="h3">Sign In</Typography>;
                        <Typography color={'white'} variant="subtitle1">Sign in and start monitoring your rakes!</Typography>
                    </Stack>
                    
                    <TextField autoComplete='off' InputLabelProps={{shrink: false}}
                        sx={{
                            width: '70%',
                            borderRadius: 2.5,
                            "& .MuiInputBase-root": {
                                height: 45,
                            },
                            background: 'rgba(181, 250, 176, 0.5)',
                            input: {
                                "&::placeholder": {
                                   opacity: 1,
                                },
                            },
                        }}
                        id="username"
                        placeholder="Admin"
                        onChange={handleUsername()}
                    />
                    <TextField autoComplete='off' InputLabelProps={{shrink: false}}
                        sx={{
                            width: '70%',
                            "& .MuiInputBase-root": {
                                height: 45
                            },
                            borderRadius: 2.5,
                            background: 'rgba(181, 250, 176, 0.5)',
                            input: {
                                "&::placeholder": {
                                   opacity: 1,
                                },
                            },
                        }}
                        id="password"
                        placeholder="Password"
                        type={'password'}
                        onChange={handlepassword()}
                    />
                    <Autocomplete
                        freeSolo
                        id="weighbridgeid"
                        options={weighbridgeid.wgid}
                        onChange={handlewgid()}
                        sx={{
                            width: '70%',
                            "& .MuiInputBase-root": {
                                height: 45,
                                alignContent: 'center',
                            },
                            background: 'rgba(181, 250, 176, 0.5)',
                            borderRadius: 2.5,
                            input: {
                                "&::placeholder": {
                                   opacity: 1,
                                },
                                color: '#000'
                            },
                        }}
                        renderInput={(params) => 
                            <TextField {...params} InputLabelProps={{shrink: false}} placeholder="WeighBridge ID" sx={{
                                display: 'inline-flex',
                                alignContent: 'center',}} />
                        }
                    />
                    <Button variant="contained" id="loginButton" onClick={submit_login}
                        sx={{
                            width: '70%',
                            borderRadius: 2.5,
                            "& .MuiInputBase-root": {
                                height: 45,
                            },
                            background: '#B5FAB0',
                            color: '#000',
                        }}>Login</Button>
                </Stack>
            {/* </Grid>    */}
            
        </Grid> 
        
    );
}

export default Login;