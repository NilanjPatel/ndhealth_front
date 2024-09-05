
import API_BASE_PATH from '../../../../apiConfig';


import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    CardHeader,

    Button,

    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import NotificationDialog from '../../../resources/Notification';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxWidth: '100%',
    },
}));



const Specified = ({ clinicSlug, clinicId }) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [timeThreshold, setTimeThreshold] = useState('');
    const [bookCode, setBookCode] = useState('');
    const [cancelCode, setCancelCode] = useState('');
    const [todoCode, setTodoCode] = useState('');
    const [emailCode, setEmailCode] = useState('');
    const [billCode, setBillCode] = useState('');
    const [hereCode, setHereCode] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [timezone, setTimezone] = useState('');
    const [settingID, setSettingID] = useState('');
    const [appointmentDateFormat, setAppointmentDateFormat] = useState('');
    const [appointmenttimeFormat, setAppointmenttimeFormat] = useState('');
    const [clinicData, setClinicData] = useState({});

    // NotificationDialog
    const [openModal, setOpenModal] = useState(false);
    const [isError, setIsError] = useState(false);
    const [modalContent, setModalContent] = useState('');

    

    useEffect(() => {
        // Fetch clinic notices

        const fetchClinicApis = async () => {
            try {
                const response = await fetch(`${API_BASE_PATH}/clinic/data/settings/`,

                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Token ${localStorage.getItem('accessToken')}`,
                        }
                    });
                const data = await response.json();

                setTimeThreshold(data[0].timeThreshold);
                setBookCode(data[0].bookCode);
                setCancelCode(data[0].cancelCode);
                setTodoCode(data[0].todoCode);
                setEmailCode(data[0].emailCode);
                setHereCode(data[0].hereCode);
                setBillCode(data[0].billCode);
                // setTimezone(data[0].timezone);
                setConfirmCode(data[0].confirmCode);
                setSettingID(data[0].id);
                setIsDataLoaded(true);

            } catch (error) {
                console.error('Error fetching clinic notices:', error);
            }
        };


        fetchClinicApis();
    }, []);

    const handleTimeThresholdChange = (event) => {
        setTimeThreshold(event.target.value);
    }

    const handleBookCodeChange = (event) => {
        setBookCode(event.target.value);
    }

    const handleCancelCodeChange = (event) => {
        setCancelCode(event.target.value);
    }

    const handleTodoCodeChange = (event) => {
        setTodoCode(event.target.value);
    }

    const handleEmailCodeChange = (event) => {
        setEmailCode(event.target.value);
    }

    const handleBillCodeChange = (event) => {
        setBillCode(event.target.value);
    }

    const handleHereCodeChange = (event) => {
        setHereCode(event.target.value);
    }

    const handleConfirmCodeChange = (event) => {
        setConfirmCode(event.target.value);
    }

    const handleTimezoneChange = (event) => {
        setTimezone(event.target.value);
    }

    const handleAppointmentDateFormatChange = (event) => {
        setAppointmentDateFormat(event.target.value);
    }

    const handleAppointmenttimeFormatChange = (event) => {
        setAppointmenttimeFormat(event.target.value);
    }

    const handleClinicDataChange = (event) => {
        setClinicData(event.target.value);
    }

    const updateClinicApi = async () => {
        try {
            const response = await fetch(`${API_BASE_PATH}/clinic/data/settings/update/`,

                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({
                        timeThreshold: timeThreshold,
                        bookCode: bookCode,
                        cancelCode: cancelCode,
                        todoCode: todoCode,
                        emailCode: emailCode,
                        billCode: billCode,
                        hereCode: hereCode,
                        confirmCode: confirmCode,
                        id: settingID
                        // ,
                        // timezone: timezone

                    }),

                });
            const data = await response.json();
            handleSuccess('Clinic Booking Settings Successfully Updated.')
        } catch (error) {
            handleFailure('Error Updating Clinic Booking Settings. Please Try Again.')
            console.error('Error fetching clinic notices:', error);
        }

    };


    // NotificationDialog
    const handleSuccess = (message) => {
        setModalContent(message);
        setIsError(false);
        setOpenModal(true);
    };
    const handleFailure = (message) => {
        setModalContent(message);
        setIsError(true);
        setOpenModal(true);
    };



    return (
        <div>

            {isDataLoaded ? (

                <div>
                    <Grid container style={{ background: 'transparent' }}>
                        {/* <Grid item xs={12} md={12}> */}
                        <Card style={{ width: 'fit-content', minWidth: '50rem', margin: 4 }}>
                            <Grid style={{ padding: '1rem' }}>
                                <TextField
                                    label="Threshold Time of Appointment Cancelation"
                                    placeholder="Threshold Time"
                                    value={timeThreshold}
                                    onChange={handleTimeThresholdChange}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                />
                            </Grid>

                            {/* <Grid style={{ padding: '1rem' }}>
                                <TextField
                                    label="Clinic Time Zone"
                                    placeholder='Clinic Time Zone'
                                    value={timezone}
                                    onChange={handleTimezoneChange}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                />
                            </Grid> */}

                            <Grid style={{ padding: '1rem' }}>
                                <TextField
                                    label="Todo Code"
                                    placeholder='Todo Code'
                                    value={todoCode}
                                    onChange={handleTodoCodeChange}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid style={{ padding: '1rem' }}>
                                <TextField
                                    label="Here Code"
                                    placeholder='Here Code'
                                    value={hereCode}
                                    onChange={handleHereCodeChange}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid style={{ padding: '1rem' }}>
                                <TextField
                                    label="Email Code"
                                    placeholder="Email Code"
                                    value={emailCode}
                                    onChange={handleEmailCodeChange}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid style={{ padding: '1rem' }}>
                                <TextField
                                    label="Confirm Code"
                                    placeholder='Confirm Code'
                                    value={confirmCode}
                                    onChange={handleConfirmCodeChange}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid style={{ padding: '1rem' }}>
                                <TextField
                                    label="Cancel Code"
                                    placeholder='Cancel Code'
                                    value={cancelCode}
                                    onChange={handleCancelCodeChange}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid style={{ padding: '1rem' }}>
                                <TextField
                                    label="Book Code"
                                    placeholder='Book Code'
                                    value={bookCode}
                                    onChange={handleBookCodeChange}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid style={{ padding: '1rem' }}>
                                <TextField
                                    label="Bill Code"
                                    placeholder='Bill Code'
                                    value={billCode}
                                    onChange={handleBillCodeChange}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                />
                            </Grid>


                            <Grid style={{ padding: '1rem' }}>
                                <Button
                                    variant='outlined'
                                    color='primary'
                                    type='submit'
                                    onClick={updateClinicApi}
                                >
                                    Update
                                </Button>
                            </Grid>


                        </Card>
                        {/* </Grid> */}

                    </Grid>
                </div>
            ) : (
                <div>
                    <Card>
                        <CardHeader title="Loading..." />
                    </Card>
                </div>
            )
            }

            <NotificationDialog
                open={openModal}
                onClose={setOpenModal}
                content={modalContent}
                isError={isError}

            />

        </div >
    );

};

export default Specified;