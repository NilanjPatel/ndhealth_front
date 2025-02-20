import API_BASE_PATH from "../../../apiConfig";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  CardHeader,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HelmetComponent from "../SEO/HelmetComponent";
import { makeStyles } from "@mui/styles";
import {
  formatHin,
  formatPostalCode,
  formatPhone,
  isValidEmail,
  validatePassword,
  checkUsername,
} from "../resources/utils";
import NotificationDialog from "../resources/Notification";
import { SEX_CHOICES, PROVINCE_CHOICES } from "../resources/variables";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
  },
  form: {
    width: "100%", // Full width for smaller screens
    [theme.breakpoints.up("sm")]: {
      width: "80%", // Adjust width for medium screens
    },
    [theme.breakpoints.up("md")]: {
      width: "70%", // Adjust width for large screens
    },
    margin: "auto", // Center the form horizontally
    marginTop: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
  usernameAvailable: {
    "& .MuiInputBase-root": {
      borderColor: "green",
      color: "green",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "green",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
  },
  usernameUnavailable: {
    "& .MuiInputBase-root": {
      borderColor: theme.palette.error.main,
      color: theme.palette.error.main,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: theme.palette.error.main,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: theme.palette.error.main,
    },
  },
}));

const CreateNewStaff = ({ clinicSlug, clinicId }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [color, setColor] = useState("#FFFF"); //tyo set locum

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [completeTheform, setCompleteTheForm] = useState(false);
  const [passwordmatch, setPasswordmatch] = React.useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [isUsernameAvailable, SetIsUsernameAvailable] = useState(true);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal: "",
    username: "",
    password: "",
    password1: "",
  });
  const [userNameNotice, setUserNameNotice] = useState("");

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    handelpassword();
  }, [userData.password, userData.password1]);

  useEffect(() => {
    if (userData.username.length > 4) {
      handleUsernameChange();
      setUserNameNotice("");
    } else if (userData.username === "") {
      SetIsUsernameAvailable(true);
    } else {
      setUserNameNotice("should be greater than 4 characters");
      SetIsUsernameAvailable(false);
    }
  }, [userData.username]);
  const handleEmailChange = (value) => {
    setEmail(value);

    // Validate email format
    const isValid = isValidEmail(value);
    setIsEmailValid(isValid);
  };

  const handelpassword = () => {
    if (
      validatePassword(userData.password, userData.password1) &&
      userData.password === userData.password1
    ) {
      setPasswordmatch(true);
      setPasswordError("Password did matchd");
    } else if (userData.password === "" || userData.password1 === "") {
      setPasswordmatch(true);
      setPasswordError("Password did matchd");
    } else {
      setPasswordError("Password did not match");
      setPasswordmatch(false);
    }
  };
  const handleChange = (field, value) => {
    // const {field, value} = e.target;
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
    }

    setUserData((prevInfo) => ({
      ...prevInfo,
      [field]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_PATH}/create-staff/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${accessToken}`,
        },
        body: JSON.stringify({
          clinic_id: clinicId,
          user: userData,
        }),
      });
      const data = await response.json();

      if (data.status === "success") {
        handleSuccess(data.message);
        setUserData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          province: "",
          postal: "",
          username: "",
          password: "",
          password1: "",
        });
        // Redirect or navigate to another page upon successful creation
        // navigate('/dashboard'); // Adjust the path as needed
      } else {
        handleFailure("Please try again, something went wrong!");
        // console.Error('Error creating staff:', Error);
      }
    } catch (error) {
      handleFailure("Please try again, something went wrong!");
      console.error("Error creating staff:", error);
    }
  };

  const handleUsernameChange = async () => {
    try {
      const response = await checkUsername(userData.username);
      const data = response.data;
      if (data.status === "success") {
        if (data.available === true) {
          SetIsUsernameAvailable(true);
          setUserNameNotice("Available");
        } else if (data.available === false) {
          SetIsUsernameAvailable(false);
          setUserNameNotice("Username is not Available");
        }
      } else if (data.status === "failed") {
        handleFailure(data.message);
      }
    } catch (error) {
      handleFailure(error);
      // console.Error('Error creating staff:', Error);
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
      <HelmetComponent title="Create New Staff" />
      <Card
      // className={classes.card}
      >
        <CardHeader title="Create New Staff" />
        <CardContent>
          <FormControl
            className={classes.form}
            onSubmit={handleSubmit}
            PaperProps={{ style: { boxShadow: `0 0 65px 10px ${color}` } }}
          >
            <Grid container spacing={2} padding={2}>
              {/* Left Side */}
              <Grid item xs={12} md={6} container spacing={2}>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    label="First Name"
                    name="first_name"
                    value={userData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={12} lg={6}>
                  <TextField
                    label="Last Name"
                    name="last_name"
                    value={userData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    type="email"
                    label={!isEmailValid ? "Invalid email address" : "Email"}
                    name="email"
                    value={userData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    fullWidth
                    error={!isEmailValid}
                    // helperText={!isEmailValid ? 'Invalid email address' : ''}
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={userData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    label="Address"
                    name="address"
                    value={userData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    label="City"
                    name="city"
                    value={userData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="province-label">Province</InputLabel>
                    <Select
                      labelId="province-label"
                      id="province"
                      label="Province"
                      fullWidth
                      value={userData.province}
                      onChange={(e) => handleChange("province", e.target.value)}
                    >
                      {PROVINCE_CHOICES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    label="Postal Code"
                    name="postal"
                    value={userData.postal}
                    onChange={(e) => handleChange("postal", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    label="Username"
                    name="newndusername"
                    value={userData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    fullWidth
                    error={!isUsernameAvailable}
                    helperText={!isUsernameAvailable ? userNameNotice : ""}
                    className={
                      isUsernameAvailable ? classes.usernameAvailable : classes.usernameUnavailable
                    }
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    label="Password"
                    name="newndpassword"
                    value={userData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    fullWidth
                    type={"password"}
                    helperText={!passwordmatch ? passwordError : ""}
                    error={!passwordmatch}
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    label="Repet Password"
                    name="repet Password"
                    value={userData.password1}
                    onChange={(e) => handleChange("password1", e.target.value)}
                    fullWidth
                    helperText={!passwordmatch ? passwordError : ""}
                    type="password"
                    error={!passwordmatch}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Submit Button at the bottom left */}
            <Grid container justifyContent="flex-start">
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submitButton}
                  onClick={handleSubmit}
                >
                  Create Staff
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </CardContent>
      </Card>
      <NotificationDialog
        open={openModal}
        onClose={setOpenModal}
        content={modalContent}
        isError={isError}
      />
    </div>
  );
};

export default CreateNewStaff;
