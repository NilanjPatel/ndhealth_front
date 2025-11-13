import React, { useEffect, useState, useMemo } from "react";
// react-router-dom components
import { useNavigate } from "react-router-dom";

// framer-motion for animations
import { motion } from "framer-motion";

// @mui material components
import Card from "@mui/material/Card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Box,
  Chip,
  Stack
} from "@mui/material";
import NotificationDialog from "../../../../nd_health/components/resources/Notification";

// @mui/joi
import CircularProgress from "@mui/joy/CircularProgress";

// Material Icons
import {
  LocalHospital as HospitalIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";

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
import { margin, padding } from "@mui/system";

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
  // Calculate form completion progress
  const formProgress = useMemo(() => {
    const fields = [
      updatedInfo.clinicname,
      updatedInfo.username,
      updatedInfo.email,
      updatedInfo.phone,
      updatedInfo.address,
      updatedInfo.city,
      updatedInfo.postal,
      updatedInfo.ohip,
      updatedInfo.password,
      updatedInfo.password1,
      agreementChecked
    ];
    const filledFields = fields.filter(field => field && field.toString().length > 0).length;
    return (filledFields / fields.length) * 100;
  }, [updatedInfo, agreementChecked]);


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
      } else {
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
      if (value.length >= 6) {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          {/* Modern Header */}
          <MKBox
            sx={{
              background: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
              borderRadius: "lg",
              mx: 2,
              mt: -3,
              p: 4,
              mb: 2,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)",
                pointerEvents: "none",
              },
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <HospitalIcon sx={{ fontSize: 48, color: "white", mb: 1 }} />
              <MKTypography variant="h3" fontWeight="bold" color="white" mt={1}>
                Join ND Health
              </MKTypography>
              <MKTypography variant="body1" color="white" opacity={0.9} mt={1} mb={2}>
                Trusted by 50+ Canadian Medical Clinics
              </MKTypography>

              {/* Trust Badges */}
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
                sx={{ mt: 2 }}
              >
                <Chip
                  icon={<SecurityIcon />}
                  label="PIPEDA Compliant"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: "bold",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Chip
                  icon={<SpeedIcon />}
                  label="5 Min Setup"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: "bold",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Free Forever Plan"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: "bold",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Stack>
            </motion.div>
          </MKBox>

          {/* Progress Bar */}
          <MKBox px={3} pt={2}>
            <MKTypography variant="caption" color="text" fontWeight="bold" mb={0.5}>
              Form Completion: {Math.round(formProgress)}%
            </MKTypography>
            <LinearProgress
              variant="determinate"
              value={formProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(0,188,212,0.1)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  background: "linear-gradient(90deg, #00bcd4 0%, #0097a7 100%)",
                },
              }}
            />
          </MKBox>
          {/* Form Fields */}
          <MKBox p={3}>
            <MKTypography variant="h6" fontWeight="bold" color="text" mb={2}>
              Clinic Information
            </MKTypography>

            <Grid container spacing={3}>
              {/* Clinic Name */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <MKInput
                    type="text"
                    label="🏢 Clinic Name"
                    fullWidth
                    value={updatedInfo.clinicname}
                    onChange={(e) => handleInputChange("clinicname", e.target.value)}
                    error={!isClinicNameValid && updatedInfo.clinicname.length > 0}
                  />
                </motion.div>
              </Grid>

              {/* Username */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <MKInput
                    label="👤 Username"
                    type="text"
                    fullWidth
                    value={updatedInfo.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    error={!isUserValid}
                    helperText={userNameNotice}
                    success={isUserValid && updatedInfo.username.length > 4}
                  />
                </motion.div>
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MKInput
                    label="📧 Email Address"
                    variant="outlined"
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    value={updatedInfo.email}
                    fullWidth
                    error={!isEmailValid && updatedInfo.email.length > 0}
                    type="email"
                    helperText={!isEmailValid && updatedInfo.email.length > 0 ? "Invalid email address" : ""}
                  />
                </motion.div>
              </Grid>

              {/* Phone */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <MKInput
                    label="📞 Phone Number"
                    type="text"
                    fullWidth
                    value={updatedInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    helperText={!isPhoneValid && updatedInfo.phone.length > 0 ? "Invalid phone number" : ""}
                    error={!isPhoneValid && updatedInfo.phone.length > 0}
                  />
                </motion.div>
              </Grid>

              {/* Address */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <MKInput
                    label="🏠 Address"
                    value={updatedInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    fullWidth
                    type="text"
                  />
                </motion.div>
              </Grid>

              {/* City */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <MKInput
                    label="🏙️ City"
                    value={updatedInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    fullWidth
                    type="text"
                  />
                </motion.div>
              </Grid>

              {/* Postal Code */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <MKInput
                    label="📮 Postal Code (XXX XXX)"
                    value={updatedInfo.postal}
                    onChange={(e) => handleInputChange("postal", e.target.value)}
                    fullWidth
                    type="text"
                    helperText={!isPostalValid && updatedInfo.postal.length > 0 ? "Invalid postal code" : ""}
                    error={!isPostalValid && updatedInfo.postal.length > 0}
                  />
                </motion.div>
              </Grid>

              {/* OHIP */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <MKInput
                    label="🏥 Primary Doctor's OHIP Billing Number"
                    value={updatedInfo.ohip}
                    onChange={(e) => handleInputChange("ohip", e.target.value)}
                    fullWidth
                    type="text"
                    error={!isOhipValid && updatedInfo.ohip.length > 0}
                    helperText={!isOhipValid && updatedInfo.ohip.length > 0 ? "OHIP number must be at least 6 characters" : ""}
                  />
                </motion.div>
              </Grid>

              {/* Section Divider */}
              <Grid item xs={12}>
                <MKTypography variant="h6" fontWeight="bold" color="text" mt={2} mb={1}>
                  Account Security
                </MKTypography>
              </Grid>
              {/* Password */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <MKInput
                    label="🔒 Password"
                    name="newndpassword"
                    value={updatedInfo.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    fullWidth
                    type="password"
                    helperText={!passwordmatch && updatedInfo.password.length > 0 ? passwordError : ""}
                    error={!passwordmatch && updatedInfo.password.length > 0}
                  />
                </motion.div>
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <MKInput
                    label="🔒 Confirm Password"
                    name="repeat Password"
                    value={updatedInfo.password1}
                    onChange={(e) => handleInputChange("password1", e.target.value)}
                    fullWidth
                    type="password"
                    helperText={!passwordmatch && updatedInfo.password1.length > 0 ? passwordError : ""}
                    error={!passwordmatch && updatedInfo.password1.length > 0}
                  />
                </motion.div>
              </Grid>
              {/* Terms and Conditions */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      backgroundColor: "rgba(0,188,212,0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(0,188,212,0.2)",
                    }}
                  >
                    <input
                      id="checkbox"
                      type="checkbox"
                      checked={agreementChecked}
                      onChange={handleAgreementChange}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        accentColor: "#00bcd4",
                      }}
                    />
                    <label
                      htmlFor="checkbox"
                      style={{
                        fontSize: "14px",
                        marginLeft: "10px",
                        cursor: "pointer",
                        color: "#333",
                      }}
                    >
                      I agree to the{" "}
                      <a
                        style={{
                          color: "#00bcd4",
                          fontWeight: "bold",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={handleAgreementClick}
                      >
                        Terms and Conditions
                      </a>
                      .
                    </label>
                  </Box>
                </motion.div>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <MKButton
                      onClick={handleClose}
                      variant="outlined"
                      color="secondary"
                      size="large"
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Cancel
                    </MKButton>
                    <MKButton
                      onClick={handleSignup}
                      variant="gradient"
                      color="info"
                      size="large"
                      fullWidth
                      disabled={
                        !isEmailValid ||
                        !isPostalValid ||
                        !isUserValid ||
                        !isPhoneValid ||
                        !isClinicNameValid ||
                        !isOhipValid ||
                        !passwordmatch ||
                        !agreementChecked
                      }
                      sx={{
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        boxShadow: "0 8px 20px rgba(0,188,212,0.4)",
                        "&:hover": {
                          boxShadow: "0 12px 28px rgba(0,188,212,0.5)",
                          transform: "translateY(-2px)",
                        },
                        "&:disabled": {
                          opacity: 0.6,
                          cursor: "not-allowed",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Create My Account
                    </MKButton>
                  </Stack>
                </motion.div>
              </Grid>
            </Grid>
          </MKBox>
        </Card>
      </motion.div>
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
          <CircularProgress size="lg" variant="solid" value={70} color="primary" />
        </div>
      )}
    </BasicLayout>
  );
}

export default Cover;
