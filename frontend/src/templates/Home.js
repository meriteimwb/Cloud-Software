import { Box, Typography, Grid, Stack, Card } from '@mui/material';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import homeImage from '../asserts/home.jpg'


const myStyle={
    backgroundImage: `url(${homeImage})`,
    height:'92.5%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
};

const outerBoxStyle = {
    component:'button',
    width:'605px',
    height:'144px',
    borderRadius:7,
    backgroundColor:'rgba(136, 164, 124, 0.31)',
    border:0,
    paddingLeft:4,
    display:'flex',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const circleBoxStyle = {
    width:'100px',
    height:'100px', 
    borderRadius:'50%',
    backgroundColor:'#A1DD70',
    display:'flex',
    justifyContent:'center', 
    alignItems: 'center',
    boxShadow:'0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)',
}

const textTypography = {
    width: '331px',
    height: '100px',
    textAlign: 'start',
}

const Home = () => {
    const navigate = useNavigate();

    const {state} = useLocation();
    // // const { username } = state; // Read values passed on state
    
    useEffect(() => {
        if (state !== null) {
            console.log(state.wgid);
        } else {
            console.log("Inside redirect");
            navigate("/login", { state : { username : "", wgid: "", password: "" }});
        }
    })
    const navigate_to_next = value => (component) => {
        if (state !== null) {
            if (value === "RAKE") {
                navigate("/rake", { state : { username : state.username,  wgid: state.wgid, password: state.password }});
            } else if (value === "WEIGHMENT") {
                navigate("/Weighment", { state : { username : state.username,  wgid: state.wgid, password: state.password }});
            } else if (value === "REPORT") {
                navigate("/report", { state : { username : state.username,  wgid: state.wgid, password: state.password }});
            } else if (value === "STATUS") {
                navigate("/system", { state : { username : state.username,  wgid: state.wgid, password: state.password }});
            }
        }
    }

    return (

        <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="space-evenly"
            style={myStyle}
            >
            <Box
                sx={{
                    width: { sm: 250, md: 380, lg: 450},
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#169566'
                }}>
                    <Typography variant="h4">MERIT BMH</Typography>
                    <Typography variant="h5">Weigh Bridge application</Typography>
            </Box>
            <Stack direction={'column'} spacing={5} sx={{ 
                    width: { sm: 250, md: 380, lg: 450}, 
                    }}>
                <Card raised sx={{borderRadius: 7}}>
                    <Box component={'button'}
                        width={1}
                        height={100}
                        borderRadius={7}
                        backgroundColor={'rgba(136, 164, 124, 0.31)'}
                        border={0}
                        paddingLeft={4}
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems= 'center'
                        justifyContent= 'space-between'
                        onClick={navigate_to_next("RAKE")}
                    >
                        <Box width={65} 
                            height={65} 
                            borderRadius={'50%'} 
                            backgroundColor={'#A1DD70'} 
                            display={'flex'} 
                            justifyContent='center' 
                            alignItems= 'center'
                            boxShadow={'0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)'}>
                            <Typography variant='subtitle1'>1</Typography>
                        </Box>
                        <Typography variant='h4' sx={{ width: { sm:150, md:220, lg:240}, textAlign: 'start' }}>RAKE</Typography>
                    </Box>
                </Card>
                <Card raised sx={{borderRadius: 7}}>
                    <Box component={'button'}
                        width={1}
                        height={100}
                        borderRadius={7}
                        backgroundColor={'rgba(136, 164, 124, 0.31)'}
                        border={0}
                        paddingLeft={4}
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems= 'center'
                        justifyContent= 'space-between'
                        onClick={navigate_to_next("WEIGHMENT")}
                    >
                        <Box width={65} 
                            height={65} 
                            borderRadius={'50%'} 
                            backgroundColor={'#A1DD70'} 
                            display={'flex'} 
                            justifyContent='center' 
                            alignItems= 'center'
                            boxShadow={'0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)'}>
                            <Typography variant='subtitle1'>2</Typography>
                        </Box>
                        <Typography variant='h4' sx={{ width: { sm:150, md:220, lg:240}, textAlign: 'start' }}>WEIGHMENT</Typography>
                    </Box>
                </Card>
                <Card raised sx={{borderRadius: 7}}>
                    <Box component={'button'}
                        width={1}
                        height={100}
                        borderRadius={7}
                        backgroundColor={'rgba(136, 164, 124, 0.31)'}
                        border={0}
                        paddingLeft={4}
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems= 'center'
                        justifyContent= 'space-between'
                        onClick={navigate_to_next("REPORT")}
                    >
                        <Box width={65} 
                            height={65} 
                            borderRadius={'50%'} 
                            backgroundColor={'#A1DD70'} 
                            display={'flex'} 
                            justifyContent='center' 
                            alignItems= 'center'
                            boxShadow={'0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)'}>
                            <Typography variant='subtitle1'>3</Typography>
                        </Box>
                        <Typography variant='h4' sx={{ width: { sm:150, md:220, lg:240}, textAlign: 'start' }}>REPORT</Typography>
                    </Box>
                </Card>
                <Card raised sx={{borderRadius: 7}}>
                    <Box component={'button'}
                        width={1}
                        height={100}
                        borderRadius={7}
                        backgroundColor={'rgba(136, 164, 124, 0.31)'}
                        border={0}
                        paddingLeft={4}
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems= 'center'
                        justifyContent= 'space-between'
                        onClick={navigate_to_next("STATUS")}
                    >
                        <Box width={65} 
                            height={65} 
                            borderRadius={'50%'} 
                            backgroundColor={'#A1DD70'} 
                            display={'flex'} 
                            justifyContent='center' 
                            alignItems= 'center'
                            boxShadow={'0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)'}>
                            <Typography variant='subtitle1'>4</Typography>
                        </Box>
                        <Typography variant='h4' sx={{ width: { sm:150, md:220, lg:240}, textAlign: 'start' }}>STATUS</Typography>
                    </Box>
                </Card>
            </Stack>
        </Grid>
           
    );
}

export default Home;