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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { formatPostalCode, formatDob, formatPhone, isValidEmail } from "./../../../resources/utils";
import { SEX_CHOICES, PROVINCE_CHOICES, STATUS } from "./../../../resources/variables";
import { StyledTableCell, StyledTableRow } from "./../../../resources/uiComponents";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxWidth: "100%",
  },
}));

const ClinicDoctors = () => {
  const [listOfCurrentDoctory, setListOfCurrentDoctors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  // const [email, setEmail] = useState('');
  // const [phone, setPhone] = useState('');
  // const [agreedElectronic, setAgreedElectronic] = useState(false);
  // const [accountStatus, setAccountStatus] = useState(1);
  // const [address, setAddress] = useState('');
  // const [city, setCity] = useState('');
  // const [province, setProvince] = useState('');
  // const [postal, setPostal] = useState('');
  // const [username, setUsername] = useState('');
  // const [ohipBilling, setOhipBilling] = useState('NA');
  // const [CPSO, setCPSO] = useState('NA');
  // const [homePhone, setHomePhone] = useState('NA');
  // const [emergencyContactName, setEmergencyContactName] = useState('NA');
  // const [emergContactNumber, setEmergContactNumber] = useState('NA');
  // const [dateStarted, setDateStarted] = useState(null); // This will be a Date object
  // const [dateTerminated, setDateTerminated] = useState(null); // This will be a Date object

  const [doctor, setDoctor] = useState({
    id: null,
    user: {
      id: null,
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      agreedElectronic: false,
      address: "",
      city: "",
      province: "",
      postal: "",
      accountStatus: 1,
    },
    clinic: null,
    ohipBilling: "NA",
    CPSO: "NA",
    homePhone: "NA",
    emergencyContactName: "NA",
    emergContactNumber: "NA",
    dateStarted: null,
    dateTerminated: null,
  });

  const [isEmailValid, setIsEmailValid] = useState(true);

  const [selectedID, setSelectedID] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const [modalContent, setModalContent] = useState("");

  const classes = useStyles();

  useEffect(() => {
    getCurrentDoctorsList();
  }, []);

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

  const handelDoctorSelect = async (row) => {
    setSelectedID(row.id);

    setDoctor({
      ...row,
      user: {
        ...row.user,
      },
    });
    setIsDialogOpen(true);
  };
  // const handelDoctorSelect = async (row) => {
  //     setSelectedID(row.id);
  //     setFirstName(row.user.first_name);
  //     setLastName(row.user.last_name);
  //     setAddress(row.user.address);
  //     setCity(row.user.city);
  //     setProvince(row.user.province);
  //     setPostal(row.user.postal);
  //     setOhipBilling(row.ohipBilling);
  //     setCPSO(row.CPSO);
  //     setHomePhone(row.homePhone);
  //     setEmergencyContactName(row.emergencyContactName);
  //     setEmergContactNumber(row.emergContactNumber);
  //     setUsername(row.user.username);
  //     setEmail(row.user.email);
  //     setPhone(row.user.phone);
  //     setAccountStatus(row.user.accountStatus);

  //     // setIsDialogOpen(true);
  // };

  const handleLocationDelete = async (row) => {};

  const updateDoctorProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_PATH}/update_doctor_profile/${selectedID}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          doctor,
        }),
      });
      const data = await response.json();
      getCurrentDoctorsList();
      setOpenModal(true);
      setModalContent("Location Updated Successfully");
      close_model();
    } catch (error) {
      console.error("Error fetching clinic notices:", error);
      setOpenModal(true);
      setModalContent("Error Updating Location Please try Again");
    }
  };

  const handleInputChange = (field, value) => {
    // Apply any necessary formatting methods
    let formattedValue = value;
    if (field === "first_name") {
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        user: { ...prevDoctor.user, first_name: value },
      }));
    }
    if (field === "last_name") {
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        user: { ...prevDoctor.user, last_name: value },
      }));
    } else if (field === "postal") {
      formattedValue = formatPostalCode(value);
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        user: { ...prevDoctor.user, postal: formattedValue },
      }));
    } else if (field === "city") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, user: { ...prevDoctor.user, city: value } }));
    } else if (field === "CPSO") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, CPSO: value }));
    } else if (field === "address") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, user: { ...prevDoctor.user, address: value } }));
    } else if (field === "province") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, user: { ...prevDoctor.user, province: value } }));
    } else if (field === "username") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, user: { ...prevDoctor.user, username: value } }));
    } else if (field === "cpso") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, color: value }));
    } else if (field === "ohipBilling") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, ohipBilling: value }));
    } else if (field === "phone") {
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        user: { ...prevDoctor.user, phone: formatPhone(value) },
      }));
    } else if (field === "emergContactNumber") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, emergContactNumber: formatPhone(value) }));
    } else if (field === "emergencyContactName") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, emergencyContactName: value }));
    } else if (field === "homePhone") {
      setDoctor((prevDoctor) => ({ ...prevDoctor, homePhone: formatPhone(value) }));
    } else if (field === "email") {
      const isValid = isValidEmail(value.toLowerCase());
      setIsEmailValid(isValid);
      setDoctor((prevDoctor) => ({ ...prevDoctor, user: { ...prevDoctor.user, email: value } }));
    } else if (field === "accountStatus") {
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        user: { ...prevDoctor.user, accountStatus: value },
      }));
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const close_model = () => {
    setIsDialogOpen(false);
    setIsEmailValid(true);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        className={classes.tableContainer}
        style={{ width: "100%" }}
      >
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell style={{ fontWeight: "bold" }}>Name </StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Address</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>City</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>CPSO</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Postal</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bold" }}>Emergency-contact</StyledTableCell>
              {/* <StyledTableCell style={{ fontWeight: 'bold' }}></StyledTableCell> */}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {listOfCurrentDoctory.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>
                  Dr. {row.user.first_name} {row.user.last_name}
                </StyledTableCell>
                <StyledTableCell>{row.user.address}</StyledTableCell>
                <StyledTableCell>{row.user.city}</StyledTableCell>
                <StyledTableCell>{row.CPSO}</StyledTableCell>
                {/* <StyledTableCell>{row.province}</StyledTableCell> */}
                <StyledTableCell>{row.user.postal}</StyledTableCell>
                <StyledTableCell>{row.emergContactNumber}</StyledTableCell>

                {/* <StyledTableCell>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handelDoctorSelect(row)}
                                    >
                                        Update
                                    </Button>
                                </StyledTableCell> */}
                {/* <StyledTableCell>
                                    <Button
                                        variant="outlined"
                                        style={{ color: 'red' }}
                                        onClick={() => handleLocationDelete(row)}
                                    >
                                        Delete
                                    </Button>
                                </StyledTableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={isDialogOpen}
        BackdropComponent={Backdrop}
        PaperProps={{ style: { boxShadow: `0 0 65px 10px #d1c4e9` } }}
      >
        <DialogTitle>
          Change Details of Dr. {doctor.user.first_name} {doctor.user.last_name}
        </DialogTitle>
        <DialogContent>
          {/* Display editable patient details */}
          <Grid container spacing={2} paddingLeft={1} paddingRight={1} paddingTop={2}>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="First Name"
                value={doctor.user.first_name}
                inputMode="text"
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                Placeholder="First Name"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Last Name"
                value={doctor.user.last_name}
                inputMode="text"
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                Placeholder="Last Name"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Username"
                value={doctor.user.username}
                inputMode="text"
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Username"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Address"
                value={doctor.user.address}
                inputMode="text"
                onChange={(e) => handleInputChange("address", e.target.value)}
                Placeholder="Address "
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="City"
                value={doctor.user.city}
                inputMode="text"
                onChange={(e) => handleInputChange("city", e.target.value)}
                Placeholder="City"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="province-label">Province</InputLabel>
                <Select
                  labelId="province-label"
                  id="province"
                  label="Province"
                  fullWidth
                  value={doctor.user.province}
                  onChange={(e) => handleInputChange("province", e.target.value)}
                >
                  {PROVINCE_CHOICES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Postal"
                value={doctor.user.postal}
                inputMode="text"
                onChange={(e) => handleInputChange("postal", e.target.value)}
                Placeholder="Postal"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="CPSO"
                value={doctor.CPSO}
                inputMode="text"
                onChange={(e) => handleInputChange("CPSO", e.target.value)}
                placeholder="CPSO"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="OHIP Billing"
                value={doctor.ohipBilling}
                inputMode="text"
                onChange={(e) => handleInputChange("ohipBilling", e.target.value)}
                placeholder="OHIP Billing"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Phone"
                value={doctor.user.phone}
                inputMode="tel"
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Phone"
                fullWidth
                type="tel"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Emergency Contact Name"
                value={doctor.emergencyContactName}
                inputMode="text"
                onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                placeholder="Emergency Contact Name"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Emergency Contact Number"
                value={doctor.emergContactNumber}
                inputMode="text"
                onChange={(e) => handleInputChange("emergContactNumber", e.target.value)}
                placeholder="Emergency Contact Number"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Home Phone"
                value={doctor.homePhone}
                inputMode="text"
                onChange={(e) => handleInputChange("homePhone", e.target.value)}
                placeholder="Home Phone"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Email"
                value={doctor.user.email}
                inputMode="email"
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email"
                fullWidth
                type="email"
                error={!isEmailValid}
                helperText={!isEmailValid ? "Invalid email address" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              {/* <TextField
                                label="Account Status"
                                value={doctor.user.accountStatus}
                                inputMode="text"
                                onChange={(e) => handleInputChange('accountStatus', e.target.value)}
                                placeholder="Account Status"
                                fullWidth
                                type="text"
                            /> */}

              <FormControl fullWidth>
                <InputLabel id="Account-Status-label">Account Status</InputLabel>
                <Select
                  labelId="Account-Status-label"
                  id="Account-Status"
                  label="Account Status"
                  fullWidth
                  value={doctor.user.accountStatus}
                  onChange={(e) => handleInputChange("accountStatus", e.target.value)}
                >
                  {STATUS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={close_model}
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "red",
              backgroundColor: "white",
            }}
          >
            Close
          </Button>
          {/* TODO disable if no change have made */}
          {/* {!update_info && ( */}
          <Button
            variant="contained"
            onClick={updateDoctorProfile}
            style={{ fontSize: "1rem", fontWeight: "bold" }}
          >
            Update
          </Button>
          {/* )} */}
        </DialogActions>
      </Dialog>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>{modalContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClinicDoctors;
