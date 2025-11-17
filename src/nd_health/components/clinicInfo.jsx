// src/components/clinicInfo.js
import API_BASE_PATH from "../../apiConfig";

// Adjust the path based on your project structure

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CardActionArea,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { Grid, Card, CardContent, Typography, CardHeader } from "@mui/material";
import Layout from "./Layout";
import "./css/Marquee.css";

import { formatDob, formatHin, redirectHomeM } from "./resources/utils";
import HelmetComponent from "./SEO/HelmetComponent";
// import CircularProgress from "@mui/joy";
import NdLoader from "nd_health/components/resources/Ndloader";

import hcv_with_version_code from "../assets/images/hcv_version_code.png";
// Material Kit 2 PRO React components
import MKTypography from "components/MKTypography";
import MKButton from "../../components/MKButton";
import Breadcrumbs from "../../examples/Breadcrumbs";
import Icon from "@mui/material/Icon";

const ClinicInfo = () => {
  // const location = useLocation();
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [locationsData, setLocations] = useState(null);
  const [buttonpressed, setButtonPressed] = useState(true);
  const navigate = useNavigate();

  // const pathSegments = location.pathname.split('/');
  // const clinicSlugcurrent = clinicSlug || pathSegments[pathSegments.indexOf('clinic') + 1]
  const [hin, setHin] = useState("");
  const [dob, setDob] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [notice, setNotice] = useState(null);
  // const [appointmentData, setAppointmentData] = useState(null);
  const [clinic_locations_multiple] = useState("We provide services at the following location(s):");
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [locationColor, setLocationColor] = useState(null);

  const dobRef = useRef(null);

  const [hcvValidate, setHcvValidate] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [submitbutton, setSubmitbutton] = useState(true);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);
        // const response = await fetch(`http://192.168.88.164:8000/api/clinic/${clinicSlug}/`);

        const data = await response.json();
        setClinicInfo(data.clinic);
        setLocations(data.locations);
        if (data.notices) {
          const notices = [];
          for (let i = 0; i < data.notices.length; i++) {
            if (data.notices[i]) {
              // append the notice to the notice state
              notices.push(data.notices[i]);
              // set the notice state
              setNotice(notices.join(" | "));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    };

    if (!clinicInfoFetched) {
      fetchClinicInfo();
      setClinicInfoFetched(true);
    }
    // change clinic_locations_multiple if there are multiple locations
    // if (locationsData && locationsData.length > 1) {
    //     set_clinic_locations_multiple("Serving at Multiple Locations.");
    // }
  }, [clinicSlug, hin, locationsData, clinicInfoFetched]);

  const handleHinChange = (e) => {
    const formattedHin = formatHin(e.target.value);
    setHin(formattedHin);

    // Check if the formatted HIN is 12 characters and move focus to the DOB field
    if (formatHin(hin).length === 12 && dobRef.current) {
      dobRef.current.focus();
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRequest = async () => {
    try {
      // Make a request with clinicSlug, hin, and dob
      setSubmitbutton(false);
      if (hin.length < 12 || dob.length < 10) {
        setSubmitbutton(true);
        setModalContent("Please enter your health-card number and date of birth.");
        setOpenModal(true);
        setButtonPressed(true);
        return;
      }
      setButtonPressed(false);

      const url = `${API_BASE_PATH}/doctors/${dob.replace(/\//g, "")}/${hin.replace(
        /\//g,
        "",
      )}/${clinicSlug}/book/`;
      const response = await fetch(url);
      // Handle the response as needed

      const data = await response.json();
      if (data.status === "success") {
        if (data.profile && data.enrolment_Status === "" && data.ProviderNo === "") {
          // Case 1: Registered but not rostered with family doctor, no walk-in availability
          setModalContent("We don't have any walk-in availability.");
          setOpenModal(true);
        } else if (data.profile === "yes" && data.enrolment_Status === "RO") {
          // Case 2: Registered, rostered with family doctor, and family appointment slots available
          // Redirect to the family appointment page with available slots
          // navigate(`/family-appointment/${clinicSlug}?demo=${data.demo}`);
          navigate(`/family-appointment/${clinicSlug}`, {
            state: {
              responseData: data,
              clinicInfo: clinicInfo,
              locationsData: locationsData,
            },
          });
        } else if (data.profile === "yes" && data.enrolment_Status !== "RO") {
          // Case 4: Registered, no family doctor, walk-in appointment slots available
          // Redirect to the walk-in appointment page with available slots
          navigate(`/walkin-appointment/${clinicSlug}`, {
            state: {
              responseData: data,
              clinicInfo: clinicInfo,
              locationsData: locationsData,
            },
          });
        }
      } else if (data.vld.data.payment === "no") {
        setHcvValidate(true);
      } else if (data.status === "failed") {
        setModalContent(data.message);
        setOpenModal(true);
        setButtonPressed(true);
      }
      setSubmitbutton(true);
    } catch (error) {
      setButtonPressed(true);
    }
  };

  const handleLocationClick = (location) => {
    const locationId = location.id;
    setSelectedLocation(selectedLocation === locationId ? null : locationId);
    setLocationColor(location.color);
  };
  const handleClose = () => {
    setSelectedLocation(null);
  };

  // handle manage appointment
  const manageApp = async () => {
    try {
      // Make a request with clinicSlug, hin, and dob
      if (hin === "" || dob === "") {
        setModalContent("Please enter your health-card number and date of birth.");
        setOpenModal(true);
        setButtonPressed(true);
        return;
      }
      setButtonPressed(false);
      const url = `${API_BASE_PATH}/doctors/${dob.replace(/\//g, "")}/${hin.replace(
        /\//g,
        "",
      )}/${clinicSlug}/manage/`;
      const response = await fetch(url);
      // Handle the response as needed
      const data = await response.json();
      if (data.status === "success") {
        // setAppointmentData(data);
        navigate(`/clinic/${clinicSlug}/manageappointment`, {
          state: {
            appointmentData: data,
            clinicInfo: clinicInfo,
          },
        });
      } else if (data.status === "failed") {
        setModalContent(data.message);
        setOpenModal(true);
        setButtonPressed(true);
      }
    } catch (error) {
      setButtonPressed(true);
    }
  };

  const handleHCVDialog = () => {
    setHcvValidate(false);
    setInputValue("");
    window.location.reload();
  };

  const updateVersionCode = async () => {
    // hin, dob, inputValue

    const response = await fetch(`${API_BASE_PATH}/updateHCV/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hin: hin,
        dob: dob,
        clinicSlug: clinicSlug,
        newversion: inputValue,
        update: true,
      }),
    });
    const data = await response.json();
    if (data.status === "success") {
      setModalContent(data.message);
      setOpenModal(true);
      setButtonPressed(true);
      setHcvValidate(false);
      setInputValue("");
    } else if (data.status === "failed") {
      setModalContent(data.message);
      setOpenModal(true);
      setButtonPressed(true);
      setHcvValidate(false);
      setInputValue("");
      setInputValue("");
    }
  };

  const changeVersionCode = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        <HelmetComponent />

        {clinicInfo ? (
          <>
            <Grid item xs={12} md={8}>
              <MKTypography fontWeight={"bold"} color={"black"}>
                Book appointment at {clinicInfo.name}
              </MKTypography>
              {/* <Typography variant="h4" >Book appointment at {clinicInfo.name}</Typography> */}
              <Card>
                {notice && (
                  // <div className="marquee-container" style={{ color: 'red', fontSize: '1rem' }}>
                  //   <div className="marquee-content">
                  //     Clinic Notice: {notice}
                  //   </div>
                  // </div>

                  <Grid item xs={12} md={12}>
                    <Typography style={{ color: "red", fontSize: "1rem", padding: "0.8rem" }}>
                      Clinic Notice: {notice}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} md={12}>
                  <Breadcrumbs
                    routes={[
                      { label: "Go home", route: `/clinic/${clinicSlug}/`, icon: <Icon>home</Icon> },
                      // { label: "Book Appointment", icon: <Icon>appointment</Icon> },
                    ]}
                  />
                </Grid>

                <CardHeader
                  title="Verify Your Identity"
                  titleTypographyProps={{ style: { fontSize: "1rem", fontWeight: "bold" } }}
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
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      style={{ color: "red", fontSize: "0.8rem", fontWeight: "bold" }}
                    >
                      In case of emergency, do not use this service, please call 911 or go to the
                      nearest emergency department.
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <MKButton
                      color="info"
                      variant="contained"
                      disabled={!buttonpressed}
                      onClick={handleRequest}
                      fullWidth
                      style={{ maxWidth: "100%", height: "100%", fontSize: "1rem", fontWeight: "bold" }}
                      sx={{
                        backgroundColor: "#1A73E8",
                        "&:hover": {
                          backgroundColor: "#1662C4",
                        },
                      }}
                    >
                      Book
                    </MKButton>
                  </Grid>

                  <Grid item xs={6}>
                    <MKButton
                      color="info"
                      variant="contained"
                      disabled={!buttonpressed}
                      onClick={manageApp}
                      fullWidth
                      style={{ maxWidth: "100%", height: "100%", fontSize: "1rem", fontWeight: "bold" }}
                      sx={{
                        backgroundColor: "#1A73E8",
                        "&:hover": {
                          backgroundColor: "#1662C4",
                        },
                      }}
                    >
                      Cancel Appointment
                    </MKButton>
                  </Grid>
                </Grid>
                <CardActionArea>
                  <Grid container spacing={2} padding={2}>
                    <Grid item xs={12} md={6}>
                      <MKButton
                        component={Link}
                        to="https://www.youtube.com/watch?v=N00wcFxDuRw"
                        target="_blank"
                        color={"info"}
                        variant="contained"
                        style={{  fontWeight: "bold", color:"black" }}
                        sx={{
                          backgroundColor: "#1A73E8",
                          "&:hover": {
                            backgroundColor: "#1662C4",
                          },
                        }}
                      >
                        Learn how to book an appointment, click here.
                      </MKButton>
                    </Grid>
                  </Grid>
                </CardActionArea>
              </Card>
              <h3>{clinic_locations_multiple}</h3>
              <Grid container spacing={2}>
                {locationsData &&
                  locationsData.map(
                    (location) =>
                      location.doctorsLocation.length > 0 && (
                        <>
                          <Grid item key={location.id} xs={12} md={6} lg={4}>
                            <Card
                              onClick={() => handleLocationClick(location)}
                              style={{
                                cursor: "pointer",
                                backgroundColor: location.color,
                                marginBottom: "16px",
                              }}
                            >
                              <CardContent>
                                <Typography variant="h6">{location.name}</Typography>
                                <Typography variant="body2">{location.address}</Typography>
                                <Typography variant="body2">
                                  {location.city}, {location.province}, {location.postal}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Dialog
                            open={selectedLocation === location.id}
                            onClose={handleClose}
                            PaperProps={{ style: { boxShadow: `0 0 65px 10px ${locationColor}` } }}
                          >
                            <Grid item key={location.id} xs={12} md={12} lg={12}>
                              <DialogTitle style={{ fontWeight: "bolder" }}>
                                {location.name}
                              </DialogTitle>
                              <DialogContent>
                                <Grid container spacing={1}>
                                  {location.doctorsLocation &&
                                    location.doctorsLocation.map((doctor) => (
                                      <Grid
                                        item
                                        key={doctor.doctor__user__first_name}
                                        xs={12}
                                        md={12}
                                        lg={12}
                                      >
                                        <Card
                                          variant="outlined"
                                          style={{
                                            minWidth: "fit-content",
                                            width: "100%",
                                            height: "100%",
                                            border: "1px solid dark",
                                          }}
                                        >
                                          {/* TODO change doctor__user to doctor.id */}
                                          <CardContent>
                                            <Typography
                                              variant="subtitle1"
                                              style={{
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                              }}
                                            >
                                              Dr. {doctor.doctor__user__first_name}{" "}
                                              {doctor.doctor__user__last_name}
                                            </Typography>
                                            <Typography variant="body2">
                                              {doctor.docType}
                                            </Typography>
                                          </CardContent>
                                        </Card>
                                      </Grid>
                                    ))}
                                </Grid>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                  Close
                                </Button>
                              </DialogActions>
                            </Grid>
                          </Dialog>
                        </>
                      ),
                  )}
              </Grid>
              {/* <Grid container spacing={2} > */}

              {/* </Grid> */}
            </Grid>
            <Grid item xs={12} md={8}></Grid>
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

        <Dialog open={hcvValidate} onClose={handleHCVDialog}>
          <DialogTitle sx={{ color: "red" }}>Health Card Expired</DialogTitle>
          <DialogTitle sx={{ color: "primary" }}>
            Your health card is not valid for booking an appointment. Please update it with the new
            version code to proceed.
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Enter the two-digit new version code to update your health card"
              value={inputValue}
              onChange={changeVersionCode}
              fullWidth
              InputProps={{
                inputProps: {
                  style: { fontSize: "1rem" },
                },
              }}
              InputLabelProps={{
                style: { fontSize: "0.7rem" },
              }}
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "0.7rem",
                },
                marginTop: "1rem",
              }}
            />
          </DialogContent>
          <DialogContent>
            <img
              alt="hcv-validation-check"
              src={hcv_with_version_code}
              style={{ marginTop: "20px", maxWidth: "100%" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleHCVDialog}>Close</Button>
            <Button onClick={updateVersionCode}>Update</Button>
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
            <NdLoader size="lg" variant="solid" value={70} color="primary" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClinicInfo;
