import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel,
    Switch,
    TextField,
    Typography,
    Grid
} from "@mui/material";
import API_BASE_PATH from '../../apiConfig';
import {
    formatPhone,
    isValidEmail,
    formatPostalCode,
    isValidPhoneNumber,
    isValidPostalCode,
    checkUsername, validatePassword
} from "../resources/utils";
import NotificationDialog from "../resources/Notification";
import {blue} from "@mui/material/colors";
import CircularProgress from '@mui/joy/CircularProgress';
import {useNavigate} from "react-router-dom";
import "./styles.css";

const SignupForm = () => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isPostalValid, setIsPostalValid] = useState(true);
    const [isUserValid, setIsUserValid] = useState(true);
    const [isOhipValid, setIsOhipValid] = useState(true);
    const [isaddressValid, setIsAddressValid] = useState(true);
    const [isClinicNameValid, setIsClinicNameValid] = useState(true);
    const [passwordmatch, setPasswordmatch] = React.useState(true);
    const [passwordError, setPasswordError] = useState('');

    const [userNameNotice, setUserNameNotice] = useState('');

    const [open, setOpen] = useState(true);
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [openAgreementPopup, setOpenAgreementPopup] = useState(false);
    const [termsInfo, settermsInfo] = useState(null);
    const [progress, setProgress] = useState(0);

    // NotificationDialog
    const [openModal, setOpenModal] = useState(false);
    const [isError, setIsError] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [submitbutton, setSubmitbutton] = useState(true);
    const [successSignup, setSuccessSignup] = useState(false);
    const navigate = useNavigate();
    const [updatedInfo, setUpdatedInfo] = useState({
        address: '',
        city: '',
        postal: '',
        phone: '',
        email: '',
        clinicname: '',
        ohip: '',
        username: '',
        password: '',
        password1: ''
    });

    useEffect(() => {
        handelpassword();
    }, [updatedInfo.password, updatedInfo.password1]);

    const handleClose = () => {
        setOpen(false);
        navigate(`/`);

        window.location.reload();

    };

    const handleSignup = async () => {

        setSubmitbutton(false);

        try {
            const response = await fetch(`${API_BASE_PATH}/create-clinic/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: updatedInfo.username,
                    first_name: updatedInfo.clinicname,
                    last_name: updatedInfo.clinicname,
                    email: updatedInfo.email,
                    phone: updatedInfo.phone,
                    address: updatedInfo.address,
                    city: updatedInfo.city,
                    password: updatedInfo.password,
                    password1: updatedInfo.password1,
                    province: 'ON',
                    postal: updatedInfo.postal,
                    clinic_name: updatedInfo.clinicname,
                    ohip: updatedInfo.ohip,
                }),
            });
            const data = await response.json();


            if (data.status === 'success') {
                setSubmitbutton(true);
                handleSuccess(data.message);
                setSuccessSignup(true);
                setUpdatedInfo({
                    address: '',
                    city: '',
                    postal: '',
                    phone: '',
                    email: '',
                    clinicname: '',
                    ohip: '',
                    username: '',
                    password: '',
                    password1: ''
                })
            } else {
                setSubmitbutton(true);
                handleFailure(data.message);
                // console.error('Error creating staff:', error);
            }
        } catch (error) {
            setSubmitbutton(true);

            handleFailure("Something Went Wrong!, please try again later");
        }


        if (successSignup === true) {
            navigate("http://localhost:8000");
        }
        if (successSignup === true) {
            window.location.href = "http://localhost:8000";
        }
    };


    const handleAgreementChange = (event) => {
        setAgreementChecked(!agreementChecked);
        if (agreementChecked === false) {
            setProgress(100);

        } else if (agreementChecked === true) {
            setProgress(85.72);
        }
    };

    const handleAgreementClick = () => {

        const fetchClinicInfo = async () => {
            if (!termsInfo) {
                try {
                    const response = await fetch(`${API_BASE_PATH}/agreement-terms/Join/`);

                    const data = await response.json();
                    settermsInfo(data.message.agreement);
                } catch (error) {
                    console.error('Error fetching clinic information:', error);
                }
            }
        };
        fetchClinicInfo();
        setOpenAgreementPopup(true);
    };

    const handleCloseAgreementPopup = () => {
        setOpenAgreementPopup(false);
    };

    const handleEmailChange = (value) => {
        setEmail(value.toLowerCase());
        // Validate email format
        const isValid = isValidEmail(value.toLowerCase());
        setIsEmailValid(isValid);
    };

    const handelPhoneChange = (value) => {
        setIsPhoneValid(isValidPhoneNumber(value));
    }

    const handlePostalChange = (value) => {
        setIsPostalValid(isValidPostalCode(value))
    }

    useEffect(() => {
        if (updatedInfo.username.length > 4) {
            handleUsernameChange(updatedInfo.username);
            setUserNameNotice('');

        } else if (updatedInfo.username === "") {
            setIsUserValid(true);
        } else {
            setUserNameNotice('should be greater than 4 characters');
            setIsUserValid(false);
        }
    }, [updatedInfo.username]);

    const handleUsernameChange = async (value) => {

        try {
            const response = await checkUsername(value);
            const data = response.data;
            console.log(data);
            if (data.status === 'success') {
                if (data.available === true) {
                    setIsUserValid(true);
                    setUserNameNotice('Available');
                } else if (data.available === false) {
                    setIsUserValid(false);
                    setUserNameNotice('Username is not Available');
                }
            } else if (data.status === 'failed') {
                handleFailure(data.message);
            }
        } catch (error) {
            handleFailure(`error:${error}`);
        }
    };

    const handleInputChange = (field, value) => {
        // Apply any necessary formatting methods
        let formattedValue = value;
        if (field === 'phone' || field === 'alternative_phone') {
            formattedValue = formatPhone(value);
            handelPhoneChange(formattedValue)
        } else if (field === 'email') {
            formattedValue = value.toLowerCase();
            handleEmailChange(formattedValue);
        } else if (field === 'postal') {
            formattedValue = formatPostalCode(value);
            handlePostalChange(formattedValue);
        } else if (field === 'city') {
            formattedValue = value;
        } else if (field === 'version_code') {
            formattedValue = value.toUpperCase();
        } else if (field === 'username') {
            // handleUsernameChange(value);

        } else if (field === 'ohip') {
            if (value.length >= 6) {
                setIsOhipValid(true);
            } else {
                setIsOhipValid(false);
            }
        } else if (field === 'clinicname') {
            if (value.length >= 4) {
                setIsClinicNameValid(true);
            } else {
                setIsClinicNameValid(false);
            }
        }


        setUpdatedInfo((prevInfo) => ({
            ...prevInfo,
            [field]: formattedValue,
        }));
    };

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

    const handelpassword = () => {
        if (validatePassword(updatedInfo.password, updatedInfo.password1) && (updatedInfo.password === updatedInfo.password1)) {
            setPasswordmatch(true);
            setPasswordError("Password did matchd");
        } else if
        (updatedInfo.password === "" || updatedInfo.password1 === "") {
            setPasswordmatch(true);
            setPasswordError("Password did matchd");
        } else {
            setPasswordError("Password did not match");
            setPasswordmatch(false);
        }
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent className="custom-scrollbar">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="Clinic Name"
                                type="text"
                                fullWidth
                                value={updatedInfo.clinicname}
                                onChange={(e) => handleInputChange('clinicname', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin={"dense"}
                                label="Username"
                                type="text"
                                fullWidth
                                value={updatedInfo.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                error={!isUserValid}
                                helperText={!isUserValid ? userNameNotice : userNameNotice}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="Email Address"
                                variant="outlined"
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                value={updatedInfo.email}
                                fullWidth
                                error={!isEmailValid}
                                type="email"
                                helperText={!isEmailValid ? 'Invalid email address' : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                label="Phone"
                                type="text"
                                fullWidth
                                value={updatedInfo.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                helperText={!isPhoneValid ? 'Invalid phone number' : ''}
                                error={!isPhoneValid}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                label="Address"
                                value={updatedInfo.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                inputMode="text"
                                placeholder="Address"
                                fullWidth
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoFocus
                                label="City"
                                value={updatedInfo.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                inputMode="text"
                                placeholder="City"
                                fullWidth
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoFocus
                                label="Postal - XXX-XXX"
                                value={updatedInfo.postal}
                                onChange={(e) => handleInputChange('postal', e.target.value)}
                                inputMode="text"
                                placeholder="Postal - XXX-XXX"
                                fullWidth
                                type="text"
                                helperText={!isPostalValid ? 'Invalid postal code' : ''}
                                error={!isPostalValid}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                label="Primary Doctor's OHIP Billing number"
                                value={updatedInfo.ohip}
                                onChange={(e) => handleInputChange('ohip', e.target.value)}
                                inputMode="text"
                                placeholder="Primary Doctor's OHIP Billing number"
                                fullWidth
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                style={{marginTop: '8px'}}
                            >
                                Please note that we are using this OHIP Billing number just during Health-Card
                                Validation. We do not share any information related to clinic or patient with anyone.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Password"
                                name="newndpassword"
                                value={updatedInfo.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                fullWidth
                                type="password"
                                helperText={!passwordmatch ? passwordError : ''}
                                error={!passwordmatch}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Repeat Password"
                                name="repeat Password"
                                value={updatedInfo.password1}
                                onChange={(e) => handleInputChange('password1', e.target.value)}
                                fullWidth
                                type="password"
                                helperText={!passwordmatch ? passwordError : ''}
                                error={!passwordmatch}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={agreementChecked}
                                        onChange={handleAgreementChange}
                                        name="agreement"
                                        color="primary"
                                    />
                                }
                                label="I agree to the terms and conditions."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography onClick={handleAgreementClick} style={{cursor: 'pointer'}}>
                                View Terms and Conditions
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSignup} color="primary" variant={"contained"}
                            disabled={
                                !isEmailValid || !isEmailValid || !isPostalValid || !isUserValid || !isPhoneValid || !isClinicNameValid || !isOhipValid || !agreementChecked
                            }
                    >
                        Sign Up
                    </Button>
                </DialogActions>
                <Dialog open={openAgreementPopup} onClose={handleCloseAgreementPopup}>
                    <DialogTitle>Terms and Conditions</DialogTitle>
                    <DialogContent className={"custom-scrollbar"}>
                        <div dangerouslySetInnerHTML={{__html: termsInfo}}/>
                    </DialogContent>
                </Dialog>
            </Dialog>
            <NotificationDialog
                open={openModal}
                onClose={setOpenModal}
                content={modalContent}
                isError={isError}

            />
            {!submitbutton && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 900000
                }}>
                    <CircularProgress size="lg" variant="solid" value={70} color="primary"/>
                </div>
            )}
        </>
    );
};

// export default SignupForm;

export {SignupForm};