// src/components/clinicInfo.js
import API_BASE_PATH from '../../apiConfig';


 // Adjust the path based on your project structure

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Routes, useLocation } from 'react-router-dom';

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CardActions, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import { Grid, Card, CardContent, Typography, CardHeader } from '@mui/material';
import Layout from './Layout';
import './css/Marquee.css';
import MKTypography from "components/MKTypography";
import MKBox from "../../components/MKBox";
import MKButton from "../../components/MKButton";

const ManageAppointment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const [clinicInfo, setClinicInfo] = useState(null);
    const { clinicSlug } = useParams();
    const { appointmentData, clinicInfo } = location.state || {};
    // const { clinicInfo } = location.state || {};
    const pathSegments = location.pathname.split('/');
    const { cancelAppointment, setCancelAppointment } = useState(false);
    const [homeButton, setHomeButton] = useState(true);
    const [buttonpressed, setButtonPressed] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [openApp, setOpenApp] = useState(false);
    const [notice, setNotice] = useState(null);

    // new changes #TODO
    const [buttonState, setButtonState] = useState({
        homeButton: true,
        buttonPressed: true,
    });
    // end changes


    useEffect(() => {
        const fetchClinicAppointmentPolicy = async () => {
            try {
                const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);

                const data = await response.json();

                if (data.notices) {
                    const notices = data.notices.filter(Boolean).join(' | ');
                    setNotice(notices);
                }

            } catch (error) {
                console.error('Error fetching clinic information:', error);
            }
        };

        fetchClinicAppointmentPolicy();
    }, [clinicSlug]);

    const handleRequest = async (appid) => {
        
        try {

            const response = await fetch(`${API_BASE_PATH}/cancel/${appid}/`);
            const data = await response.json();

            if (!data.status) {
                setOpenModal(true);
                setModalContent('Something went wrong. Please try again later.');
                setHomeButton(true);
                setButtonPressed(true);
            }

            if (data.status === 'success') {
                setModalContent(data.message);
                setOpenModal(true);
                setHomeButton(true);
                setButtonPressed(false);
            }
            else if (data.status === 'failed') {
                setModalContent(data.message);
                setOpenModal(true);
                setHomeButton(true);
                setButtonPressed(true);
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            setOpenModal(true);
            setModalContent('Appointment cancelation failed. Please try again later.');
            setHomeButton(true);
            setButtonPressed(true);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);

    };

    const formatTime = (timeString) => {
        const formattedTime = new Date(`2000-01-01T${timeString}`);
        return formattedTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const redirectHome = () => {
        setOpenApp(false);
        window.location.href = `/clinic/${clinicSlug}/`;
    };

    return (
        <Layout clinicInfo={clinicInfo}>
            <div>

                {clinicInfo ? (
                    <>
                        {notice && (
                            <div className="marquee-container">
                                <div className="marquee-content">
                                    Clinic Notice: {notice}
                                </div>
                            </div>
                        )}
                        <h2></h2>

                        <Card >
                            <CardHeader title={`Information of your appointment at ${clinicInfo.name}`} />
                            {appointmentData.appointment.map((app) => (
                                <Card padding={2}>
                                    <CardContent>
                                        <Grid item >
                                            <label htmlFor="name">Date : {app.appointmentDate}</label>
                                        </Grid>
                                        <Grid item >
                                            <label htmlFor="name">Time : {formatTime(app.startTime)} </label>
                                        </Grid>
                                        <Grid item >
                                            <MKButton
                                                color="primary"
                                                variant="contained"
                                                disabled={!buttonpressed}
                                                onClick={() => handleRequest(app.id)}
                                            // fullWidth
                                            >
                                                Cancel Appointment
                                            </MKButton>
                                        </Grid>
                                    </CardContent>
                                </Card>

                            ))}
                            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid item xs={12} >
                                    <MKButton
                                        color="info"
                                        variant="contained"
                                        disabled={!homeButton}
                                        onClick={redirectHome}
                                        fullWidth
                                    >
                                        Go Home
                                    </MKButton>
                                </Grid>

                            </CardActions>
                        </Card>

                    </>


                ) : (
                    <p>Loading...</p>
                )}

                {/* Modal */}
                <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogTitle>Notification</DialogTitle>
                    <DialogContent>{modalContent}</DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </DialogActions>
                </Dialog>

            </div>
        </Layout>


    );

};


export default ManageAppointment;