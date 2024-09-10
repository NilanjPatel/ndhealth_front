// src/components/clinicPolicy.js
import API_BASE_PATH from "./apiConfig";

// Adjust the path based on your project structure

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardHeader,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
} from "@mui/material";

import Layout from "./Layout";
import "./css/Marquee.css";
import {
  formatTime,
  formatDob,
  formatHin,
  isValidEmail,
  formatPostalCode,
} from "./resources/utils";
import businessLandscape_demo from "../demo_Pharmacy_Landscape_Banner.png";
import AdMark from "./ads/AdMark";

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
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postal, setPostal] = useState("");
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

  useEffect(() => {
    const clinicData = async () => {
      if (!appointments) {
        try {
          const response = await fetch(
            `${API_BASE_PATH}/terminal/${clinicSlugcurrent}/${clinic_location}/`
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
        `${API_BASE_PATH}/terminal/${clinicSlugcurrent}/${selectedAppointment.appointmentId}/${dob}/`
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

  const handlephoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleUpdateInfo = () => {
    setIsUpdatingInfo(true);
    setIsDialogOpen(true);
  };

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
        // Email is not valid, handle accordingly (show an error message, etc.)
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
      if (data.status === "success") {
        setIsUpdatingInfo(false);
        setOpenModal(true);
        setModalContent(data.message);
      } else if (data.status === "failed") {
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
      formattedValue = formatHin(value);
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
          `${API_BASE_PATH}/terminal/${clinicSlugcurrent}/${clinic_location}/`
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
      (appointment) => appointment.doctorID__id === doctor.doctor__id
    );
    setSelecteddoctorAppointment(doctorAppointments);
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        {/* <Grid container spacing={3} paddingTop={1}> */}
        {/* <Grid item xs={12}>
                        {pharmacy_adv && (
                            <Card style={{ maxHeight: '5rem', backgroundColor: '#ffffff' }}>
                                <AdMark cardHeight={5} />
                                <CardMedia
                                    component="img"
                                    alt="Advertisement Image"
                                    height="140"
                                    image={pharmacy_adv.image}  // asign pharmacy image here
                                />
                                {/* <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {pharmacy_adv.title}
                                    </Typography>
                                    <Typography variant="body1">
                                        {pharmacy_adv.description}
                                    // </Typography> */}
        {/* </CardContent> */}
        {/* </Card> */}
        {/* // )} */}

        {/* </Grid> */}
        {/* </Grid> */}

        <Grid container spacing={3} paddingTop={2}>
          {/* <Grid item xs={12}> */}
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
              <Select
                labelId="doctor-select-label"
                id="doctor-select"
                value={selectedDoctor?.doctor__id || ""}
                onChange={(e) => {
                  const selectedDoctorId = e.target.value;
                  const selectedDoctor = doctors.find(
                    (doctor) => doctor.doctor__id === selectedDoctorId
                  );
                  handleDoctorSelect(selectedDoctor);
                }}
                label="Select Doctor"
              >
                {doctors &&
                  doctors.length > 0 &&
                  doctors.map((doctor) => (
                    <MenuItem key={doctor.doctor__id} value={doctor.doctor__id}>
                      Dr. {`${doctor.doctor__user__first_name} ${doctor.doctor__user__last_name}`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Card>
              <CardHeader title="Appointments" />
              {/* sub heading  */}
              {/* <Typography variant="h6" style={{fontSize:'1rem'}} gutterBottom>
                                    {selectedDoctor?.doctor__user__first_name} {selectedDoctor?.doctor__user__last_name}
                                    </Typography> */}

              <Grid item xs={12}>
                <Paper style={{ maxHeight: "calc(48vh - 64px)", overflowY: "auto" }}>
                  {selecteddoctorAppointment && selecteddoctorAppointment.length > 0 && (
                    <List>
                      {selecteddoctorAppointment.map((appointment) => (
                        <ListItemButton
                          key={appointment.appointmentId}
                          onClick={() => handleAppointmentSelect(appointment)}
                          selected={
                            selectedAppointment?.appointmentId === appointment.appointmentId
                          }
                          button
                        >
                          <ListItemText
                            primary={appointment.patientName}
                            secondary={formatTime(appointment.appointmentTime)}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={8}>
            {/* make this card's color little */}
            {selectedAppointment ? (
              <div>
                <Grid>
                  <Card style={{ backgroundColor: "#fffff", height: "3.7rem" }}>
                    {/* <CardHeader title="Please choose a doctor and select an appointment to check in." style={{fontSize:'2px'}} /> */}
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ padding: "1rem", fontSize: "1rem", color: "red" }}
                    >
                      Thank You For Choosing our Digital Service.
                    </Typography>
                  </Card>
                  {/* Advertisement with image */}
                  {/* if pharmacy_adv  */}
                </Grid>

                <Grid sx={{ paddingTop: "0.8rem" }}>
                  <Card style={{ backgroundColor: "#e8eaf6" }}>
                    <Grid item xs={12} padding={2}>
                      <CardHeader
                        title="Verify your self with appointment details :"
                        titleTypographyProps={{ fontSize: "1rem", fontWeight: "bold" }}
                      />
                      <CardContent>
                        <Typography variant="body1" gutterBottom>
                          Name: {selectedAppointment.patientName}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Time: {formatTime(selectedAppointment.appointmentTime)}
                        </Typography>
                        <Grid item xs={6} paddingTop={2}>
                          <TextField
                            label="Date of Birth - YYYY-MM-DD"
                            value={formatDob(dob)}
                            onChange={(e) => setDob(e.target.value)}
                            inputMode="numeric"
                            Placeholder="YYYY-MM-DD"
                            fullWidth
                            type="tel"
                          />
                        </Grid>
                        <Grid item xs={12} paddingTop={2}>
                          <Button
                            variant="contained"
                            onClick={() => handleAppointmentSelect1(selectedAppointment)}
                            disabled={dob.length <= 9}
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
              // <div>
              //     <Card style={{ backgroundColor: '#ffebee' }}>
              //         <CardHeader title="Please choose a doctor and select an appointment to check in." />
              //     </Card>

              //     {/* Your advertisement component or content goes here */}
              //     <Typography variant="h5" gutterBottom>
              //         Exclusive Offer for Pharmacy Clients!
              //     </Typography>
              //     <Typography variant="body1">
              //         Get special discounts on prescription medicines. Visit our pharmacy today!
              //     </Typography>
              //     <Button variant="contained" color="primary">
              //         Learn More
              //     </Button>
              // </div>
              <div>
                <Grid>
                  <Card style={{ backgroundColor: "#fffff", height: "3.7rem" }}>
                    {/* <CardHeader title="Please choose a doctor and select an appointment to check in." style={{fontSize:'2px'}} /> */}
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ padding: "1rem", fontSize: "1rem", color: "red" }}
                    >
                      Please choose a doctor and select an appointment to check in.
                    </Typography>
                  </Card>
                  {/* Advertisement with image */}
                  {/* if pharmacy_adv  */}
                </Grid>

                {pharmacy_adv && (
                  <Grid sx={{ paddingTop: "0.8rem" }}>
                    {/* card with image */}
                    <Card sx={{ maxWidth: "35rem", minHeight: "20rem", position: "relative" }}>
                      <AdMark cardHeight={20} />
                      <CardMedia
                        component="img"
                        // height="140"
                        image={pharmacy_adv.image3}
                        alt="green iguana"
                      />
                    </Card>
                  </Grid>
                )}
              </div>
            )}
          </Grid>
          {/* </Grid> */}
        </Grid>
        <Grid container spacing={3} paddingTop={1} position="relative" top="1rem">
          <Grid item xs={12}>
            {pharmacy_adv && (
              <Card style={{ maxHeight: "10rem", backgroundColor: "#ffffff" }}>
                <AdMark cardHeight={5} />
                <CardMedia
                  component="img"
                  alt="Advertisement Image"
                  height="140"
                  image={pharmacy_adv.image2} // asign pharmacy image here
                />
                {/* <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {pharmacy_adv.title}
                                    </Typography>
                                    <Typography variant="body1">
                                        {pharmacy_adv.description}
                                    </Typography>
                                </CardContent> */}
              </Card>
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
                    value={formatHin(updatedInfo.phone)}
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
                    value={formatHin(updatedInfo.alternative_phone)}
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
                <Button onClick={close_userinfo_model} style={{ color: "red" }}>
                  Close
                </Button>
                {!update_info && <Button onClick={handleCloseDialog}>Update info</Button>}

                <Button variant="contained" onClick={handleSubmitCheckIn}>
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
