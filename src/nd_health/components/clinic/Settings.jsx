// clinichome
// src/components/clinicInfo.js
import React, { useState, useEffect, useRef } from 'react';
import { ReactNode, SyntheticEvent } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Routes, useLocation } from 'react-router-dom';

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import { Grid, Card, CardContent, Typography, CardHeader, Box, Tab, } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import '../css/Marquee.css';

import Notice from './settings_components/Notice';
import ClinicSettings from './settings_components/ClinicSettings';
import HelmetComponent from '../SEO/HelmetComponent';


interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const Settings1 = ({ clinicSlug, clinicId }) => {
    const location = useLocation();
    // const { clinicSlug } = useParams();
    const [clinicInfo, setClinicInfo] = useState(null);
    const [locationsData, setLocations] = useState(null);
    const [buttonpressed, setButtonPressed] = useState(true);
    const navigate = useNavigate();

    const pathSegments = location.pathname.split('/');

    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const dobRef = useRef(null);


    const [value, setValue] = React.useState(0);




    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    useEffect(() => {

    }, [clinicSlug]);

    const handleCloseModal = () => {
        setOpenModal(false);
    };


    return (
        <>
            <div>
                {(() => {
                    if (clinicSlug) {
                        return (
                            <div>
                                <Grid container>
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            // maxWidth: { xs: 320, sm: 480, md: 420 },
                                            bgcolor: 'background.paper',
                                            mx: 'auto', // Center the content horizontally
                                            display: 'flex',
                                            flexDirection: 'column', // Optional: Align children in a column
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            variant="scrollable"
                                            scrollButtons
                                            aria-label="visible arrows tabs example"
                                            sx={{
                                                [`& .${tabsClasses.scrollButtons}`]: {
                                                    '&.Mui-disabled': { opacity: 0.3 },
                                                },
                                            }}
                                            width="100%"
                                        >
                                            <Tab label="Notice" {...a11yProps(0)} />
                                            <Tab label="Clinic Settings" {...a11yProps(1)} />
                                            {/* <Tab label="Settings" {...a11yProps(2)} /> */}
                                            {/* <Tab label="Item Four" {...a11yProps(3)} /> */}
                                            {/* <Tab label="Item Five" {...a11yProps(4)} /> */}
                                            {/* <Tab label="Item Six" {...a11yProps(5)} /> */}
                                            {/* <Tab label="Item Seven" {...a11yProps(6)} /> */}
                                        </Tabs>
                                    </Box>
                                </Grid>

                                <Grid container spacing={3} padding={3}>
                                    <Grid item xs={12} md={12}>
                                        <TabPanel value={value} index={0}>
                                            <Notice clinicSlug={clinicSlug} clinicId={clinicId} />
                                        </TabPanel>
                                        <TabPanel value={value} index={1}>
                                            <ClinicSettings clinicSlug={clinicSlug} clinicId={clinicId} />
                                        </TabPanel>
                                        <TabPanel value={value} index={2}>
                                            Doctors
                                        </TabPanel>
                                        <TabPanel value={value} index={3}>
                                            Settings
                                        </TabPanel>
                                        <TabPanel value={value} index={4}>
                                            Item Five
                                        </TabPanel>
                                        <TabPanel value={value} index={5}>
                                            Item Six
                                        </TabPanel>
                                        <TabPanel value={value} index={6}>
                                            Item Seven
                                        </TabPanel>
                                    </Grid>
                                </Grid>
                            </div>
                        );
                    } else {
                        return (
                            <Card style={{ padding: '2rem' }}>
                                <Typography variant="h6" gutterBottom>
                                    Wait for a moment to load the website. If it takes too long, please check the url and correct it or contact ndhealth.
                                </Typography>
                            </Card>
                        );
                    }
                })()}
                <HelmetComponent />
            </div>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>{modalContent}</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Settings1;
