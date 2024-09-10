import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import API_BASE_PATH from "./../../apiConfig";

import Layout from "./Layout";
// import LinearProgressWithLabel from "./processes/LinearProgressWithLabel";
import MKProgress from "../../components/MKProgress";
import {
  Typography,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";

// import checkAppStatus from"../components/resources/utils";
import { isValidEmail, formatPhone, redirectHomeM } from "nd_health/components/resources/utils";

// import CircularProgress from "@mui/joy/CircularProgress";
import NdLoader from "nd_health/components/resources/Ndloader";
// Material Kit 2 PRO React components
import MKTypography from "components/MKTypography";
import { Placeholder } from "react-bootstrap";
import MKBox from "../../components/MKBox";
import MKButton from "../../components/MKButton";
import NotificationDialog from "./resources/Notification";

const FamilyAppointmentPage = () => {
  const { clinicSlug } = useParams();
  // const [clinicInfo, setClinicInfo] = useState(null);

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  // const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedAppointmentMode, setSelectedAppointmentMode] = useState("");
  const [appointmentModes, setAppointmentModes] = useState([]);
  const [isAppointmentAvailable, setIsAppointmentAvailable] = useState(false);
  const [reason, setReason] = useState("");
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [openAgreementPopup, setOpenAgreementPopup] = useState(false);
  const [termsInfo, settermsInfo] = useState(null);

  // new
  const [selectedOption, setSelectedOption] = useState(""); // Default selected option
  const [phoneNumber, setPhoneNumber] = useState(""); // Default selected option
  const [appointmentBookContent, setAppointmentBookContent] = useState("");
  const [openApp, setOpenApp] = useState(false);
  const [buttonRedirect, setButtonRedirect] = useState("");
  const [progress, setProgress] = useState(0);
  // const [clinicLocation, setClinicLocation] = useState('');
  // const [clinicAddress, setClinicAddress] = useState("");
  // const [clinicpostalCode, setClinicPostalCode] = useState("");
  const [drNotice, setDrNotice] = useState(null);
  const location = useLocation();
  const responseData = location.state && location.state.responseData;
  const clinicInfo = location.state && location.state.clinicInfo;
  const clinicLocation = location.state && location.state.locationsData;

  const [appointmentlist, setAppointmentlist] = useState([]);
  const [app_list_dilog, setApp_list_dilog] = useState(false);
  const [same_date_app, setSame_date_app] = useState(false);

  const [email, setEmail] = useState(""); // Default selected option
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [submitbutton, setSubmitbutton] = useState(true);

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Simulate fetching locations data
  useEffect(() => {
    // Replace with actual API call
    // const response = /* Your API response */;
    setLocations(Object.keys(responseData.location));
    if (responseData.doctor_notice) {
      const notices = [];
      for (let i = 0; i < responseData.doctor_notice.length; i++) {
        notices.push(responseData.doctor_notice[i]);
        setDrNotice(notices.join(" | "));
      }
    }
    //  set setApp_list_dilog if there is any appointment
    if (responseData.letest_appointments.length > 0) {
      setApp_list_dilog(true);
      const appointmentlist = responseData.letest_appointments.map((appointment) => (
        <React.Fragment key={appointment.id}>
          <p>Date: {appointment.appointmentDate}</p>
          <p>Start Time: {appointment.startTime}</p>
        </React.Fragment>
      ));

      setAppointmentlist(appointmentlist);
    }
  }, [responseData]);

  const redirectHome = () => {
    setOpenApp(false);
    window.location.href = `/clinic/${clinicSlug}/`;
  };

  if (!responseData) {
    // redirect to clinic page
    redirectHome();
  }

  const fetchAppointmentStatus = async () => {
    const response = await fetch(`${API_BASE_PATH}/appointment-status/${responseData.xps}/`);
    const data = await response.json();
    if (data.status === "failed") {
      setAppointmentBookContent(
        "You already book an appointment! this session is expired. If you have provided valid email, You will receive a confirmation email shortly. if you still want to book an appointment please close the window and try again."
      );
      setButtonRedirect("Home");
      setOpenApp(true);
    }
  };

  // Handle location change
  const handleLocationChange = (event) => {
    const locationName = event.target.value;
    setSelectedLocation(locationName);
    // const providers = Object.keys(responseData.location[locationName].provider_number);
    // setProviders(providers);
    setSelectedProvider(""); // Set the only available provider as default if there is only one
    setSelectedDate("");
    setSelectedTime(""); // Reset selectedTime when the date changes'
    setProgress(14.32);
    setIsAppointmentAvailable(false);
    fetchAppointmentStatus(); //TODO in walkin
    //  try to get appointment status using checkAppStatus
    setSelectedAppointmentMode("");
  };

  // show clinic location
  // const showClinicLocation = (name) => {
  //   //  get address from clinicInfo using clinicLocation
  //   for (let i = 0; i < clinicLocation.length; i++) {
  //     if (clinicLocation[i].name === name) {
  //       setClinicAddress(clinicLocation[i].address);
  //       setClinicPostalCode(clinicLocation[i].postal);
  //     }
  //   }
  // };
  // Handle provider change
  const handleProviderChange = (event) => {
    const providerNumber = event.target.value;
    setSelectedProvider(providerNumber);
    const providerData = responseData.location[selectedLocation].provider_number[providerNumber];
    // showClinicLocation(providerData.name);
    setAppointmentModes(Object.keys(providerData.AppointmentMode));
    setIsAppointmentAvailable(Object.keys(providerData.letestappointmentslots).length > 0);
    if (Object.keys(providerData.letestappointmentslots).length < 1) {
      // notify no appointment available for this doctor on selected location
      handleFailure("No appointment slots available for doctor and location you have selected. ");
    }
    setSelectedTime(""); // Reset selectedTime when the date changes'
    setSelectedDate("");
    setProgress(28.6);
    setAgreementChecked(false);
    setSelectedAppointmentMode("");
  };

  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime(""); // Reset selectedTime when the date changes
    setProgress(42.88);
    setAgreementChecked(false);
    setSame_date_app(true);

    // check if there is any appointment in applointment list
    if (responseData.letest_appointments) {
      for (let i = 0; i < responseData.letest_appointments.length; i++) {
        if (responseData.letest_appointments[i].appointmentDate === event.target.value) {
          setSame_date_app(false);
        }
      }
    }
  };

  // Handle time change
  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
    setProgress(57.16);
    setAgreementChecked(false);
  };

  // Handle appointment mode change
  const handleAppointmentModeChange = (event) => {
    setSelectedAppointmentMode(event.target.value);
    if (event.target.value === "Phone") {
      setPhoneNumber(responseData.patient_phone);
      setSelectedOption("phone");
    } else if (event.target.value === "Video") {
      setSelectedOption("email");
    } else if (event.target.value === "Clinic") {
      setSelectedOption("clinic");
    }

    setProgress(71.44);

    setAgreementChecked(false);
  };
  const handleCloseApp = () => {
    setOpenApp(false);
    redirectHome();
  };

  // Handle booking appointment
  const handleBookAppointment = async () => {
    setSubmitbutton(false);
    const time = selectedTime.split(",")[0];
    const duration = selectedTime.split(",")[1];

    //   call api to book appointment "api/book-appointment/" make post request
    try {
      const response = await fetch(`${API_BASE_PATH}/book-appointment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clinicSlug: clinicSlug,
          location: selectedLocation,
          provider: selectedProvider,
          date: selectedDate,
          time: time,
          duration: duration,
          appointmentMode: selectedAppointmentMode,
          reason: reason,
          xps: responseData.xps,
          phoneNumber: phoneNumber,
          email: email,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        // Redirect to the confirmation page
        // navigate(`/confirmation/${clinicSlug}`);
        setSubmitbutton(true);
        setAppointmentBookContent(data.message);
        setButtonRedirect("Home");
        setOpenApp(true);
      } else {
        setSubmitbutton(true);
        setAppointmentBookContent(data.message);
        setButtonRedirect("Try Again");
        setOpenApp(true);
      }
    } catch (error) {
      setSubmitbutton(true);
      setAppointmentBookContent("Appointment not booked!\nPlease try again.");
      setButtonRedirect("Try Again");
      setOpenApp(true);
    }
  };
  // Handle reason change
  const handleReasonChange = (event) => {
    setReason(event.target.value);
    setProgress(85.72);
  };

  const formatTime = (timeString) => {
    const formattedTime = new Date(`2000-01-01T${timeString}`);
    return formattedTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleAgreementChange = () => {
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
          const response = await fetch(`${API_BASE_PATH}/terms/${clinicSlug}/Appointment Booking/`);

          const data = await response.json();
          settermsInfo(data.message.text);
        } catch (error) {
          console.error("Error fetching clinic information:", error);
        }
      }
    };
    fetchClinicInfo();
    setOpenAgreementPopup(true);
  };

  const handleCloseAgreementPopup = () => {
    setOpenAgreementPopup(false);
  };

  const handle_app_list = () => {
    setApp_list_dilog(false);
  };

  const handleEmailChange = (value) => {
    setEmail(value.toLowerCase());
    // Validate email format
    const isValid = isValidEmail(value.toLowerCase());
    setIsEmailValid(isValid);
  };

  // // NotificationDialog
  // const handleSuccess = (message) => {
  //   setModalContent(message);
  //   setIsError(false);
  //   setOpenModal(true);
  // };
  const handleFailure = (message) => {
    setModalContent(message);
    setIsError(true);
    setOpenModal(true);
  };

  if (!responseData) {
    // redirect to clinic page
    redirectHome();
  } else {
    return (
      <Layout clinicInfo={clinicInfo}>
        <Paper
          style={{
            position: "sticky",
            top: "1rem",
            zIndex: 1000,
            padding: "1rem",
            marginBottom: "0.3rem",
            boxShadow: "0 0 10px 2px #2196F3",
          }}
        >
          <MKTypography
            variant="h6"
            gutterBottom
            style={{ fontSize: "0.81rem", fontWeight: "bold" }}
            color={"black"}
          >
            Book Appointment With Your family Doctor
          </MKTypography>

          <Grid item xs={12} md={12}>
            <MKProgress value={progress} />
          </Grid>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <div>
                <label>Location:</label>
                <Select value={selectedLocation} onChange={handleLocationChange}>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </Grid> */}

            {drNotice && (
              <Grid item xs={12} md={12}>
                <MKTypography
                  style={{ color: "red", fontSize: "1rem", padding: "0.8rem" }}
                  fontWeight={"bold"}
                >
                  Notice: {drNotice}
                </MKTypography>
              </Grid>
            )}
            <Grid item xs={12} md={12}>
              <Typography style={{ color: "red", fontSize: "1rem", padding: "0.8rem" }}>
                <MKButton
                  style={{ padding: "0.8rem" }}
                  onClick={() => redirectHomeM(clinicSlug)}
                  color="info"
                  variant={"contained"}
                >
                  Back
                </MKButton>
              </Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <FormControl>
                <Placeholder>Doctor:</Placeholder>
                <RadioGroup value={selectedLocation} onChange={handleLocationChange}>
                  {locations.map((location) => (
                    <FormControlLabel
                      key={location}
                      value={location}
                      control={<Radio />}
                      label={location}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <Grid item xs={12} md={6}>
                <MKBox width="100%" component="section">
                  <InputLabel id="Location-label">Select Location</InputLabel>
                  <Select
                    labelId="Location-label"
                    id="Location"
                    label="Select Location"
                    value={selectedProvider || "Select Location"}
                    onChange={handleProviderChange}
                    style={{ minWidth: "15rem", minHeight: "2rem" }}
                  >
                    {responseData.location[selectedLocation]?.provider_number &&
                      Object.keys(responseData.location[selectedLocation].provider_number).map(
                        (providerNumber) => {
                          const provider =
                            responseData.location[selectedLocation].provider_number[providerNumber];
                          const location = clinicLocation.find(
                            (loc) => loc.name === provider?.name
                          );

                          return (
                            <MenuItem key={providerNumber} value={providerNumber}>
                              {location?.address}
                              {/*{provider?.name}, */}
                            </MenuItem>
                          );
                        }
                      )}
                  </Select>
                </MKBox>
              </Grid>

              {/*{clinicAddress && (*/}
              {/*  <Grid item xs={12} md={3}>*/}
              {/*    <>*/}
              {/*      <Typography>Clinic Address:</Typography>*/}
              {/*      <Typography>{clinicAddress}</Typography>*/}
              {/*      <Typography>{clinicpostalCode}</Typography>*/}
              {/*    </>*/}
              {/*  </Grid>*/}
              {/*)}*/}
            </Grid>

            {/* {isAppointmentAvailable && ( */}
            <>
              <Grid item xs={12} md={6}>
                <MKBox width="100%" component="section">
                  <InputLabel id="date-label">Select date</InputLabel>
                  {/* <Placeholder>Select date:</Placeholder> */}
                  <Select
                    labelId="date-label"
                    id="date"
                    label="Select date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    style={{ minWidth: "15rem", minHeight: "2rem" }}
                    disabled={!isAppointmentAvailable}
                  >
                    {
                      responseData.location[selectedLocation]?.provider_number[selectedProvider]
                        ?.letestappointmentslots
                        ? Object.keys(
                            responseData.location[selectedLocation]?.provider_number[
                              selectedProvider
                            ]?.letestappointmentslots
                          ).map((date, index) => (
                            <MenuItem key={`${date}_${index}`} value={date}>
                              {date}
                            </MenuItem>
                          ))
                        : null // or replace with appropriate fallback logic
                    }
                  </Select>
                </MKBox>
              </Grid>
              <Grid item xs={12} md={12}>
                <MKBox width="100%" component="section">
                  <InputLabel>Select time slot</InputLabel>
                  {/* <Placeholder>Select time slot: </Placeholder> */}
                  <Select
                    labelId="time-label"
                    id="time"
                    label="Select time slot"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    style={{ minWidth: "15rem", minHeight: "2rem" }}
                    disabled={!isAppointmentAvailable}
                  >
                    {selectedDate &&
                      responseData.location[selectedLocation]?.provider_number[
                        selectedProvider
                      ]?.letestappointmentslots[selectedDate].map((time, index) => (
                        <MenuItem
                          key={`${time.date}_${index}`}
                          value={time.time + "," + time.duration}
                        >
                          {formatTime(time.time)}, {time.duration} Minutes
                        </MenuItem>
                      ))}
                  </Select>
                </MKBox>
              </Grid>
              {appointmentModes.length > 0 && (
                <Grid item xs={12} md={12}>
                  <>
                    <label>Appointment Mode:</label>
                    <RadioGroup
                      row
                      value={selectedAppointmentMode}
                      onChange={handleAppointmentModeChange}
                      disabled={!isAppointmentAvailable}
                    >
                      {appointmentModes.map((mode) => (
                        <FormControlLabel
                          key={mode}
                          value={mode}
                          control={
                            <Radio
                              disabled={
                                responseData.location[selectedLocation]?.provider_number[
                                  selectedProvider
                                ]?.AppointmentMode[mode] === 0
                              }
                            />
                          }
                          label={mode}
                        />
                      ))}
                    </RadioGroup>
                  </>
                </Grid>
              )}

              {/* {if responceData.email_valid == noask patient if he want to update email } */}
              {responseData.email_valid === "no" && (
                <Grid item xs={12}>
                  <Typography style={{ color: "red", padding: "1rem" }}>
                    Kindly update your email for receiving appointment updates and clinic
                    communications. Rest assured, we do not share your information with any third
                    parties.
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    label="Email Address ( optional )"
                    variant="outlined"
                    onChange={(e) => handleEmailChange(e.target.value)}
                    value={email}
                    fullWidth
                    error={!isEmailValid}
                    type="email"
                    helperText={!isEmailValid ? "Invalid email address" : ""}
                    disabled={!isAppointmentAvailable}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                {selectedOption === "phone" && (
                  <TextField
                    style={{ minWidth: "15rem" }}
                    type="tel"
                    label="Phone Number"
                    value={formatPhone(phoneNumber)}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                )}
                {selectedOption === "email" && (
                  // <TextField style={{ width:'100%', height:'100%' }} label="" disabled />
                  <Typography onClick={handleAgreementClick} style={{ cursor: "pointer" }}>
                    If you have provided valid email, You will receive a email with link of the
                    video meeting.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Reason for Appointment"
                  value={reason}
                  onChange={handleReasonChange}
                  fullWidth
                  multiline
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
                      sx={{ color: "primary" }}
                    />
                  }
                  label="I agree to the terms and conditions."
                />
                <Typography onClick={handleAgreementClick} style={{ cursor: "pointer" }}>
                  View Terms and Conditions
                </Typography>
              </Grid>

              {/* if same_date_app is true false */}
              {!same_date_app && (
                <Grid item xs={12}>
                  <Typography style={{ color: "red", fontSize: "0.8rem" }}>
                    You already have an appointment on this date. Still, if you want to book
                    appointment, Please select another date.
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <MKButton
                  variant="contained"
                  color="info"
                  disabled={
                    !agreementChecked ||
                    !selectedDate ||
                    !selectedTime ||
                    !reason ||
                    !selectedAppointmentMode ||
                    !same_date_app ||
                    !submitbutton
                  }
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </MKButton>
              </Grid>
            </>
            {/* )} */}
          </Grid>
        </Paper>

        <Dialog open={openAgreementPopup} onClose={handleCloseAgreementPopup}>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogContent>
            <MKBox m={2}>
              <div dangerouslySetInnerHTML={{ __html: termsInfo }} />
            </MKBox>
          </DialogContent>
        </Dialog>

        {/* Modal */}
        <Dialog
          open={openApp}
          onClose={handleCloseApp}
          PaperProps={{ style: { boxShadow: "0 0 10px 2px #2196F3" } }}
        >
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>{appointmentBookContent}</DialogContent>
          <DialogActions>
            <Button onClick={redirectHome}>{buttonRedirect}</Button>
          </DialogActions>
          {/* <DialogActions>
                            <Button onClick={handleCloseApp}>Close</Button>
                        </DialogActions> */}
        </Dialog>

        <Dialog open={app_list_dilog} onClose={handle_app_list}>
          <DialogTitle style={{ fontSize: "1rem", fontWeight: "bold" }}>
            Your Upcoming Appointment List
          </DialogTitle>
          <DialogContent>
            <Card sx={{ border: "2px solid green" }}>
              <CardContent>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {appointmentlist}
                </Typography>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={handle_app_list}>Close</Button>
          </DialogActions>
        </Dialog>

        {!submitbutton && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <NdLoader size="lg" variant="soft" value={70} color="primary" />
          </div>
        )}

        <NotificationDialog
          open={openModal}
          onClose={setOpenModal}
          content={modalContent}
          isError={isError}
        />
      </Layout>
    );
  }
};

export default FamilyAppointmentPage;
