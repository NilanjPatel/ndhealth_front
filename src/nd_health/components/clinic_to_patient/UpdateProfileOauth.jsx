// src/components/clinicInfo.js
import API_BASE_PATH from "../../../apiConfig";

import React, {useState, useEffect, useRef} from "react";
import {Link, useLocation} from "react-router-dom";

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CardActionArea,
    Backdrop,
} from "@mui/material";
import {useParams, useNavigate} from "react-router-dom";

import {Grid, Card, CardContent, Typography, CardHeader} from "@mui/material";

import Layout from "nd_health/components/Layout";
import "../../components/css/Marquee.css";
import {
    formatDob,
    formatHin,
    formatPhone,
    formatPostalCode,
    isValidEmail,
    redirectHomeM,
} from "../resources/utils";
import HelmetComponent from "nd_health/components/SEO/HelmetComponent";
import NotificationDialog from "nd_health/components/resources/Notification";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import GoHome from "../resources/GoHome";
import Divider from "@mui/material/Divider";

const UpdateProfileOauth = () => {
    const {clinicSlug} = useParams();
    const [buttonpressed, setButtonPressed] = useState(true);
    const [updatepressed, setUpdatePressed] = useState(true);
    const [gotpatientInfo, setGotpatientInfo] = useState(false);
    const [hin, setHin] = useState("");
    const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
    const dobRef = useRef(null);
    const [clinicInfo, setClinicInfo] = useState(null);
    const [dob, setDob] = useState("");
    const [patientInfo, setpatientInfo] = useState(null);

    const [isEmailValid, setIsEmailValid] = React.useState(true);

    const [updatedInfo, setUpdatedInfo] = useState({
        address: "",
        city: "",
        postal: "",
        phone: "",
        alternative_phone: "",
        email: "",
        version_code: "",
        demo: "",
    });

    useEffect(() => {
        const fetchClinicInfo = async () => {
            try {
                const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);

                const data = await response.json();
                setClinicInfo(data.clinic);
            } catch (error) {
                console.error("Error fetching clinic information:", error);
            }
        };

        if (!clinicInfoFetched) {
            fetchClinicInfo();
            setClinicInfoFetched(true);
        }
    }, [clinicSlug, hin, clinicInfoFetched]);

    const handleHinChange = (e) => {
        const formattedHin = formatHin(e.target.value);
        setHin(formattedHin);

        // Check if the formatted HIN is 12 characters and move focus to the DOB field
        if (formatHin(hin).length === 12 && dobRef.current) {
            dobRef.current.focus();
        }
    };

    const handleRequest = async () => {
        try {
            // Make a request with clinicSlug, hin, and dob
            if (hin === "" || dob === "") {
                handleFailure("Please enter your health-card number and date of birth.");
                setButtonPressed(true);

                return;
            }
            setButtonPressed(false);

            const url = `${API_BASE_PATH}/doctors/${dob.replace(/\//g, "")}/${hin.replace(/\//g, "")}/${clinicSlug}/updateprofile/`;
            const response = await fetch(url);
            // Handle the response as needed

            const data = await response.json();
            if (data.status === "success") {
                setGotpatientInfo(true);
                console.log(`data:${data}`);
                setpatientInfo(data.profile);

                setUpdatedInfo({
                    address: data.profile.address || "",
                    city: data.profile.city || "",
                    postal: data.profile.postal || "",
                    phone: data.profile.phone || "",
                    alternative_phone: data.profile.alternative_phone || "",
                    email: data.profile.email || "",
                    version_code: data.profile.version_code || "",
                    demo: data.profile.demo || "",
                });
                // navigate(`/clinic-forms/${clinicSlug}`, {state: {demo: data.profile, clinicInfo: clinicInfo,}}); // TODO change the demo
            } else if (data.status === "failed") {
                setButtonPressed(true);
                handleFailure(data.message);
            }
        } catch (error) {
            console.error("Error making request:", error, hin);
        } finally {
            setButtonPressed(false);
        }
    };

    // NotificationDialog
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationError, setNotifictionError] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const handleSuccess = (message) => {
        setNotificationMessage(message);
        setNotifictionError(false);
        setOpenNotification(true);
    };
    const handleFailure = (message) => {
        setNotificationMessage(message);
        setNotifictionError(true);
        setOpenNotification(true);
    };

    const handleSubmitCheckIn = async () => {
        setUpdatePressed(false);
        if (isEmailValid) {
            // Add logic to update user information with the provided date of birth (dob)
            // You can make a POST request to the server to update the user's information.
            // Example of making a POST request
            const response = await fetch(`${API_BASE_PATH}/UpdatePatientProfile/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clinicSlug: clinicSlug,
                    address: updatedInfo.address,
                    city: updatedInfo.city,
                    postal: updatedInfo.postal,
                    phone: updatedInfo.phone,
                    alternative_phone: updatedInfo.alternative_phone,
                    email: updatedInfo.email,
                    cs: updatedInfo.version_code,
                    demo: updatedInfo.demo,
                    update: true,
                    type: "profileOnly",
                }),
            });
            const data = await response.json();
            if (data.status === "success") {
                handleSuccess(data.message);
                setUpdatePressed(true);
            } else if (data.status === "failed") {
                handleFailure(data.message);
                setUpdatePressed(true);
            } else {
                handleFailure("Something went wrong, try again!");
                setUpdatePressed(true);
            }
        } else {
            // Email is not valid, handle accordingly (show an Error message, etc.)
            handleFailure("Email is not valid, kindly write valid email address.");
            setUpdatePressed(true);
        }
    };

    const handleEmailChange = (value) => {
        // Validate email format
        const isValid = isValidEmail(value);
        console.log(value, isValid);
        setIsEmailValid(isValid);
    };

    const handleInputChange = (field, value) => {
        // Apply any necessary formatting methods

        let formattedValue = value;
        if (field === "phone" || field === "alternative_phone") {
            formattedValue = formatPhone(value);
        } else if (field === "email") {
            formattedValue = value.toLowerCase();
            handleEmailChange(formattedValue);
        } else if (field === "postal") {
            formattedValue = formatPostalCode(value);
        } else if (field === "city") {
            formattedValue = value;
        } else if (field === "version_code") {
            formattedValue = value.toUpperCase();
        }

        setUpdatedInfo((prevInfo) => ({
            ...prevInfo,
            [field]: formattedValue,
        }));
    };

    const close_userinfo_model = () => {
        window.location.reload();
    };

    const gotoHome = () => {
        setOpenNotification(false);
        redirectHomeM(clinicSlug);
    };

    return (
        <Layout clinicInfo={clinicInfo}>
            <div>
                <HelmetComponent/>

                {clinicInfo ? (
                    <>
                        {/* <h3>Book appointment at {clinicInfo.name}</h3> */}
                        <h3>Update Your Profile</h3>
                        <Card>
                            {/*<Grid item xs={12} md={12}>*/}
                            {/*  <Typography style={{ color: "red", fontSize: "1rem", padding: "0.8rem" }}>*/}
                            {/*    <MKButton*/}
                            {/*      style={{ padding: "0.8rem" }}*/}
                            {/*      onClick={() => redirectHomeM(clinicSlug)}*/}
                            {/*      color="primary"*/}
                            {/*      variant={"contained"}*/}
                            {/*    >*/}
                            {/*      Back*/}
                            {/*    </MKButton>*/}
                            {/*  </Typography>*/}
                            {/*</Grid>*/}
                            <GoHome clinicSlug={clinicSlug}/>
                            <CardHeader
                                title="Verify Your Identity"
                                titleTypographyProps={{style: {fontSize: "1rem", fontWeight: "bold"}}}
                            />

                            <Grid container spacing={2} paddingLeft={2} paddingRight={2} paddingTop={-1}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Health Card Number - 10 digits only"
                                        value={formatHin(hin)}
                                        onChange={handleHinChange}
                                        inputMode="numeric"
                                        placeholder="1234-567-890"
                                        fullWidth
                                        type="tel"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Date of Birth - YYYY-MM-DD"
                                        value={formatDob(dob)}
                                        onChange={(e) => setDob(e.target.value)}
                                        inputMode="numeric"
                                        placeholder="YYYY-MM-DD"
                                        fullWidth
                                        type="tel"
                                        inputRef={dobRef} // Assigning the ref to the Date of Birth field
                                    />
                                </Grid>
                                <Divider/>
                                <Grid item xs={6}>
                                    <Button
                                        color="info"
                                        variant="contained"
                                        disabled={!buttonpressed}
                                        onClick={handleRequest}
                                        fullWidth
                                        style={{
                                            maxWidth: "100%",
                                            height: "100%",
                                            fontSize: "1rem",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                            <CardActionArea>
                                <CardContent></CardContent>
                            </CardActionArea>
                        </Card>

                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            <Dialog open={gotpatientInfo} BackdropComponent={Backdrop}>
                {patientInfo ? (
                    <>
                        <DialogTitle>Before check-In, update your information if needed</DialogTitle>
                        <DialogContent>
                            {/* Display editable patient details */}
                            <Grid item xs={12} padding={2}>
                                <TextField
                                    label="Version Code of Health Card"
                                    value={updatedInfo.version_code}
                                    inputMode="text"
                                    onChange={(e) => handleInputChange("version_code", e.target.value)}
                                    Placeholder="Version Code of Health Card"
                                    fullWidth
                                    type="text"
                                />
                            </Grid>

                            <Grid item xs={12} padding={2}>
                                <TextField
                                    label="Address"
                                    value={updatedInfo.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    inputMode="text"
                                    Placeholder="Address"
                                    fullWidth
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12} padding={2}>
                                <TextField
                                    label="City"
                                    value={updatedInfo.city}
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                    inputMode="text"
                                    Placeholder="City"
                                    fullWidth
                                    type="text"
                                />
                            </Grid>

                            <Grid item xs={12} padding={2}>
                                <TextField
                                    label="Postal - XXX-XXX"
                                    value={updatedInfo.postal}
                                    onChange={(e) => handleInputChange("postal", e.target.value)}
                                    inputMode="text"
                                    Placeholder="XXX-XXX"
                                    fullWidth
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12} padding={2}>
                                <TextField
                                    label="Phone Number - e.g. 123-456-7890"
                                    value={formatPhone(updatedInfo.phone)}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    inputMode="numeric"
                                    Placeholder="e.g. 123-456-7890"
                                    fullWidth
                                    type="tel"
                                />
                            </Grid>

                            <Grid item xs={12} padding={2}>
                                <TextField
                                    label="Alternate Phone Number - e.g. 123-456-7890"
                                    value={formatPhone(updatedInfo.alternative_phone)}
                                    onChange={(e) => handleInputChange("alternative_phone", e.target.value)}
                                    inputMode="numeric"
                                    Placeholder="e.g. 123-456-7890"
                                    fullWidth
                                    type="tel"
                                />
                            </Grid>
                            <Grid item xs={12} padding={2}>
                                <TextField
                                    label="Email address"
                                    value={updatedInfo.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    inputMode="text"
                                    Placeholder="email address"
                                    fullWidth
                                    type="text"
                                    error={!isEmailValid}
                                    helperText={!isEmailValid ? "Invalid email address" : ""}
                                />
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <MKButton
                                variant="contained"
                                onClick={close_userinfo_model}
                                style={{
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                }}
                                color="primary"
                            >
                                Close
                            </MKButton>
                            <MKButton
                                variant="contained"
                                onClick={handleSubmitCheckIn}
                                disabled={!updatepressed}
                                color="info"
                                style={{fontSize: "1rem", fontWeight: "bold"}}
                            >
                                Update info
                            </MKButton>
                        </DialogActions>
                    </>
                ) : (
                    // setOpenModal(true);
                    <></>
                )}
            </Dialog>

            <NotificationDialog
                open={openNotification}
                onClose={gotoHome}
                content={notificationMessage}
                isError={notificationError}
            />
        </Layout>
    );
};

export default UpdateProfileOauth;
