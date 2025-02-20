// AddAppointmentComponent.js

import React, { useState, useEffect } from "react";
import API_BASE_PATH from "../../../../../apiConfig";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CardHeader,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "./../../../resources/uiComponents";
import { makeStyles } from "@mui/styles";
import NotificationDialog from "../../../resources/Notification";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxWidth: "100%",
  },
}));

const AddAppointmentComponent = () => {
  const [appointments, setAppointments] = useState([]);
  const [bookCode, setBookCode] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [clinicBookcodeNames, setClinicBookcodeNames] = useState([]);
  const [appointmentTypes, setAppointmenttypes] = useState([]);
  const classes = useStyles();

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchClinicbookcodeNames();
    fetchAppointmenttypes();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${API_BASE_PATH}/clinic-appointment-types/`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();

      setAppointments(data);
    } catch (error) {
      console.error("Error fetching clinic Bookcodes:", error);
    }
  };

  const fetchClinicbookcodeNames = async () => {
    try {
      const response = await fetch(
        `${API_BASE_PATH}/clinic-bookcode-names/`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setClinicBookcodeNames(data);
    } catch (error) {
      console.error("Error fetching clinic Bookcodes:", error);
    }
  };
  const fetchAppointmenttypes = async () => {
    try {
      const response = await fetch(
        `${API_BASE_PATH}/clinic-appointmenttypes/`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();

      setAppointmenttypes(data);
    } catch (error) {
      console.error("Error fetching clinic Bookcodes:", error);
    }
  };

  const handleUpdateAppType = async () => {
    // get id of notice using selected name

    const appointmentid = appointmentTypes.find((type) => type.name === appointmentType).id;

    const bookcodeid = clinicBookcodeNames.find((code) => code.name === bookCode).id;

    const currentAppID = appointments.find((app) => app.appointmenttype.name == appointmentType).id;
    //  get if of notice using notice name
    // const noticeId = clinicNoticeNames.find((notice) => notice.name === selectedName);

    try {
      const response = await fetch(
        `${API_BASE_PATH}/clinic-appointmentType/update/${currentAppID}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ bookCode_id: bookcodeid, appointmenttype_id: appointmentid }),
        }
      );
      const updatedNotice = await response.json();
      setAppointments((prevNotices) =>
        prevNotices.map((notice) =>
          notice.id === bookCode ? { ...notice, notice: updatedNotice.notice } : notice
        )
      );
      // fetchAppointmenttypes();
      // fetchClinicbookcodeNames();
      fetchAppointments();

      setBookCode("");
      handleSuccess("Appointment Type is Successfully Updated.");
    } catch (error) {
      handleFailure("Error updating Appointment Type, please try again.");
      console.error("Error updating clinic notice:", error);
    }
  };

  const handlenoticeChange = (event) => {
    setBookCode(event);
  };
  const handleApptypeChange = (event) => {
    setAppointmentType(event);
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
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid item xs={12} md={12} lg={12}>
          <Typography>List of appointment type code assigned to appointment type</Typography>
          <TableContainer
            component={Paper}
            className={classes.tableContainer}
            style={{ width: "100%" }}
          >
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell style={{ fontWeight: "bold" }}>
                    Appointment Type Code
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }}>Appointment Type</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => {
                  // Find the corresponding doctor object

                  return (
                    <StyledTableRow key={appointment.appointmenttype.id}>
                      {/* <TableCell>{row.doctor}</TableCell> */}
                      <StyledTableCell>{appointment.bookCode.name}</StyledTableCell>
                      <StyledTableCell>{appointment.appointmenttype.name}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={6} md={12} lg={12}>
          <Typography>Update appointment type code with appointment type:</Typography>
        </Grid>
        <Grid item xs={6} md={12} lg={12}>
          <FormControl>
            <InputLabel id="name-label">Select Book Code</InputLabel>
            {/* <placeholder>Select time slot: </placeholder> */}
            <Select
              labelId="name-label"
              id="name"
              label="Select Bookcode Name"
              value={bookCode}
              onChange={(e) => handlenoticeChange(e.target.value)}
              style={{ minWidth: "15rem" }}
            >
              {clinicBookcodeNames.map((name) => (
                <MenuItem key={name.id} value={name.name}>
                  {name.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} md={12} lg={12}>
          <FormControl>
            <InputLabel id="name-label">Select AppointmentType</InputLabel>
            {/* <placeholder>Select time slot: </placeholder> */}
            <Select
              labelId="name-label"
              id="name"
              label="Select AppointmentType"
              value={appointmentType}
              onChange={(e) => handleApptypeChange(e.target.value)}
              style={{ minWidth: "15rem" }}
            >
              {appointmentTypes.map((name) => (
                <MenuItem key={name.id} value={name.name}>
                  {name.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} md={12} lg={12}>
          <Button
            variant="outlined"
            onClick={() => handleUpdateAppType()}
            disabled={!bookCode || !appointmentType}
          >
            Update
          </Button>
        </Grid>
      </Grid>

      <NotificationDialog
        open={openModal}
        onClose={setOpenModal}
        content={modalContent}
        isError={isError}
      />
    </div>
  );
};

export default AddAppointmentComponent;
