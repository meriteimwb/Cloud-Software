import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { AppBar, IconButton, Toolbar, Typography, Box, Tooltip, Menu, MenuItem, Divider, ListItemIcon, Avatar, Stack } from '@mui/material';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import axios from 'axios'
import WarningDialog from '../components/WarningDialog';
import { toast } from 'react-toastify';


const NavigationBar = () => {
    const {state} = useLocation();
    const navigate = useNavigate();
    // const { username } = state; // Read values passed on state
    let adminButtonText = "Admin";
    const settings = ['Profile', 'Settings', 'Logout'];
    const url = "";
    // const url = "http://localhost:8000";
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        title: "",
        content: "",
        command: "",
    })

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (value) => {
        setAnchorEl(null);
        // console.log(value);
        if (value === "Version") {
            setDialogOpen(false);
        }
    };

    if (state !== null) {
        console.log(state.username);
        adminButtonText = state.username;
    }

    const returnHome = () => (component) => {
        if (state !== null) {
            navigate("/", { state : { username : state.username, wgid: state.wgid, password: state.password }});
        }
    }

    const handleProfile = () => {
        let content;
        axios.get(url + "/version/", {
            params: { wgid: state.wgid },
        }).then((response) => {
            console.log(response.data);
            if (response.data === 'Fail') {
                toast.error("Try Again", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                console.log(response.data[0]);
                setDialogValue({
                    title: "Railwagon Weighing System",
                    content: [response.data[0].wg_ver, response.data[0].wgReleaseDate,response.data[0].scada_ver, response.data[0].scadaReleaseDate,response.data[0].cloud_ver, response.data[0].cloudReleaseDate],
                    command: "Version"
                })
            }
        });
        
    }

    const handleSettings = () => {
        if (state !== null) {
            console.log("Inside Settings");
            navigate("/settings", { state : { username : state.username, wgid: state.wgid, password: state.password }});
        }
    }

    useEffect(() => {
        if (dialogValue.title !== "") {
            setDialogOpen(true)
        }
    }, [dialogValue])

    const handlelogout = (component) => {
        axios.post(url + '/logout/', {
            username: state.username,
        })
        .then(function (response) {
            // console.log(response.data);
            navigate("/login/", { state : { username : "", wgid: "", password: "" }});
        })
        .catch(function (error) {
            console.log(error);
        });
    } 

    return (
        <AppBar position="static" sx={{ height: '7.5%' }} >
            <Toolbar >
                <IconButton onClick={returnHome()}>
                    <HomeOutlined />
                </IconButton>
                <Typography variant="h6" component="div" color={ 'black' } sx={{ flexGrow: 1 }}>
                    Home
                </Typography>
                <Box>
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                            <Typography variant='subtitle1'  color={ 'black' } > { adminButtonText }</Typography>
                        </IconButton>
                    </Tooltip>
                    {/* <Button sx={{color:'#000'}} >{ adminButtonText }</Button> */}
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                        <MenuItem onClick={handleProfile}>
                            <Avatar /> Profile
                        </MenuItem>
                        {/* <Divider /> */}
                        <MenuItem onClick={handleSettings}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handlelogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
                {/* <Button sx={{color:'#000'}} onClick={handlelogout}>{ adminButtonText }</Button> */}
            </Toolbar>
            <WarningDialog 
                open={dialogOpen}
                onClose={handleClose}
                value={dialogValue}
            />
        </AppBar>
    )
}

export default NavigationBar;