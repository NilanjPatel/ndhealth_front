// src/components/clinicPolicy.js
import API_BASE_PATH from "../../apiConfig";

// Adjust the path based on your project structure

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardHeader,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CardContent,
} from "@mui/material";

import Layout from "./Layout";
import "nd_health/components/css/Marquee.css";
import {
  formatTime,
  formatDob,
  formatHin,
  isValidEmail,
  formatPostalCode,
  formatPhone,
} from "nd_health/components/resources/utils";
// import businessLandscape_demo from "../demo_Pharmacy_Landscape_Banner.png"
// import AdMark from './ads/AdMark';

const ClinicPolicy = () => {
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [appointments, setAppointments] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dob, setDob] = useState("");
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [patientInfo, setpatientInfo] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  // const [phone, setPhone] = useState('');
  // const [alternatePhone, setAlternatePhone] = useState('');
  // const [address, setAddress] = useState('');
  // const [city, setCity] = useState('');
  // const [province, setProvince] = useState('');
  // const [postal, setPostal] = useState('');
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  // doctor selction
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [selecteddoctorAppointment, setSelecteddoctorAppointment] = useState(false);
  const [pharmacy_adv, setPharmacy_adv] = useState(false);

  const [update_info, setUpdate_info] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    address: "",
    city: "",
    postal: "",
    phone: "",
    alternative_phone: "",
    email: "",
    version_code: "",
  });

  const location = useLocation();

  const pathSegments = location.pathname.split("/");
  const clinicSlugcurrent = pathSegments[pathSegments.indexOf("terminal") + 1];
  const clinic_location = pathSegments[pathSegments.indexOf("terminal") + 2];
  const [showDoctorSelection, setShowDoctorSelection] = useState(true);

  const [backButoon, setBackButton] = useState({
    name: "Choose a Doctor",
    color: "red",
    backgroundColor: "white",
  });

  useEffect(() => {
    const clinicData = async () => {
      if (!appointments) {
        try {
          const response = await fetch(
            `${API_BASE_PATH}/terminal/${clinicSlugcurrent}/${clinic_location}/`,
          );

          const data = await response.json();
          setClinicInfo(data.clinic);
          setAppointments(data.appointments);
          setDoctors(data.doctors_info);
          if (data.pharmacy_adv) {
            setPharmacy_adv(data.pharmacy_adv);
          }
        } catch (error) {
          console.error("Error fetching clinic information:", error);
        }
      }
    };
    clinicData();
  }, [clinicSlug]);

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleAppointmentSelect1 = async (selectedAppointment) => {
    setSelectedAppointment(selectedAppointment);
    setIsUpdatingInfo(false);
    try {
      const response = await fetch(
        `${API_BASE_PATH}/terminal/${clinicSlugcurrent}/${selectedAppointment.appointmentId}/${dob}/`,
      );
      const data = await response.json();
      if (data.status === "success") {
        setpatientInfo(data.data);
        setIsDialogOpen(true);
        setUpdatedInfo({
          address: data.data.address || "",
          city: data.data.city || "",
          postal: data.data.postal || "",
          phone: data.data.phone || "",
          alternative_phone: data.data.alternative_phone || "",
          email: data.data.email || "",
          version_code: data.data.version_code || "",
        });
      } else if (data.status === "failed") {
        setModalContent(data.message);
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Error fetching clinic information:", error);
    }
  };

  // const handlephoneChange = (event) => {
  //     setPhone(event.target.value);
  // };

  // const handleUpdateInfo = () => {
  //     setIsUpdatingInfo(true);
  //     setIsDialogOpen(true);
  // };

  const handleCloseDialog = () => {
    setIsUpdatingInfo(true);
    setUpdate_info(true);
  };

  const handleSubmitCheckIn = async () => {
    if (isUpdatingInfo) {
      if (isEmailValid) {
        setUpdate_info(true);
        // Add logic to update user information with the provided date of birth (dob)
        // You can make a POST request to the server to update the user's information.
        // After updating, set setIsUpdatingInfo(false) to hide the form.
        // Example of making a POST request
        const response = await fetch(`${API_BASE_PATH}/updateUserInfo/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId: selectedAppointment.appointmentId,
            id: selectedAppointment.id,
            address: updatedInfo.address,
            city: updatedInfo.city,
            postal: updatedInfo.postal,
            phone: updatedInfo.phone,
            alternative_phone: updatedInfo.alternative_phone,
            email: updatedInfo.email,
            cs: updatedInfo.version_code,
            update: true,
          }),
        });
        const data = await response.json();
        console.log(data);
        if (data.status === "success") {
          setIsUpdatingInfo(false);
          setOpenModal(true);
          setModalContent(data.message);
        } else if (data.status === "failed") {
          setIsUpdatingInfo(false);
          setOpenModal(true);
          setModalContent(data.message);
        }
      } else {
        // Email is not valid, handle accordingly (show an Error message, etc.)
        setModalContent("Email is not valid, kindly write valid email address.");
        setOpenModal(true);
      }
    } else {
      const response = await fetch(`${API_BASE_PATH}/updateUserInfo/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: selectedAppointment.appointmentId,
          id: selectedAppointment.id,
          update: false,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        setIsUpdatingInfo(false);
        setOpenModal(true);
        setModalContent(data.message);
      } else if (data.status === "failed") {
        setIsUpdatingInfo(false);
        setOpenModal(true);
        setModalContent(data.message);
      }
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    window.location.reload();
  };

  const handleEmailChange = (value) => {
    setEmail(value);

    // Validate email format
    const isValid = isValidEmail(value);
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
    setIsDialogOpen(false);
    window.location.reload();
  };

  const clinicData = async () => {
    if (!appointments) {
      try {
        const response = await fetch(
          `${API_BASE_PATH}/terminal/${clinicSlugcurrent}/${clinic_location}/`,
        );

        const data = await response.json();
        setClinicInfo(data.clinic);
        setAppointments(data.appointments);
        setDoctors(data.doctors_info);
        if (data.pharmacy_adv) {
          setPharmacy_adv(data.pharmacy_adv);
        }
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    clinicData(); // fetching appointments data when doctor is selected
    // Fetch appointments for the selected doctor
    const doctorAppointments = appointments.filter(
      (appointment) => appointment.doctorID__id === doctor.doctor__id,
    );
    setSelecteddoctorAppointment(doctorAppointments);

    if (doctorAppointments.length > 0) {
      setShowDoctorSelection(false);
      setBackButton({
        name: "Back" || "",
        color: "white",
        backgroundColor: "#1975D1",
      });
    } else {
      setOpenModal(true);
      setModalContent("No Appointment Available With This Doctor.");
    }
  };

  const backThings = () => {
    setSelectedAppointment(null);
    setShowDoctorSelection(true);
    setBackButton({
      name: "Choose a Doctor" || "",
      color: "red",
      backgroundColor: "white",
    });
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        <Grid container spacing={3} paddingTop={2}>
          <Grid item xs={12}>
            <div>
              <Grid sx={{ padding: "1rem" }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid xs={12} md={6} lg={6}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={backThings}
                        fullWidth
                        style={{
                          backgroundColor: backButoon.backgroundColor,
                          color: backButoon.color,
                          fontSize: "1rem",
                          border: "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "5px",
                          width: "20rem",
                        }}
                      >
                        {backButoon.name}
                      </Button>
                    </div>
                  </Grid>

                  <Grid xs={12} md={6} lg={6}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleCloseModal}
                        fullWidth
                        style={{
                          fontSize: "1rem",
                          border: "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "5px",
                          width: "20rem",
                        }}
                      >
                        Refresh
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              {showDoctorSelection && !selectedAppointment && (
                <Grid sx={{ padding: "1rem" }}>
                  <Grid container spacing={2}>
                    {doctors &&
                      doctors.length > 0 &&
                      doctors.map((doctor) => (
                        <Grid item key={doctor.doctor__id} xs={12} md={6} lg={6}>
                          <div
                            onClick={() => handleDoctorSelect(doctor)}
                            style={{
                              cursor: "pointer",
                              fontSize: "1.5rem",
                              border: "1px solid #ccc",
                              padding: "10px",
                              borderRadius: "5px",
                              width: "100%",
                            }}
                          >
                            Dr.{" "}
                            {`${doctor.doctor__user__first_name} ${doctor.doctor__user__last_name}`}
                          </div>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              )}
            </div>

            {!showDoctorSelection && !selectedAppointment && (
              // <Card>
              <Grid item xs={12} sx={{ paddingTop: "0.1rem" }}>

                {selecteddoctorAppointment && selecteddoctorAppointment.length > 0 ? (
                  <>
                    <Grid container spacing={1}>
                      {selecteddoctorAppointment.map((appointment) => (
                        <Grid item key={appointment.appointmentId} xs={12} md={6} lg={6}>
                          <Card
                            onClick={() => handleAppointmentSelect(appointment)}
                            sx={{
                              cursor: "pointer",
                              fontSize: "1.5rem",
                              border: "1px solid #ccc",
                              padding: "10px",
                              borderRadius: "5px",
                              width: "100%",
                            }}
                          >
                            <Typography variant="body1" style={{ fontSize: "1.4rem" }}>
                              {formatTime(appointment.appointmentTime)}
                            </Typography>
                            <Typography variant="body2" style={{ fontSize: "1.2rem" }}>
                              {/*{appointment.patientName}*/}
                              {(() => {

                                const [first, last] = appointment.patientName.split(",");
                                if(first !=="" && last ===""){
                                  return `Name: ${first?.slice(0, 2) || ""}`;
                                }
                                if(first !=="" && last !==""){
                                  return `Name: ${first?.slice(0, 2) || ""}, ${last?.slice(0, 2) || ""}`;
                                }
                                if(first ==="" && last !==""){
                                  return `Name: ${last?.slice(0, 2) || ""}`;
                                }

                              })()}

                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item  xs={12} md={12} lg={12} mt={3}>
                        <Typography variant="body1" style={{ fontSize: "1.5rem" }}>
                          {/*{appointment.patientName}*/}
                          If you did not remember your Appointment Time see first 2 characters of your last and first name.
                          If you have provided a valid email address, your appointment details have been sent to your inbox.
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Typography variant="body1">No appointments available</Typography>
                )}

              </Grid>
              // </Card>
            )}
          </Grid>
          <Grid item xs={12}>
            {/* make this card's color little */}
            {selectedAppointment ? (
              <div>
                <Grid sx={{ paddingTop: "0rem" }}>
                  <Card style={{ backgroundColor: "#e8eaf6" }}>
                    <Grid item xs={12} padding={2}>
                      <CardHeader
                        title="Verify Your Identity :"
                        titleTypographyProps={{ fontSize: "1.5rem", fontWeight: "bold" }}
                      />
                      <CardContent>
                        <Typography
                          variant="body1"
                          gutterBottom
                          style={{ fontSize: "1.3rem", fontWeight: "bold" }}
                        >
                          {/*Name: {selectedAppointment.patieappointmentTimentName}*/}
                          Time : {formatTime(selectedAppointment.appointmentTime)}
                        </Typography>
                        {/*<Typography*/}
                        {/*  variant="body1"*/}
                        {/*  gutterBottom*/}
                        {/*  style={{ fontSize: "1.3rem", fontWeight: "bold" }}*/}
                        {/*>*/}
                        {/*  Time: {formatTime(selectedAppointment.appointmentTime)}*/}
                        {/*</Typography>*/}
                        <Grid item xs={6} paddingTop={2}>
                          <TextField
                            label="Date of Birth - YYYY-MM-DD"
                            value={formatDob(dob)}
                            onChange={(e) => setDob(e.target.value)}
                            inputMode="numeric"
                            Placeholder="YYYY-MM-DD"
                            fullWidth
                            type="tel"
                            fontSize="1.3rem"
                          />
                        </Grid>
                        <Grid item xs={12} paddingTop={2}>
                          <Button
                            variant="contained"
                            onClick={() => handleAppointmentSelect1(selectedAppointment)}
                            disabled={dob.length <= 9}
                            fontSize="1.3rem"
                          >
                            Proceed
                          </Button>
                        </Grid>
                      </CardContent>
                    </Grid>
                  </Card>
                </Grid>
              </div>
            ) : (
              <div></div>
            )}
          </Grid>
        </Grid>

        <Dialog open={isDialogOpen} BackdropComponent={Backdrop}>
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
                    disabled={!isUpdatingInfo}
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
                    disabled={!isUpdatingInfo}
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
                    disabled={!isUpdatingInfo}
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
                    disabled={!isUpdatingInfo}
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
                    disabled={!isUpdatingInfo}
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
                    disabled={!isUpdatingInfo}
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
                    disabled={!isUpdatingInfo}
                    error={!isEmailValid}
                    helperText={!isEmailValid ? "Invalid email address" : ""}
                  />
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={close_userinfo_model}
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "red",
                    backgroundColor: "white",
                  }}
                >
                  Close
                </Button>
                {!update_info && (
                  <Button
                    variant="contained"
                    onClick={handleCloseDialog}
                    style={{ fontSize: "1rem", fontWeight: "bold" }}
                  >
                    Update info
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleSubmitCheckIn}
                  style={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  {isUpdatingInfo ? "Submit & Check-In" : "Skip & Check-In"}
                </Button>
              </DialogActions>
            </>
          ) : (
            // setOpenModal(true);
            <Dialog open={openModal} onClose={handleCloseModal}>
              <DialogTitle>Notification</DialogTitle>
              <DialogContent>{modalContent}</DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal}>Close</Button>
              </DialogActions>
            </Dialog>
          )}
        </Dialog>
      </div>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>{modalContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ClinicPolicy;
