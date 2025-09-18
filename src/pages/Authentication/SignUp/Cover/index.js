import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import { Dialog, DialogContent, DialogTitle, FormControlLabel, Switch, Grid } from "@mui/material";

// local components
import NotificationDialog from "../../../../nd_health/components/resources/Notification";
import NdLoader from "nd_health/components/resources/Ndloader";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import BasicLayout from "pages/Authentication/components/BasicLayout";

import bgImage from "assets/images/toronto_cn_tower_side.jpg";
import API_BASE_PATH from "../../../../apiConfig";

// utils (only the ones used)
import {
  formatPhone,
  isValidEmail,
  isValidPhoneNumber,
} from "../../../../nd_health/components/resources/utils";

function Cover() {
  // Validation states
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isOhipValid, setIsOhipValid] = useState(true);
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);

  // Agreement / dialog state
  const [agreementChecked, setAgreementChecked] = useState(true);
  const [openAgreementPopup, setOpenAgreementPopup] = useState(false);
  const [termsInfo, setTermsInfo] = useState(null);

  // Notification dialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Use a single object consistent with field keys used across component
  const [updatedInfo, setUpdatedInfo] = useState({
    phone: "",
    email: "",
    first_name: "",
    last_name: "",
    ohip: "",
    preferred_contact: "email",
  });

  // Close (go to home). Avoid forcing a page reload; react-router navigate is enough.
  const handleClose = () => {
    navigate("/");
  };

  // Helper: validate form before sending
  const isFormValid = () =>
    isEmailValid &&
    isPhoneValid &&
    isOhipValid &&
    isFirstNameValid &&
    agreementChecked &&
    updatedInfo.first_name.trim().length > 0;

  const handleSignup = async () => {
    // protect double-submits and invalid form
    if (isSubmitting) return;
    if (!isFormValid()) {
      handleFailure("Please fill required fields correctly and accept the terms.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_PATH}/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: updatedInfo.first_name,
          last_name: updatedInfo.last_name,
          email: updatedInfo.email,
          phone: updatedInfo.phone,
          ohip: updatedInfo.ohip,
          preferred_contact: updatedInfo.preferred_contact,

        }),
      });

      const data = await response.json();
      setIsSubmitting(false);
      if (data?.status === "success") {
        handleSuccess(data.message || "Signup successful.");
        // reset form
        setUpdatedInfo({
          phone: "",
          email: "",
          first_name: "",
          last_name: "",
          ohip: "",
        });

      } else {
        // backend may send message or errors
        setIsSubmitting(false);
        handleFailure(data?.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Signup error:", error);
      handleFailure("Something went wrong. Please try again later.");
    }
  };

  // Controlled validation handlers
  const handleEmailChange = (value) => {
    const valueLower = (value || "").toLowerCase();
    setIsEmailValid(isValidEmail(valueLower));
    setUpdatedInfo((p) => ({ ...p, email: valueLower }));
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhone(value || "");
    setIsPhoneValid(isValidPhoneNumber(formatted));
    setUpdatedInfo((p) => ({ ...p, phone: formatted }));
  };

  const handleInputChange = (field, value) => {
    if (field === "phone") {
      handlePhoneChange(value);
      return;
    }

    if (field === "email") {
      handleEmailChange(value);
      return;
    }

    if (field === "ohip") {
      const digits = (value || "").replace(/\D/g, "");
      setIsOhipValid(digits.length >= 6); // keep existing rule: require 6+ digits
      setUpdatedInfo((p) => ({ ...p, ohip: digits }));
      return;
    }

    if (field === "first_name") {
      setIsFirstNameValid((value || "").trim().length >= 1); // at least 1 char required
    }

    setUpdatedInfo((p) => ({ ...p, [field]: value }));
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

  const handleAgreementChange = () => setAgreementChecked((v) => !v);

  const handleAgreementClick = () => {
    const fetchClinicInfo = async () => {
      if (!termsInfo) {
        try {
          const response = await fetch(`${API_BASE_PATH}/agreement-terms/Join/`);
          const data = await response.json();
          setTermsInfo(data?.message?.agreement || "<p>No terms available.</p>");
        } catch (error) {
          console.error("Error fetching terms:", error);
          setTermsInfo("<p>Unable to load terms at this time.</p>");
        }
      }
      setOpenAgreementPopup(true);
    };

    fetchClinicInfo();
  };

  const handleCloseAgreementPopup = () => setOpenAgreementPopup(false);

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
        </MKBox>

        <MKBox p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  type="text"
                  label="First Name"
                  fullWidth
                  value={updatedInfo.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  error={!isFirstNameValid}
                  helperText={!isFirstNameValid ? "First name is required" : ""}
                />
              </MKBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  type="text"
                  label="Last Name (optional)"
                  fullWidth
                  value={updatedInfo.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                />
              </MKBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  id="email"
                  label="Email Address"
                  variant="outlined"
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  value={updatedInfo.email}
                  fullWidth
                  error={!isEmailValid}
                  type="email"
                  helperText={!isEmailValid ? "Invalid email address" : ""}
                />
              </MKBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MKBox>
                <MKInput
                  label="Phone"
                  type="tel"
                  fullWidth
                  value={updatedInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  helperText={!isPhoneValid ? "Invalid phone number" : ""}
                  error={!isPhoneValid}
                />
              </MKBox>
            </Grid>
            <Grid item xs={12} md={12}>
              <MKBox>
                <MKTypography variant="body2" fontWeight="medium" mb={1}>
                  Preferred Contact Method
                </MKTypography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={updatedInfo.preferred_contact === "email"}
                      onChange={() =>
                        setUpdatedInfo((p) => ({ ...p, preferred_contact: "email" }))
                      }
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={updatedInfo.preferred_contact === "phone"}
                      onChange={() =>
                        setUpdatedInfo((p) => ({ ...p, preferred_contact: "phone" }))
                      }
                    />
                  }
                  label="Phone"
                />
              </MKBox>
            </Grid>


            <Grid item xs={12} md={12}>
              <MKBox>
                <MKInput
                  label="Primary Doctor's CPSO number"
                  value={updatedInfo.ohip}
                  onChange={(e) => handleInputChange("ohip", e.target.value)}
                  inputMode="numeric"
                  placeholder="Primary Doctor's CPSO number"
                  fullWidth
                  type="text"
                  error={!isOhipValid}
                  helperText={!isOhipValid ? "CPSO number must be at least 6 digits" : ""}
                />
              </MKBox>
            </Grid>

            {/*<Grid item xs={12} md={6}>*/}
            {/*  <MKBox>*/}
            {/*    <FormControlLabel*/}
            {/*      control={*/}
            {/*        <Switch*/}
            {/*          checked={agreementChecked}*/}
            {/*          onChange={handleAgreementChange}*/}
            {/*          name="agreement"*/}
            {/*          color="primary"*/}
            {/*        />*/}
            {/*      }*/}
            {/*      label="I agree to the terms and conditions."*/}
            {/*    />*/}
            {/*  </MKBox>*/}
            {/*</Grid>*/}

            {/*<Grid item xs={12} md={6}>*/}
            {/*  <MKBox>*/}
            {/*    <MKTypography onClick={handleAgreementClick} style={{ cursor: "pointer" }}>*/}
            {/*      View Terms and Conditions*/}
            {/*    </MKTypography>*/}
            {/*  </MKBox>*/}
            {/*</Grid>*/}

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
                  disabled={!isFormValid() || isSubmitting}
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </MKButton>
              </MKBox>
            </Grid>
          </Grid>
        </MKBox>
      </Card>

      <Dialog open={openAgreementPopup} onClose={handleCloseAgreementPopup}>
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent className={"custom-scrollbar"}>
          <div
            dangerouslySetInnerHTML={{
              __html: termsInfo || "<p>Loading terms...</p>",
            }}
          />
        </DialogContent>
      </Dialog>

      <NotificationDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        content={modalContent}
        isError={isError}
      />

      {isSubmitting && (
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
