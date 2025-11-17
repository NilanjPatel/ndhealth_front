import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import { Dialog, DialogContent, DialogTitle, FormControlLabel, Switch, Grid, Radio, RadioGroup } from "@mui/material";

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
  const [isCpsoValid, setIsCpsoValid] = useState(true);
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isClinicNameValid, setIsClinicNameValid] = useState(true);

  // Agreement / dialog state
  const [agreementChecked, setAgreementChecked] = useState(false);
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
    clinic_name: "",
    cpso: "",
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
    isCpsoValid &&
    isFirstNameValid &&
    isLastNameValid &&
    isClinicNameValid &&
    agreementChecked &&
    updatedInfo.first_name.trim().length > 0 &&
    updatedInfo.last_name.trim().length > 0 &&
    updatedInfo.clinic_name.trim().length > 0;

  const handleSignup = async () => {
    // protect double-submits and invalid form
    if (isSubmitting) return;
    if (!isFormValid()) {
      handleFailure("Please fill all required fields correctly and accept the terms.");
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
          clinic_name: updatedInfo.clinic_name,
          email: updatedInfo.email,
          phone: updatedInfo.phone,
          cpso: updatedInfo.cpso,
          preferred_contact: updatedInfo.preferred_contact,
        }),
      });

      const data = await response.json();
      setIsSubmitting(false);
      if (data?.status === "success") {
        handleSuccess(data.message || "Request submitted successfully.");
        // reset form
        setUpdatedInfo({
          phone: "",
          email: "",
          first_name: "",
          last_name: "",
          clinic_name: "",
          cpso: "",
          preferred_contact: "email",
        });
      } else {
        // backend may send message or errors
        handleFailure(data?.message || "Request failed. Please try again.");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Request Error:", error);
      handleFailure("Something went wrong. Please try again later.");
    }
  };

  // Controlled validation handlers
  const handleEmailChange = (value) => {
    const valueLower = (value || "").toLowerCase().trim();
    setIsEmailValid(valueLower.length > 0 && isValidEmail(valueLower));
    setUpdatedInfo((p) => ({ ...p, email: valueLower }));
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhone(value || "");
    setIsPhoneValid(formatted.length > 0 && isValidPhoneNumber(formatted));
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

    if (field === "cpso") {
      const digits = (value || "").replace(/\D/g, "");
      setIsCpsoValid(digits.length === 0 || digits.length >= 6);
      setUpdatedInfo((p) => ({ ...p, cpso: digits }));
      return;
    }

    if (field === "first_name") {
      const trimmed = (value || "").trim();
      setIsFirstNameValid(trimmed.length >= 1);
      setUpdatedInfo((p) => ({ ...p, first_name: trimmed }));
      return;
    }

    if (field === "last_name") {
      const trimmed = (value || "").trim();
      setIsLastNameValid(trimmed.length >= 1);
      setUpdatedInfo((p) => ({ ...p, last_name: trimmed }));
      return;
    }

    if (field === "clinic_name") {
      const trimmed = (value || "").trim();
      setIsClinicNameValid(trimmed.length >= 1);
      setUpdatedInfo((p) => ({ ...p, clinic_name: trimmed }));
      return;
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

  const handleAgreementClick = async (e) => {
    e.preventDefault();
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
            Request a Demo
          </MKTypography>
          <MKTypography variant="body2" color="white" opacity={0.8} mt={1}>
            Register for ND Health and get started with our clinic management solutions.
          </MKTypography>
        </MKBox>

        <MKBox p={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MKInput
                type="text"
                label="First Name *"
                fullWidth
                value={updatedInfo.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                error={!isFirstNameValid}
                helperText={!isFirstNameValid ? "First name is required" : ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MKInput
                type="text"
                label="Last Name *"
                fullWidth
                value={updatedInfo.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                error={!isLastNameValid}
                helperText={!isLastNameValid ? "Last name is required" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <MKInput
                type="text"
                label="Clinic Name *"
                fullWidth
                value={updatedInfo.clinic_name}
                onChange={(e) => handleInputChange("clinic_name", e.target.value)}
                error={!isClinicNameValid}
                helperText={!isClinicNameValid ? "Clinic name is required" : ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MKInput
                id="email"
                label="Email Address *"
                onChange={(e) => handleInputChange("email", e.target.value)}
                value={updatedInfo.email}
                fullWidth
                error={!isEmailValid}
                type="email"
                helperText={!isEmailValid ? "Valid email address is required" : ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MKInput
                label="Phone Number *"
                type="tel"
                fullWidth
                value={updatedInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                helperText={!isPhoneValid ? "Valid phone number is required" : ""}
                error={!isPhoneValid}
              />
            </Grid>

            <Grid item xs={12}>
              <MKTypography variant="body2" fontWeight="medium" mb={1}>
                Preferred Contact Method
              </MKTypography>
              <RadioGroup
                row
                value={updatedInfo.preferred_contact}
                onChange={(e) => handleInputChange("preferred_contact", e.target.value)}
              >
                <FormControlLabel value="email" control={<Radio />} label="Email" />
                <FormControlLabel value="phone" control={<Radio />} label="Phone" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <MKInput
                label="CPSO Number (optional)"
                value={updatedInfo.cpso}
                onChange={(e) => handleInputChange("cpso", e.target.value)}
                inputMode="numeric"
                placeholder="Enter your CPSO number if applicable"
                fullWidth
                type="text"
                error={!isCpsoValid}
                helperText={!isCpsoValid ? "CPSO number must be at least 6 digits if provided" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={agreementChecked}
                    onChange={handleAgreementChange}
                    color="primary"
                  />
                }
                label={
                  <MKTypography variant="body2">
                    I agree to the{" "}
                    <span
                      style={{ color: "info.main", cursor: "pointer", textDecoration: "underline" }}
                      onClick={handleAgreementClick}
                    >
                      terms and conditions
                    </span>
                  </MKTypography>
                }
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <MKButton onClick={handleClose} color="secondary" variant="outlined">
                Cancel
              </MKButton>
              <MKButton
                onClick={handleSignup}
                color="info"
                variant="contained"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </MKButton>
            </Grid>
          </Grid>
        </MKBox>
      </Card>

      <Dialog open={openAgreementPopup} onClose={handleCloseAgreementPopup} maxWidth="md" fullWidth>
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent className="custom-scrollbar">
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
        <MKBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1300,
          }}
        >
          <NdLoader size="lg" variant="solid" value={70} color="primary" />
        </MKBox>
      )}
    </BasicLayout>
  );
}

export default Cover;