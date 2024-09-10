import API_BASE_PATH from "../../../../../apiConfig";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  CardHeader,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { formatPostalCode } from "./../../../resources/utils";
import {
  SEX_CHOICES,
  PROVINCE_CHOICES,
  STATUS,
  STATUS_SIGN,
  DOCTOR_TYPE,
} from "./../../../resources/variables";
import { StyledTableCell, StyledTableRow } from "./../../../resources/uiComponents";
import { ChromePicker } from "react-color"; // Importing the color picker component

import NotificationDialog from "../../../resources/Notification";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxWidth: "100%",
  },
}));

const AssignLocation = () => {
  const [listOfCurrentLocations, setListOfCurrentLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listOfCurrentDoctors, setListOfCurrentDoctors] = useState([]);
  const [listOfCurrentLinks, setListOfCurrentLinks] = useState([]);

  const [providerNumber, setProviderNumber] = useState(""); //tyo set locum
  const [accountStatus, setAccountStatus] = useState(0); //tyo set locum
  const [docType, setDocType] = useState(""); //tyo set locum
  const [videoApp, setVideoApp] = useState(0); //tyo set locum
  const [phoneApp, setPhoneApp] = useState(0); //tyo set locum
  const [clinicApp, setClinicApp] = useState(0); //tyo set locum
  const [color, setColor] = useState("#FFFF"); //tyo set locum
  const [locum, setLocum] = useState(0); //tyo set locum >> switch
  const [selectedDoctorID, setSelectedDoctorID] = useState("");
  const [selectedLocationID, setSelectedLocationID] = useState("");
  const [update_or_add, setUpdate_or_add] = useState("");
  const [apiMethod, setApiMethod] = useState("");
  const [updateID, setUpdateID] = useState("");
  const [endURL, setEndURL] = useState("");
  const classes = useStyles();

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    DoctorLocationlinks();
    getCurrentLocationList();
    getCurrentDoctorsList();
  }, []);
  // useEffect(() => {
  // }, [selectedDoctorID, selectedLocationID]);
  const DoctorLocationlinks = async () => {
    const response = await fetch(`${API_BASE_PATH}/doctors-location/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("accessToken")}`,
      },
    });

    const data = await response.json();

    setListOfCurrentLinks(data);
  };
  const getCurrentLocationList = async () => {
    const response = await fetch(`${API_BASE_PATH}/location/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("accessToken")}`,
      },
    });

    const data = await response.json();

    setListOfCurrentLocations(data);
  };
  const addLocationwithDoctor = async () => {
    try {
      const response = await fetch(`${API_BASE_PATH}/${endURL}`, {
        method: `${apiMethod}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          providerNumber: providerNumber, //"117"
          accountStatus: accountStatus, //0,
          docType: docType, //"Family Doctor",
          videoApp: videoApp, //0,
          phoneApp: phoneApp, // 0,
          clinicApp: clinicApp, //0,
          color: color, //"#4db6ac",
          switch: locum, // 0,
          doctor: selectedDoctorID, //2,
          location: selectedLocationID, //2
        }),
      });
      const data = await response.json();
      handleSuccess("Doctor's information with the location is updated Successfully");
      // setListOfCurrentLocations(data);
      DoctorLocationlinks();
      closeDoctorUpdateDialog();
    } catch (error) {
      handleFailure("Error Updating Doctor's information with the location. Please Try Again.");
      console.error("Error fetching clinic notices:", error);
    }
  };
  const getCurrentDoctorsList = async () => {
    const response = await fetch(`${API_BASE_PATH}/doctors/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("accessToken")}`,
      },
    });

    const data = await response.json();

    setListOfCurrentDoctors(data);
  };
  const handleDoctorChange = (currentid) => {
    setSelectedDoctorID(currentid);
  };
  const handleLocationChange = (currentid) => {
    setSelectedLocationID(currentid);
  };
  const handleProviderNumberChange = (value) => {
    setProviderNumber(value);
  };
  const handleAccountStatusChange = (value) => {
    setAccountStatus(value);
  };
  const handleDocTypeChange = (value) => {
    setDocType(value);
  };
  const handleVideoAppointmentChange = (value) => {
    setVideoApp(value);
  };
  const handlePhoneAppointmentChange = (value) => {
    setPhoneApp(value);
  };
  const handleClinicAppointmentChange = (value) => {
    setClinicApp(value);
  };
  const handleLocumNumberChange = (value) => {
    setLocum(value);
  };
  const handleColorChange = (value) => {
    setColor(value);
  };

  const openToAddNewDoctor = () => {
    setUpdate_or_add("Assign Location to Doctor");
    setIsDialogOpen(true);
    setApiMethod("POST");
    setEndURL("doctors-location/");

    handleAccountStatusChange(0);
    handleClinicAppointmentChange(0);
    handleDocTypeChange("");
    handleDoctorChange("");
    handleLocationChange("");
    handlePhoneAppointmentChange(0);
    handleProviderNumberChange("");
    handleLocumNumberChange("");
    handleVideoAppointmentChange("");
  };

  const closeDoctorUpdateDialog = () => {
    setIsDialogOpen(false);
  };

  const handelDoctor_with_Location_Update = (row) => {
    setUpdateID(row.id);
    handleAccountStatusChange(row.accountStatus);
    handleClinicAppointmentChange(row.clinicApp);
    handleDocTypeChange(row.docType);
    handleDoctorChange(row.doctor);
    handleLocationChange(row.location);
    handlePhoneAppointmentChange(row.phoneApp);
    handleProviderNumberChange(row.providerNumber);
    handleLocumNumberChange(row.switch);
    handleVideoAppointmentChange(row.videoApp);
    setUpdate_or_add("Update Doctor With Location");
    setIsDialogOpen(true);
    setApiMethod("PUT");
    setEndURL(`doctors-location/${row.id}/`);
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
    <>
      <Typography>Records by Doctor's Working Location</Typography>
      <TableContainer
        component={Paper}
        className={classes.tableContainer}
        style={{ width: "100%" }}
      >
        <Table>
          <caption>
            <Button
              variant="contained"
              onClick={openToAddNewDoctor}
              style={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              Assign new Doctor to a Location
            </Button>
          </caption>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell style={{ fontWeight: "bold" }}>Location</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Name </StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Provider Number </StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Status</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Doctor type</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Phone</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Video</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Clinic</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Update</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {listOfCurrentLinks.map((row) => {
              // Find the corresponding doctor object
              const doctor = listOfCurrentDoctors.find((doc) => doc.id === row.doctor);
              const location = listOfCurrentLocations.find((loc) => loc.id === row.location);
              const statusLabel = STATUS.find(
                (status) => status.value === row.accountStatus
              )?.label;
              const doctorType = STATUS.find((status) => status.value === row.docType)?.label;
              const phonetype = STATUS_SIGN.find((status) => status.value === row.phoneApp)?.label;
              const videotype = STATUS_SIGN.find((status) => status.value === row.videoApp)?.label;
              const clinictype = STATUS_SIGN.find(
                (status) => status.value === row.clinicApp
              )?.label;

              return location ? (
                <StyledTableRow key={row.id}>
                  {/* <TableCell>{row.doctor}</TableCell> */}
                  <StyledTableCell>{location.name}</StyledTableCell>
                  <StyledTableCell>
                    {doctor ? `${doctor.user.first_name} ${doctor.user.last_name}` : "Unknown"}
                  </StyledTableCell>
                  <StyledTableCell>{row.providerNumber}</StyledTableCell>
                  <StyledTableCell>{statusLabel ? statusLabel : "Unknown"}</StyledTableCell>
                  <StyledTableCell>{doctorType}</StyledTableCell>
                  <StyledTableCell>{phonetype}</StyledTableCell>
                  <StyledTableCell>{videotype}</StyledTableCell>
                  <StyledTableCell>{clinictype}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="outlined"
                      // onClick={addLocationwithDoctor}
                      onClick={() => handelDoctor_with_Location_Update(row)}
                      style={{ fontSize: "1rem", fontWeight: "bold" }}
                    >
                      Update
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                <div key={row.id}>
                  <Card>
                    <CardHeader title="Loading..." />
                  </Card>
                </div>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Dialog
          open={isDialogOpen}
          BackdropComponent={Backdrop}
          PaperProps={{ style: { boxShadow: `0 0 65px 10px ${color}` } }}
        >
          <Grid container spacing={2} padding={2}>
            <Grid item xs={6} md={12} lg={12}>
              <Typography variant="h6" component="h2">
                Assign Doctor to a Location
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="doctor-label">Select Doctor</InputLabel>
                <Select
                  labelId="doctor-label"
                  id="doctor"
                  label="Select Doctor"
                  fullWidth
                  value={selectedDoctorID}
                  onChange={(e) => handleDoctorChange(e.target.value)}
                >
                  {listOfCurrentDoctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.user.first_name} {doctor.user.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="Location-label">Select Location</InputLabel>
                <Select
                  labelId="location-label"
                  id="location"
                  label="Select Location"
                  fullWidth
                  value={selectedLocationID}
                  onChange={(e) => handleLocationChange(e.target.value)}
                >
                  {listOfCurrentLocations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              {/* Provider number */}
              <TextField
                label="Provider number"
                value={providerNumber}
                inputMode="text"
                onChange={(e) => handleProviderNumberChange(e.target.value)}
                Placeholder="Provider number"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              {/* Account Status */}
              <FormControl fullWidth>
                <InputLabel id="account">Account Status</InputLabel>
                <Select
                  labelId="account"
                  id="account"
                  label="Account Status"
                  fullWidth
                  value={accountStatus}
                  onChange={(e) => handleAccountStatusChange(e.target.value)}
                >
                  {STATUS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              {/* Doctor Type */}
              <FormControl fullWidth>
                <InputLabel id="doctorType">Doctor Type</InputLabel>
                <Select
                  labelId="doctorType"
                  id="doctorType"
                  label="Doctor Type"
                  fullWidth
                  value={docType}
                  onChange={(e) => handleDocTypeChange(e.target.value)}
                >
                  {DOCTOR_TYPE.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              {/* Video App */}
              <FormControl fullWidth>
                <InputLabel id="video">Video Appointment</InputLabel>
                <Select
                  labelId="video"
                  id="video"
                  label="Video Appointment"
                  fullWidth
                  value={videoApp}
                  onChange={(e) => handleVideoAppointmentChange(e.target.value)}
                >
                  {STATUS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              {/* Phone App */}
              <FormControl fullWidth>
                <InputLabel id="phone">Phone Appointment</InputLabel>
                <Select
                  labelId="phone"
                  id="phone"
                  label="Phone Appointment"
                  fullWidth
                  value={phoneApp}
                  onChange={(e) => handlePhoneAppointmentChange(e.target.value)}
                >
                  {STATUS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              {/* Clinic App */}
              <FormControl fullWidth>
                <InputLabel id="clinic">In-Clinic Appointment</InputLabel>
                <Select
                  labelId="clinic"
                  id="clinic"
                  label="In-Clinic Appointment"
                  fullWidth
                  value={clinicApp}
                  onChange={(e) => handleClinicAppointmentChange(e.target.value)}
                >
                  {STATUS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              {/* Locum Provider Number */}

              <TextField
                label="Locum number"
                value={locum}
                inputMode="text"
                onChange={(e) => handleLocumNumberChange(e.target.value)}
                Placeholder="Locum number"
                fullWidth
                type="text"
              />
              <InputLabel>
                <small>(If set to 0, it means no locum is set to this Doctor.</small>
              </InputLabel>
              <InputLabel>
                <small>If you want to set Locum Doctor to this Doctor, write</small>
              </InputLabel>
              <InputLabel>
                <small>Locum Dr's provider Number.)</small>
              </InputLabel>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              {/* Color App */}
              {/* <TextField
                            label="Doctor's Identification Color"
                            value={color}
                            inputMode="text"
                            onChange={(e) => handleColorChange(e.target.value)}
                            Placeholder="Doctor's Identification Color"
                            fullWidth
                            type="text"/>

                        <ChromePicker
                        id="color-input"
                        color={color}
                        onChange={(newColor) => handleColorChange(newColor.hex)}/>

                        
                        <InputLabel ><small>(This is for just to Identify the doctor.)</small></InputLabel>
                        */}
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              {/* Color App */}
              <Button
                variant="contained"
                onClick={addLocationwithDoctor}
                style={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                {update_or_add}
              </Button>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              {/* Color App */}
              <Button
                variant="contained"
                onClick={closeDoctorUpdateDialog}
                style={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Dialog>

        <NotificationDialog
          open={openModal}
          onClose={setOpenModal}
          content={modalContent}
          isError={isError}
        />
      </div>
    </>
  );
};

export default AssignLocation;
