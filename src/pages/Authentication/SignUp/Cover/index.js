import React, { useEffect, useState } from "react";
// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import { Dialog, DialogContent, DialogTitle, FormControlLabel, Switch, Grid } from "@mui/material";
import NotificationDialog from "../../../../nd_health/components/resources/Notification";

// @mui/joi
import NdLoader from "nd_health/components/resources/Ndloader";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Authentication layout components
import BasicLayout from "pages/Authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import {
  checkUsername,
  formatPhone,
  formatPostalCode,
  isValidEmail,
  isValidPhoneNumber,
  isValidPostalCode,
  validatePassword,
} from "../../../../nd_health/components/resources/utils";
import API_BASE_PATH from "../../../../apiConfig";

// import { red } from "@mui/material/colors";

function Cover() {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPostalValid, setIsPostalValid] = useState(true);
  const [isUserValid, setIsUserValid] = useState(true);
  const [isOhipValid, setIsOhipValid] = useState(true);
  const [isClinicNameValid, setIsClinicNameValid] = useState(true);
  const [passwordmatch, setPasswordmatch] = React.useState(true);
  const [passwordError, setPasswordError] = useState("");

  const [userNameNotice, setUserNameNotice] = useState("");

  const [agreementChecked, setAgreementChecked] = useState(false);
  const [openAgreementPopup, setOpenAgreementPopup] = useState(false);
  const [termsInfo, settermsInfo] = useState(null);

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [submitbutton, setSubmitbutton] = useState(true);
  const [successSignup, setSuccessSignup] = useState(false);
  const navigate = useNavigate();
  const [updatedInfo, setUpdatedInfo] = useState({
    address: "",
    city: "",
    postal: "",
    phone: "",
    email: "",
    clinicname: "",
    ohip: "",
    username: "",
    password: "",
    password1: "",
  });

  useEffect(() => {
    handelpassword();
  }, [updatedInfo.password, updatedInfo.password1]);

  const handleClose = () => {
    navigate(`/`);

    window.location.reload();
  };

  const handleSignup = async () => {
    setSubmitbutton(false);

    try {
      const response = await fetch(`${API_BASE_PATH}/create-clinic/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          province: "ON",
          postal: updatedInfo.postal,
          clinic_name: updatedInfo.clinicname,
          ohip: updatedInfo.ohip,
        }),
      });
      const data = await response.json();
      console.log(`Response:${JSON.stringify(response)}`);
      if (data.status === "success") {
        setSubmitbutton(true);
        handleSuccess(data.message);
        setSuccessSignup(true);
        setUpdatedInfo({
          address: "",
          city: "",
          postal: "",
          phone: "",
          email: "",
          clinicname: "",
          ohip: "",
          username: "",
          password: "",
          password1: "",
        });
      }
      else {
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
  const handleEmailChange = (value) => {
    // Validate email format
    const isValid = isValidEmail(value.toLowerCase());
    setIsEmailValid(isValid);
  };

  const handelPhoneChange = (value) => {
    setIsPhoneValid(isValidPhoneNumber(value));
  };

  const handlePostalChange = (value) => {
    setIsPostalValid(isValidPostalCode(value));
  };

  useEffect(() => {
    if (updatedInfo.username.length > 4) {
      handleUsernameChange(updatedInfo.username);
      setUserNameNotice("");
    } else if (updatedInfo.username === "") {
      setIsUserValid(true);
    } else {
      setUserNameNotice("should be greater than 4 characters");
      setIsUserValid(false);
    }
  }, [updatedInfo.username]);

  const handleUsernameChange = async (value) => {
    try {
      const response = await checkUsername(value);
      const data = response.data;
      console.log(data);
      if (data.status === "success") {
        if (data.available === true) {
          setIsUserValid(true);
          setUserNameNotice("Available");
        } else if (data.available === false) {
          setIsUserValid(false);
          setUserNameNotice("Username is not Available");
        }
      } else if (data.status === "failed") {
        handleFailure(data.message);
      }
    } catch (error) {
      handleFailure(`error:${error}`);
    }
  };

  const handleInputChange = (field, value) => {
    // Apply any necessary formatting methods
    let formattedValue = value;
    if (field === "phone" || field === "alternative_phone") {
      formattedValue = formatPhone(value);
      handelPhoneChange(formattedValue);
    } else if (field === "email") {
      formattedValue = value.toLowerCase();
      handleEmailChange(formattedValue);
    } else if (field === "postal") {
      formattedValue = formatPostalCode(value);
      handlePostalChange(formattedValue);
    } else if (field === "city") {
      formattedValue = value;
    } else if (field === "version_code") {
      formattedValue = value.toUpperCase();
    } else if (field === "username") {
      // handleUsernameChange(value);
    } else if (field === "ohip") {
      //remove non digit characters
      formattedValue = value.replace(/\D/g, ""); // \D matches any non-digit character

      if (formattedValue.length >= 6) {

        setIsOhipValid(true);
      } else {
        setIsOhipValid(false);
      }
    } else if (field === "clinicname") {
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
    if (
      validatePassword(updatedInfo.password, updatedInfo.password1) &&
      updatedInfo.password === updatedInfo.password1
    ) {
      setPasswordmatch(true);
      setPasswordError("Password did matchd");
    } else if (updatedInfo.password === "" || updatedInfo.password1 === "") {
      setPasswordmatch(true);
      setPasswordError("Password did matchd");
    } else {
      setPasswordError("Password did not match");
      setPasswordmatch(false);
    }
  };
  const handleAgreementChange = () => {
    setAgreementChecked(!agreementChecked);
  };
  const handleAgreementClick = () => {
    const fetchClinicInfo = async () => {
      if (!termsInfo) {
        try {
          const response = await fetch(`${API_BASE_PATH}/agreement-terms/Join/`);

          const data = await response.json();
          settermsInfo(data.message.agreement);
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

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MKBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MKTypography>
          <MKTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MKTypography>
        </MKBox>
        <MKBox p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  type="text"
                  label="Clinic Name"
                  fullWidth
                  value={updatedInfo.clinicname}
                  onChange={(e) => handleInputChange("clinicname", e.target.value)}
                />
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  // margin={"dense"}
                  label="Username"
                  type="text"
                  fullWidth
                  value={updatedInfo.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  error={!isUserValid}
                  helperText={!isUserValid ? userNameNotice : userNameNotice}
                />
              </MKBox>
            </Grid>
            {/*<Grid item xs={12} md={4}>*/}
            {/*  <MKBox>*/}
            {/*    <MKTypography*/}
            {/*      sx={{ color: red[300], fontSize: "small", verticalAlign: "center" }}*/}
            {/*    >*/}
            {/*      {!isUserValid ? userNameNotice : userNameNotice}*/}
            {/*    </MKTypography>*/}
            {/*  </MKBox>*/}
            {/*</Grid>*/}
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  id="outlined-basic"
                  label="Email Address"
                  variant="outlined"
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  value={updatedInfo.email}
                  fullWidth
                  error={!isEmailValid}
                  type="email"
                  // helperText={!isEmailValid ? "Invalid email address" : ""}
                ></MKInput>
              </MKBox>
            </Grid>
            {/*<Grid item xs={12} md={4}>*/}
            {/*  <MKBox>*/}
            {/*    <MKTypography*/}
            {/*      sx={{ color: red[300], fontSize: "small", verticalAlign: "center" }}*/}
            {/*    >*/}
            {/*      {!isEmailValid ? "Invalid email address" : ""}*/}
            {/*    </MKTypography>*/}
            {/*  </MKBox>*/}
            {/*</Grid>*/}
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  autoFocus
                  label="Phone"
                  type="text"
                  fullWidth
                  value={updatedInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  helperText={!isPhoneValid ? "Invalid phone number" : ""}
                  error={!isPhoneValid}
                ></MKInput>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  autoFocus
                  label="Address"
                  value={updatedInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  inputMode="text"
                  placeholder="Address"
                  fullWidth
                  type="text"
                ></MKInput>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  autoFocus
                  label="City"
                  value={updatedInfo.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  inputMode="text"
                  placeholder="City"
                  fullWidth
                  type="text"
                ></MKInput>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  autoFocus
                  label="Postal - XXX-XXX"
                  value={updatedInfo.postal}
                  onChange={(e) => handleInputChange("postal", e.target.value)}
                  inputMode="text"
                  placeholder="Postal - XXX-XXX"
                  fullWidth
                  type="text"
                  helperText={!isPostalValid ? "Invalid postal code" : ""}
                  error={!isPostalValid}
                ></MKInput>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={12}>
              <MKBox>
                <MKInput
                  autoFocus
                  label="Primary Doctor's OHIP Billing number"
                  value={updatedInfo.ohip}
                  onChange={(e) => handleInputChange("ohip", e.target.value)}
                  inputMode="text"
                  placeholder="Primary Doctor's OHIP Billing number"
                  fullWidth
                  type="text"
                ></MKInput>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  label="Password"
                  name="newndpassword"
                  value={updatedInfo.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  fullWidth
                  type="password"
                  helperText={!passwordmatch ? passwordError : ""}
                  error={!passwordmatch}
                ></MKInput>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  label="Repeat Password"
                  name="repeat Password"
                  value={updatedInfo.password1}
                  onChange={(e) => handleInputChange("password1", e.target.value)}
                  fullWidth
                  type="password"
                  helperText={!passwordmatch ? passwordError : ""}
                  error={!passwordmatch}
                ></MKInput>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox>
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
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKTypography onClick={handleAgreementClick} style={{ cursor: "pointer" }}>
                  View Terms and Conditions
                </MKTypography>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox sx={{ display: "flex", gap: 2 }}>
                <MKButton m={2} onClick={handleClose} color="primary">
                  Cancel
                </MKButton>
                <MKButton
                  m={2}
                  onClick={handleSignup}
                  color="info"
                  variant={"contained"}
                  disabled={
                    !isEmailValid ||
                    !isEmailValid ||
                    !isPostalValid ||
                    !isUserValid ||
                    !isPhoneValid ||
                    !isClinicNameValid ||
                    !isOhipValid ||
                    !agreementChecked
                  }
                >
                  Sign Up
                </MKButton>
              </MKBox>
            </Grid>
          </Grid>
        </MKBox>
      </Card>
      <Dialog open={openAgreementPopup} onClose={handleCloseAgreementPopup}>
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent className={"custom-scrollbar"}>
          <div dangerouslySetInnerHTML={{ __html: termsInfo }} />
        </DialogContent>
      </Dialog>
      <NotificationDialog
        open={openModal}
        onClose={setOpenModal}
        content={modalContent}
        isError={isError}
      />
      {!submitbutton && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 900000,
          }}
        >
          <NdLoader size="lg" variant="solid" value={70} color="primary" />
        </div>
      )}
    </BasicLayout>
  );
}

export default Cover;
