import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import API_BASE_PATH from "apiConfig";

import Layout from "nd_health/components/Layout";
import {
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  FormLabel,
  FormGroup,
  Checkbox,
  Button, Box, useTheme,
} from "@mui/material";

import { SEX_CHOICES, PROVINCE_CHOICES } from "./resources/variables";
import {
  formatDob,
  formatHin,
  formatPostalCode,
  isValidEmail,
  formatPhone,
} from "nd_health/components/resources/utils";
import MKBox from "../../components/MKBox";
import MKButton from "../../components/MKButton";
import GoHome from "./resources/GoHome";
import CircularProgress from "@mui/joy/CircularProgress";
import { alpha } from "@mui/material/styles";
import NdLoader from "./resources/Ndloader";
import { useClinicInfo } from "./resources/useClinicInfo.js";

const RequestDemographic = () => {
  const { clinicSlug } = useParams();
  const location = useLocation();
  // const [openApp, setOpenApp] = useState(false);
  const clinicInfo1 = location.state && location.state.clinicInfo;
  // const [clinicInfo, setClinicInfo] = useState(clinicInfo1);
  const [termsInfo, settermsInfo] = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [openAgreementPopup, setOpenAgreementPopup] = useState(false);
  const [hin, setHin] = useState("");
  const [dob, setDob] = useState("");
  const dobRef = useRef(null);
  const vrRef = useRef(null);
  const phoneRef = useRef(null);
  const altPhoneRef = useRef(null);
  const emailRef = useRef(null);
  const cityRef = useRef(null);
  const [versionCode, setVersionCode] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [postal, setPostal] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [email, setEmail] = useState("");
  const [selectedSex, setSelectedSex] = useState("M");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  // const [clinic_id, setClinic_id] = useState("");
  const [notice, setnotice] = useState("");
  const [patinetcheck, setpatinetcheck] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [privarePatient] = useState(true);
  const [checkPrivatePatient, setCheckPrivatePatient] = useState(false);
  const [validhin, setValidhin] = useState(true);
  const [validversionCode, setValidversionCode] = useState(true);
  const [validDOB, setValidDOB] = useState(true);
  const [validPhone, setValidPhone] = useState(true);
  const [validpostal, setValidpostal] = useState(true);
  // const [dobError, setDobError] = useState(null);

  const [displayfirststep, setdisplayfieststep] = useState("block");
  const [displayNextStep, setdisplayNextStep] = useState("none");
  const [medicationStatus, setMedicationStatus] = useState("no"); // State to hold the selected option
  // const [medication, setMedication] = useState(""); // State to hold the selected option
  const [medicationDisplay, setMedicationDisplay] = useState("none");
  const [isOnNarcotic, setIsOnNarcotic] = useState("");
  const [askNarcotic, setAskNarcotic] = useState("none");
  const [askSurgery, setAskSurgery] = useState("none");
  const [regularMedicationStatus, setRegularMedicationStatus] = useState("no");
  const [regularMedicationStatusDisplay, setRegularMedicationStatusDisplay] = useState("none");
  const [regularMedicationNames, setRegularMedicationNames] = useState("");
  const theme = useTheme();

  const [surgeryStatus, setSurgeryStatus] = useState("no");
  const [askDoctorStatus, setAskDoctorStatus] = useState("no");
  const [askDoctor, setAskDoctor] = useState("none");
  const [medication_food_allergic, setMedication_food_allergic] = useState("");
  const [narcoticsnames, setNarcoticsnames] = useState("");
  const [surgeryName, setSurgeryName] = useState("");
  const [dr_firstname, setDr_firstname] = useState("");
  const [dr_lastname, setDr_lasttname] = useState("");
  const [howknow, setHowknow] = useState("");
  const [fetchedPatientDetails, setFetchedPatientDetails] = useState(null);
  // const [fulldata, setFulldata] = useState('');
  const [medicalConditions, setMedicalConditions] = useState({
    diabetic: false,
    hypertension: false,
    asthma: false,
    highCholesterol: false,
    thyroid: false,
    other: false,
    otherText: "",
  });
  // const [hinVersioncodeerror, setHinVersioncodeerror] = useState(false);
  const { clinicInfo, locationsData, notice1, loading1 } = useClinicInfo(clinicSlug);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {

        try {
          const response1 = await fetch(
            `${API_BASE_PATH}/clinic/notice/${clinicInfo.id}/new_patient_registration/`,
          );
          const data1 = await response1.json();
          setnotice(data1.notice);
        } catch (error) {
          console.error("Error fetching clinic information:", error);
        }
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    };

    if (!clinicInfo1) {
      fetchClinicInfo().then(r => {});
    }
  }, [clinicInfo1,clinicInfo]);

  // get patient details
  useEffect(() => {
    // hcv call
    const fetchPatientDetails = async () => {
      setFetchedPatientDetails(false);
      try {
        const response = await fetch(`${API_BASE_PATH}/patient/registration/check/${clinicSlug}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hin: hin,
            ver: versionCode,

          }),
        });

        const data = await response.json();
        console.log(data);
        console.log(`$type : ${typeof data}`);
        if (data?.data?.secondName?.trim()) {
          setFirstName(`${data.data.firstName} ${data.data.secondName}`);
        } else {
          setFirstName(data?.data?.firstName || "");
        }

        setLastName(data.data.lastName);
        const date = new Date(data.data.dateOfBirth);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        const formattedDate = `${yyyy}-${mm}-${dd}`;
        setDob(formattedDate); //
        setSelectedSex(data.data.gender);

      } catch (error) {
        console.error("Error fetching clinic information:", error);
      } finally {
        setFetchedPatientDetails(true);
      }
    };
    if (versionCode.length === 2 && hin.length === 12 && fetchedPatientDetails === null) {
      fetchPatientDetails();
    }
  }, [versionCode, hin, fetchedPatientDetails]);
  // check if patietn is already registered
  const checkPatient = async () => {
    const response = await fetch(`${API_BASE_PATH}/demographic/check/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clinic_id: clinicInfo.id, // Add clinic_id to the form data
        clinic_slug: clinicSlug, // Add clinic_id to the form data
        hin: hin,
        ver: versionCode,
        dob: dob,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const data = await response.json();
    if (data.status === "failed") {
      // Redirect to the confirmation page
      // navigate(`/confirmation/${clinicSlug}`);
      setpatinetcheck(true);
      setErrorMessage(data.message);
    } else {
      // Show an Error message
      // setErrorMessage(data.message);
    }
  };

  const requestDemographic = async () => {
    const fullName = `${dr_firstname} ${dr_lastname}`;
    const formattedMedicalConditions = Object.entries(medicalConditions)
      .filter(([isChecked]) => isChecked)
      .map(([condition]) => condition)
      .join(", ");
    let fulldata = "";

    if (medicationStatus === "yes") {
      fulldata += `Are you allergic to any food or Medication?: ${medication_food_allergic}  | `;
    }
    if (medicationStatus === "no") {
      fulldata += `Are you allergic to any food or Medication?: NO  | `;
    }
    if (regularMedicationStatus === "yes") {
      fulldata += `\nDo you regularly take any medication?: ${regularMedicationNames}  | `;
    }
    if (regularMedicationStatus === "no") {
      fulldata += `\nDo you regularly take any medication?: NO  | `;
    }
    if (isOnNarcotic === "yes") {
      fulldata += `\nNarcotics, sleeping pills, or stimulants that you are currently using: ${narcoticsnames}  | `;
    }
    if (isOnNarcotic === "no") {
      fulldata += `\nNarcotics, sleeping pills, or stimulants that you are currently using: NO  | `;
    }
    if (formattedMedicalConditions !== "") {
      fulldata += `\nDo you have any medical condition?: ${formattedMedicalConditions}  | `;
    }
    if (formattedMedicalConditions === "") {
      fulldata += `\nDo you have any medical condition?: NO  | `;
    }
    if (surgeryStatus === "yes") {
      fulldata += `\nname and date of surgery?: ${surgeryName}  | `;
    }
    if (surgeryStatus === "no") {
      fulldata += `\nHave you had any surgery?: NO  | `;
    }
    if (fullName !== "") {
      fulldata += `\nFamily Doctor's Name:${fullName}  | `;
    }
    if (howknow !== "") {
      fulldata += `\nHow did you got to know about us: ${howknow}`;
    }
    try{
      setFetchedPatientDetails(false);
      const response = await fetch(`${API_BASE_PATH}/demographic/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clinic_slug: clinicSlug, // Add clinic_id to the form data
          province: province,
          postal: postal,
          city: city,
          address: address,
          phone: phone,
          alternativePhone: altPhone,
          email: email,
          hin: hin,
          ver: versionCode,
          dob: dob,
          sex: selectedSex,
          firstName: firstName,
          lastName: lastName,
          agreed: agreementChecked ? 1 : 0, // Include the agreed value based on agreementChecked
          fulldata: fulldata,
        }),
      });
      if (response.ok) {
        // Successful creation (HTTP status code 201)
        // const data = await response.json();
        setpatinetcheck(true);
        setErrorMessage(
          "Your Profile is requested for registration with clinic. Kindly follow up with Staff.",
        );
      }
    }catch(error) {}
    finally {
      setFetchedPatientDetails(true);
    }
  };

  const handleAgreementClick = async () => {
    if (!termsInfo) {
      try {
        const response = await fetch(`${API_BASE_PATH}/terms/${clinicSlug}/Appointment Booking/`);

        const data = await response.json();
        settermsInfo(data.message.text);
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    }

    setOpenAgreementPopup(true);
  };

  const handleCloseAgreementPopup = () => {
    setOpenAgreementPopup(false);
  };

  const handleAgreementChange = () => {
    setAgreementChecked(!agreementChecked);
    // if (agreementChecked === false) {
    // } else if (agreementChecked === true) {
    // }
  };

  const handleHinChange = (e) => {
    const formattedHin = formatHin(e.target.value);
    setHin(formattedHin);

    // Check if the formatted HIN is 12 characters and move focus to the DOB field
    if (formatHin(hin).length === 11 && dobRef.current) {
      dobRef.current.focus();
      setValidhin(true);


    } else {
      setValidhin(false);
    }
  };

  const handleDobChange = (e) => {
    const formattedDob = formatDob(e.target.value);
    setDob(formattedDob);

    // Check if the formatted DOB is complete (YYYY-MM-DD)
    if (formattedDob.length === 10) {
      const enteredDate = new Date(formattedDob);
      const currentDate = new Date();
      const minDate = new Date("1900-01-01");

      if (enteredDate >= minDate && enteredDate <= currentDate) {
        setValidDOB(true);
        // Move focus to the Version Code field
        if (vrRef.current) {
          vrRef.current.focus();
        }
      } else {
        setValidDOB(false);
      }
    } else {
      setValidDOB(false);
    }
  };


  const handleVersionCodeChange = (e) => {
    // Assuming the version code should be exactly 2 capital letters
    const formattedVersionCode = e.target.value.toUpperCase().slice(0, 2);
    // Update state with formatted version code
    setVersionCode(formattedVersionCode);

    // Check if the version code is complete (2 capital letters) and move focus to Phone Number field
    if (formattedVersionCode.length === 2 && phoneRef.current) {
      // check if patient is already registered or not //TODO
      // check if patient's health card is valid or not
      phoneRef.current.focus();
      setValidversionCode(true);
    } else {
      setValidversionCode(false);
    }
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setPhone(e.target.value);

    // Check if the phone number is complete (10 digits) and move focus to Alternative Phone field
    if (formattedPhone.length === 10 && altPhoneRef.current) {
      if (checkPrivatePatient === false) {
        checkPatient();
      }
      altPhoneRef.current.focus();
      setValidPhone(true);
    } else {
      setValidPhone(false);
    }
  };

  const handleAltPhoneChange = (e) => {
    const formattedAltPhone = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setAltPhone(e.target.value);
    if (formattedAltPhone.length === 10 && emailRef.current) {
      emailRef.current.focus();
    }
  };

  const handlepostalChange = (e) => {
    const formattedpostal = formatPostalCode(e.target.value);
    setPostal(formattedpostal);
    if (formattedpostal.length === 7 && cityRef.current) {
      cityRef.current.focus();
      setValidpostal(true);
    } else {
      setValidpostal(false);
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value.toLowerCase());
    // Validate email format
    const isValid = isValidEmail(value.toLowerCase());
    setIsEmailValid(isValid);
  };

  const handleClosePatientCheckin = () => {
    window.location.href = `/clinic/${clinicSlug}/`;
  };

  const handledisplayNextStep = () => {
    setdisplayfieststep("none");
    setdisplayNextStep("block");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handledisplayfirstStep = () => {
    setdisplayfieststep("block");
    setdisplayNextStep("none");
  };
  const handleNarcoticChange = (event) => {
    setIsOnNarcotic(event.target.value); // Update the state with the selected value
    if (event.target.value === "yes") {
      setAskNarcotic("block");
    } else if (event.target.value === "no") {
      setAskNarcotic("none");
    }
  };
  const handleMedicationChange = (event) => {
    setRegularMedicationStatus(event.target.value); // Update the state with the selected value
    if (event.target.value === "no") {
      setRegularMedicationStatusDisplay("none");
    } else if (event.target.value === "yes") {
      setRegularMedicationStatusDisplay("block");
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setMedicalConditions({
      ...medicalConditions,
      [name]: checked,
    });
  };

  const handleOtherInputChange = (event) => {
    setMedicalConditions({
      ...medicalConditions,
      otherText: event.target.value,
    });
  };

  const handlesurgeryChange = (event) => {
    setSurgeryStatus(event.target.value);
    if (event.target.value === "yes") {
      setAskSurgery("block");
    } else if (event.target.value === "no") {
      setAskSurgery("none");
    }
  };

  const handleDoctorChange = (event) => {
    setAskDoctorStatus(event.target.value);
    if (event.target.value === "no") {
      setAskDoctor("none");
    } else if (event.target.value === "yes") {
      setAskDoctor("block");
    }
  };

  const handleAllergicChange = (event) => {
    setMedicationStatus(event.target.value);
    if (event.target.value === "no") {
      setMedicationDisplay("none");
    } else if (event.target.value === "yes") {
      setMedicationDisplay("block");
    }
  };

  // const handleSubmit = () => {
  //   // Create an object to hold all the form data
  //   const fullName = `${dr_firstname} ${dr_lastname}`;
  //   const formattedMedicalConditions = Object.entries(medicalConditions)
  //     .filter(([condition, isChecked]) => isChecked)
  //     .map(([condition]) => condition)
  //     .join(", ");
  //   let fulldata = "";
  //
  //   if (medicationStatus === "yes") {
  //     fulldata += `Are you allergic to any food or Medication?: ${medication_food_allergic}`;
  //   }
  //   if (medicationStatus === "no") {
  //     fulldata += `Are you allergic to any food or Medication?: NO`;
  //   }
  //   if (regularMedicationStatus === "yes") {
  //     fulldata += `\nDo you regularly take any medication?: ${regularMedicationNames}`;
  //   }
  //   if (regularMedicationStatus === "no") {
  //     fulldata += `\nDo you regularly take any medication?: NO`;
  //   }
  //   if (isOnNarcotic === "yes") {
  //     fulldata += `\nNarcotics, sleeping pills, or stimulants that you are currently using: ${narcoticsnames}`;
  //   }
  //   if (isOnNarcotic === "no") {
  //     fulldata += `\nNarcotics, sleeping pills, or stimulants that you are currently using: NO`;
  //   }
  //   if (formattedMedicalConditions !== "") {
  //     fulldata += `\nDo you have any medical condition?: ${formattedMedicalConditions}`;
  //   }
  //   if (formattedMedicalConditions === "") {
  //     fulldata += `\nDo you have any medical condition?: NO`;
  //   }
  //   if (surgeryStatus === "yes") {
  //     fulldata += `\nname and date of surgery?: ${surgeryName}`;
  //   }
  //   if (surgeryStatus === "no") {
  //     fulldata += `\nHave you had any surgery?: NO`;
  //   }
  //   if (fullName !== "") {
  //     fulldata += `\nFamily Doctor's Name:${fullName}`;
  //   }
  //   if (howknow !== "") {
  //     fulldata += `\now did you got to know about us: ${howknow}`;
  //   }
  // };

  useEffect(() => {
  if(!checkPrivatePatient){
    if (formatHin(hin).length === 12) {
      setValidhin(true);
    } else {
      setValidhin(false);
    }

    // Check if the version code is complete (2 capital letters) and move focus to Phone Number field
    if (versionCode.length === 2) {
      setValidversionCode(true);
    } else {
      setValidversionCode(false);
    }
  }
  },[privarePatient,hin,versionCode]);

  return (
    <Layout clinicInfo={clinicInfo}>
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom
              style={{ fontSize: "1.5rem" }}
            >
              Patient Registration Form
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              paragraph
              style={{ fontSize: "1rem" }}
            >
              Please fill up the form and submit to register with the clinic.
            </Typography>
          </Grid>

          {notice && (
            <Grid item xs={12} sm={12} md={12}>
              <Typography
                variant="body1"
                align="center"
                color="red"
                paragraph
                style={{ fontSize: "1rem" }}
              >
                Clinic Notice: {notice}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            {/* <Paper sx={{ p: 2, margin: 'auto', maxWidth: 500, flexGrow: 1 }}> */}
            <Grid container spacing={2} justifyContent="center" display={displayfirststep}>
              {/*<Grid item xs={12} sm={12} md={12}>*/}
              {/*  <MKButton*/}
              {/*    onClick={() => redirectHomeM(clinicSlug)}*/}
              {/*    color="primary"*/}
              {/*    variant={"contained"}*/}
              {/*  >*/}
              {/*    Back*/}
              {/*  </MKButton>*/}
              {/*</Grid>*/}
              <GoHome clinicSlug={clinicSlug} />

              {/* put a check box and hide if both health card and version code is not blank */}
              {privarePatient && (
                <Grid item xs={12} sm={12} md={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checkPrivatePatient}
                        onChange={(e) => setCheckPrivatePatient(e.target.checked)}
                        name="agreement"
                        color="primary"
                      />
                    }
                    label="Check this if you don't have ontario health card"
                  />
                </Grid>
              )}

              {!checkPrivatePatient && (
                <>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Health Card Number"
                      value={hin}
                      onChange={handleHinChange}
                      inputMode="numeric"
                      placeholder="1234-567-8901"
                      fullWidth
                      type="tel"
                      required
                      inputRef={vrRef}
                      error={!validhin}
                      helperText={!validhin ? "Invalid health card" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      id="outlined-basic"
                      label="Version Code (leave blank if private patient)"
                      variant="outlined"
                      fullWidth
                      required
                      onChange={handleVersionCodeChange}
                      value={versionCode}
                      inputRef={dobRef}
                      error={!validversionCode}
                      helperText={!validversionCode ? "Invalid version code" : ""}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <MKBox width="100%" component="section">
                  <InputLabel id="sex-label">Sex</InputLabel>
                  <Select
                    style={{ minWidth: "15rem", minHeight: "2rem" }}
                    labelId="sex-label"
                    id="sex"
                    label="Sex"
                    fullWidth
                    value={selectedSex}
                    onChange={(e) => setSelectedSex(e.target.value)}
                  >
                    {SEX_CHOICES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </MKBox>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  label="Date of Birth - YYYY-MM-DD"
                  value={formatDob(dob)}
                  onChange={handleDobChange}
                  inputMode="numeric"
                  placeholder="YYYY-MM-DD"
                  fullWidth
                  type="tel"
                  error={!validDOB}
                  helperText={!validDOB ? "Invalid date of birth" : ""}

                  // Assigning the ref to the Date of Birth field
                />
              </Grid>

              {/* hide healthcard and version code if checkprivatepatient is checked */}


              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="outlined-basic"
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={handlePhoneChange}
                  value={formatPhone(phone)}
                  inputRef={phoneRef}
                  error={!validPhone}
                  helperText={!validPhone ? "Invalid phone number" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="outlined-basic"
                  label="Alternative Phone Number"
                  variant="outlined"
                  fullWidth
                  onChange={handleAltPhoneChange}
                  value={formatPhone(altPhone)}
                  inputRef={altPhoneRef}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="outlined-basic"
                  label="Email Address"
                  variant="outlined"
                  onChange={(e) => handleEmailChange(e.target.value)}
                  value={email}
                  fullWidth
                  required
                  inputRef={emailRef}
                  error={!isEmailValid}
                  helperText={!isEmailValid ? "Invalid email address" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="outlined-multiline-static"
                  label="Address"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="outlined-basic"
                  label="Postal Code"
                  variant="outlined"
                  value={formatPostalCode(postal)}
                  onChange={handlepostalChange}
                  fullWidth
                  required
                  error={!validpostal}
                  helperText={!validpostal ? "Invalid postal code" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="outlined-basic"
                  label="City"
                  variant="outlined"
                  fullWidth
                  required
                  inputRef={cityRef}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <MKBox width="100%" component="section">
                  <InputLabel id="province-label">Province</InputLabel>
                  <Select
                    labelId="province-label"
                    id="province"
                    label="Province"
                    fullWidth
                    value={province}
                    style={{ minWidth: "15rem", minHeight: "2rem" }}
                    onChange={(e) => setProvince(e.target.value)}
                  >
                    {PROVINCE_CHOICES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </MKBox>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <MKButton
                  variant="contained"
                  color="info"
                  fullWidth
                  onClick={handledisplayNextStep}
                  disabled={
                    !isEmailValid ||
                    !firstName ||
                    !lastName ||
                    !selectedSex ||
                    !validDOB ||
                    !validPhone ||
                    !isEmailValid ||
                    !address ||
                    !validpostal ||
                    !city ||
                    !province ||
                    (!checkPrivatePatient && (!validhin || !validversionCode))
                  }
                >
                  Next
                </MKButton>
              </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="center" display={displayNextStep}>
              <Grid item xs={12} sm={12} md={12}>
                <MKButton varient="contained" color="primary" onClick={handledisplayfirstStep}>
                  Back
                </MKButton>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue" }}>
                    Are you allergic to any food or Medication?
                  </FormLabel>
                  <RadioGroup
                    aria-label="medication"
                    name="medication"
                    value={medicationStatus}
                    onChange={handleAllergicChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12} display={medicationDisplay}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue", paddingBottom: "1rem" }}>
                    Please specify any medications or foods to which you are allergic.
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    label="Details of Medication / Food you are allergic to."
                    variant="outlined"
                    fullWidth
                    style={{ padding: "3px" }}
                    value={medication_food_allergic}
                    onChange={(e) => setMedication_food_allergic(e.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue" }}>
                    Do you regularly take any medication?
                  </FormLabel>
                  <RadioGroup
                    aria-label="medication"
                    name="medication"
                    value={regularMedicationStatus}
                    onChange={handleMedicationChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12} display={regularMedicationStatusDisplay}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue", paddingBottom: "2rem" }}>
                    Please specify medication that you are taking regularly.
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    label="Details of Regular Medication"
                    variant="outlined"
                    fullWidth
                    style={{ padding: "3px" }}
                    value={regularMedicationNames}
                    onChange={(e) => setRegularMedicationNames(e.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "red", fontWeight: "bold" }}>
                    Please be aware that we do not prescribe narcotics, sleeping pills, or
                    stimulants for walk-in patients.
                  </FormLabel>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "red", fontWeight: "bold" }}>
                    ARE YOU ON ANY NARCOTIC?
                  </FormLabel>
                  <RadioGroup
                    aria-label="narcotic"
                    name="narcotic"
                    value={isOnNarcotic}
                    onChange={handleNarcoticChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12} display={askNarcotic}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue", paddingBottom: "2rem" }}>
                    Please mention the names of any narcotics, sleeping pills, or stimulants that
                    you are currently using.
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    label="seperate names by comma ( , )"
                    variant="outlined"
                    rows={4}
                    multiline
                    fullWidth
                    style={{ padding: "3px" }}
                    value={narcoticsnames}
                    onChange={(e) => setNarcoticsnames(e.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue" }}>
                    Do you have any medical condition?
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={medicalConditions.diabetic}
                          onChange={handleCheckboxChange}
                          name="diabetic"
                        />
                      }
                      label="Diabetic"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={medicalConditions.hypertension}
                          onChange={handleCheckboxChange}
                          name="hypertension"
                        />
                      }
                      label="Hypertension"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={medicalConditions.asthma}
                          onChange={handleCheckboxChange}
                          name="asthma"
                        />
                      }
                      label="Asthma"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={medicalConditions.highCholesterol}
                          onChange={handleCheckboxChange}
                          name="highCholesterol"
                        />
                      }
                      label="High Cholesterol"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={medicalConditions.thyroid}
                          onChange={handleCheckboxChange}
                          name="thyroid"
                        />
                      }
                      label="Thyroid"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={medicalConditions.other}
                          onChange={handleCheckboxChange}
                          name="other"
                        />
                      }
                      label="Other"
                    />
                    {medicalConditions.other && (
                      <TextField
                        id="otherText"
                        label="Please specify other medical condition"
                        value={medicalConditions.otherText}
                        onChange={handleOtherInputChange}
                      />
                    )}
                  </FormGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue" }}>Have you had any surgery?</FormLabel>
                  <RadioGroup
                    aria-label="surgery"
                    name="surgery"
                    value={surgeryStatus}
                    onChange={handlesurgeryChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12} display={askSurgery}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue", paddingBottom: "2rem" }}>
                    Please mention name and date(yyyy/mm/dd) of surgery.
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    label="Details of surgery"
                    variant="outlined"
                    fullWidth
                    style={{ padding: "3px" }}
                    value={surgeryName}
                    onChange={(e) => setSurgeryName(e.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue" }}>Do you have a Family Doctor?</FormLabel>
                  <RadioGroup
                    aria-label="medication"
                    name="medication"
                    value={askDoctorStatus}
                    onChange={handleDoctorChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12} display={askDoctor}>
                {/* <FormControl component="fieldset"> */}
                <FormLabel style={{ color: "blue", paddingBottom: "2rem" }}>
                  Name of Family Doctor :
                </FormLabel>
                <TextField
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  style={{ padding: "3px", paddingBottom: "2rem" }}
                  value={dr_firstname}
                  onChange={(e) => setDr_firstname(e.target.value)}
                />
                <TextField
                  id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  style={{ padding: "3px", width: "100%" }}
                  value={dr_lastname}
                  onChange={(e) => setDr_lasttname(e.target.value)}
                />
                {/* </FormControl> */}
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "blue" }}>How did you got to know about us?</FormLabel>
                  <RadioGroup
                    aria-label="narcotic"
                    name="narcotic"
                    value={howknow}
                    onChange={(e) => setHowknow(e.target.value)}
                  >
                    <FormControlLabel
                      value="Friends & Family"
                      control={<Radio />}
                      label="Friends & Family"
                    />
                    <FormControlLabel value="Google" control={<Radio />} label="Google" />
                    <FormControlLabel value="Facebook" control={<Radio />} label="Facebook" />
                    <FormControlLabel value="Instagram" control={<Radio />} label="Instagram" />
                    <FormControlLabel value="Advertisement board" control={<Radio />} label="Advertisement board" />
                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
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
                <Typography onClick={handleAgreementClick} style={{ cursor: "pointer" }}>
                  View Terms and Conditions
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Button
                  variant="contained"
                  color="info"
                  fullWidth
                  onClick={requestDemographic}
                  disabled={
                    !agreementChecked ||
                    !isEmailValid ||
                    !firstName ||
                    !lastName ||
                    !selectedSex ||
                    !validDOB ||
                    !validPhone ||
                    !isEmailValid ||
                    !address ||
                    !validpostal ||
                    !city ||
                    !province ||
                    (!checkPrivatePatient && (!validhin || !validversionCode))
                  }
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            {/* </Paper> */}
          </Grid>
        </Grid>
      </Container>
      <Dialog open={openAgreementPopup} onClose={handleCloseAgreementPopup}>
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: termsInfo }} />
        </DialogContent>
      </Dialog>
      <Dialog open={patinetcheck} onClose={handleClosePatientCheckin}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: errorMessage }} />
        </DialogContent>
      </Dialog>
      <>
        {fetchedPatientDetails === false && (
          <Box sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1301,
            backdropFilter: "blur(3px)",
          }}>
            <NdLoader size="lg" variant="solid" value={70} color="primary" />
          </Box>
        )}
      </>
    </Layout>
  );
};

export default RequestDemographic;
