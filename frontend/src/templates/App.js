import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WithNavBar from '../components/WithNavBar';
import WithoutNavBar from '../components/WithoutNavBar';

import 'bootstrap/dist/css/bootstrap.css';
import Home from './Home';
import Login from './Login';
import Rake from './Rake';
import EditRake from './EditRake';
import DownloadRake from './DownloadRake';
import WgidSettings from './WgidSettings';
import Weighment from './Weighment';
import Status from './Status';
import Report from './Report';
import UpdateRake from './UpdateRake'
import PrintReport from './PrintReport';
import { ThemeProvider } from '@mui/material';
import MeritTheme from '../components/MeritTheme'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends React.Component{
    constructor (props){
        super(props);
        this.WithNavBar = WithNavBar;
        this.WithoutNavBar = WithoutNavBar;
        this.MeritTheme = MeritTheme;
    }

    render(){
        return(
            <ThemeProvider theme={this.MeritTheme}>
                <ToastContainer />
                <Router>
                    <div>
                        <Routes>
                            <Route element={<this.WithoutNavBar />}>
                                <Route path="/login/" element={<Login />} />
                                <Route path="/print/report" element={<PrintReport />} />
                            </Route>
                            <Route element={<this.WithNavBar />}>
                                <Route path='' element={<Home />} />
                                <Route path='/rake' element={<Rake />} />
                                <Route path='/rake/edit' element={<EditRake />} />
                                <Route path='/rake/download' element={<DownloadRake />} />
                                <Route path='/Weighment' element={<Weighment />} />
                                <Route path='/report' element={<Report />} />
                                <Route path='/system' element={<Status />} />
                                <Route path='/settings' element={<WgidSettings />} />
                                <Route path='/update/rake' element={<UpdateRake />} />
                            </Route>
                        </Routes>
                    </div>
                </Router>
            </ThemeProvider>
        );
    }
}

export default App;