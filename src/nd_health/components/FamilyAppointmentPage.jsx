import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import API_BASE_PATH from "../../apiConfig";
import Layout from "nd_health/components/Layout";
import {
  Typography,
  Button,
  Paper,
  Grid,
  FormControl,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Chip,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Icons
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhoneIcon from "@mui/icons-material/Phone";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NoteIcon from "@mui/icons-material/Note";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";

import { formatPhone, isValidEmail } from "nd_health/components/resources/utils";
import NdLoader from "nd_health/components/resources/Ndloader";
import MKTypography from "components/MKTypography";
import MKBox from "../../components/MKBox";
import NotificationDialog from "./resources/Notification";
import { StepConnector } from "@mui/material";
import { styled } from "@mui/system";
import ProfessionalStepper from "./resources/ProfessionalStepper";
import AppointmentConfirmationCard from "./resources/AppointmentConfirmationCard";

const TOTAL_STEPS = 7;
const STEP_LABELS = [
  "Doctor",
  "Location",
  "Mode",
  "Date",
  "Time",
  "Details",
  "Confirm",
];

const STEP_ICONS = [
  <PersonIcon />,
  <LocationOnIcon />,
  <LocalHospitalIcon />,
  <EventIcon />,
  <AccessTimeIcon />,
  <NoteIcon />,
  <CheckCircleIcon />,
];

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${StepConnector.line}`]: {
    borderColor: theme.palette.divider,
    borderTopWidth: 2,
  },
}));

const FamilyAppointmentPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { clinicSlug } = useParams();

  // State variables
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [dateObject, setDateObject] = useState(null);
  const [appointmentMode, setSelectedAppointmentMode] = useState("");
  const [appointmentModes, setAppointmentModes] = useState([]);
  const [isAppointmentAvailable, setIsAppointmentAvailable] = useState(false);
  const [reason, setReason] = useState("");
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [openAgreementPopup, setOpenAgreementPopup] = useState(false);
  const [termsInfo, settermsInfo] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [progress, setProgress] = useState(0);
  const [drNotice, setDrNotice] = useState(null);

  const [appointmentlist, setAppointmentlist] = useState([]);
  const [app_list_dilog, setApp_list_dilog] = useState(false);
  const [same_date_app, setSame_date_app] = useState(true);

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [submitbutton, setSubmitbutton] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [buttonRedirect, setButtonRedirect] = useState("");
  const [redirect, setRedirect] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [hasShownAppointmentDialog, setHasShownAppointmentDialog] = useState(false);
  const location = useLocation();
  const responseData = location.state && location.state.responseData;
  const clinicInfo = location.state && location.state.clinicInfo;
  const clinicLocation = location.state && location.state.locationsData;

  const primaryColor = clinicInfo?.colors?.primary || theme.palette.primary.main;
  const secondaryColor = clinicInfo?.colors?.secondary || theme.palette.secondary.main;

  const updateProgressAndColor = useCallback((step) => {
    const newProgress = (step / TOTAL_STEPS) * 100;
    setProgress(newProgress);
  }, [TOTAL_STEPS]);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return dayjs(timeString, "HH:mm").format("h:mm A");
  };

  useEffect(() => {
    if (responseData) {
      const locKeys = Object.keys(responseData.location);
      setLocations(locKeys);

      if (locKeys.length === 1 && !selectedLocation) {
        setSelectedLocation(locKeys[0]);
      }

      if (responseData.doctor_notice) {
        const notices = [];
        for (let i = 0; i < responseData.doctor_notice.length; i++) {
          notices.push(responseData.doctor_notice[i]);
        }
        setDrNotice(notices.join(" | "));
      }

      if (responseData.letest_appointments && responseData.letest_appointments.length > 0 && !hasShownAppointmentDialog) {
        setApp_list_dilog(true);
        setHasShownAppointmentDialog(true); // appointment shown
        const appointmentListContent = responseData.letest_appointments.map((appointment) => (
          <Box key={appointment.id} mb={1.5}>
            <Typography variant="subtitle1" gutterBottom>Date: {appointment.appointmentDate}</Typography>
            <Typography variant="body2">Start Time: {formatTime(appointment.startTime)}</Typography>
          </Box>
        ));
        setAppointmentlist(appointmentListContent);
      }
      updateProgressAndColor(currentStep);

      if (responseData.rsem) {
        setRedirect(false);
        handleSuccess(`You have an unread message from ${clinicInfo.name}.\nPlease check your email for details after booking your appointment.`);
      }
    } else {
      redirectHome();
    }
  }, [responseData, clinicInfo]);
  useEffect(() => {
    updateProgressAndColor(currentStep);
  }, [currentStep, updateProgressAndColor]);


  const redirectHome = () => {
    setOpenModal(false);
    if (redirect) {
      window.location.href = `/clinic/${clinicSlug}/`;
    }
  };

  const fetchAppointmentStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_PATH}/appointment-status/${responseData.xps}/`);
      const data = await response.json();
      if (data.status === "failed") {
        handleFailure(
          "You already book an appointment! this session is expired. If you have provided valid email, You will receive a confirmation email shortly. if you still want to book an appointment please close the window and try again.",
        );
        setButtonRedirect("Home");
      }
    } catch (error) {
      console.error("Error fetching appointment status:", error);
    }
  };

  const handleLocationChange = (event) => {
    const locationName = event.target.value;
    setSelectedLocation(locationName);
    setSelectedProvider("");
    setSelectedDate("");
    setSelectedTime("");
    setIsAppointmentAvailable(false);
    fetchAppointmentStatus();
    setSelectedAppointmentMode("");
    setAvailableDates([]);
    setAvailableTimes([]);
    setDateObject(null);
    setAgreementChecked(false);
    setSame_date_app(true);
  };

  const handleProviderChange = (event) => {
    const providerNumber = event.target.value;
    setSelectedProvider(providerNumber);

    if (providerNumber && responseData.location[selectedLocation]?.provider_number[providerNumber]) {
      const providerData = responseData.location[selectedLocation].provider_number[providerNumber];
      setAppointmentModes(Object.keys(providerData.AppointmentMode));
      setIsAppointmentAvailable(Object.keys(providerData.letestappointmentslots || {}).length > 0);
    } else {
      setAppointmentModes([]);
      setIsAppointmentAvailable(false);
    }

    setSelectedTime("");
    setSelectedDate("");
    setAgreementChecked(false);
    setSelectedAppointmentMode("");
    setAvailableDates([]);
    setAvailableTimes([]);
    setDateObject(null);
    setSame_date_app(true);
  };

  const handleAppointmentModeChange = (event) => {
    const selectedMode = event.target.value;
    setSelectedAppointmentMode(selectedMode);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableTimes([]);
    setDateObject(null);
    setAgreementChecked(false);
    setSame_date_app(true);

    if (selectedMode === "Phone") {
      setPhoneNumber(responseData.patient_phone || "");
      setSelectedOption("phone");
    } else if (selectedMode === "Video") {
      setSelectedOption("email");
    } else if (selectedMode === "Clinic") {
      setSelectedOption("clinic");
    }

    if (selectedLocation && selectedProvider && selectedMode) {
      const appointmentTypes = responseData.appointment_bookCode[selectedMode];
      const dates = Object.keys(
        responseData.location[selectedLocation]?.provider_number[selectedProvider]?.letestappointmentslots || {},
      ).filter((date) =>
        responseData.location[selectedLocation]?.provider_number[selectedProvider]?.letestappointmentslots[date].some(
          (slot) => appointmentTypes.includes(slot.type),
        ),
      );
      setAvailableDates(dates);
    } else {
      setAvailableDates([]);
    }
  };

  const handleDatePickerChange = (newDate) => {
    setDateObject(newDate);

    if (newDate && newDate.isValid()) {
      const formattedDate = newDate.format("YYYY-MM-DD");

      if (availableDates.includes(formattedDate)) {
        setSelectedDate(formattedDate);
        setSelectedTime("");
        setAgreementChecked(false);

        let conflict = false;
        if (responseData.letest_appointments) {
          for (let i = 0; i < responseData.letest_appointments.length; i++) {
            if (responseData.letest_appointments[i].appointmentDate === formattedDate) {
              conflict = true;
              // Show dialog when user selects a date that conflicts with existing appointment
              if (!app_list_dilog) {
                setApp_list_dilog(true);
              }
              break;
            }
          }
        }
        setSame_date_app(!conflict);

        if (selectedLocation && selectedProvider && appointmentMode) {
          const appointmentTypes = responseData.appointment_bookCode[appointmentMode];
          const times = responseData.location[selectedLocation]?.provider_number[selectedProvider]?.letestappointmentslots[formattedDate]
            .filter(slot => appointmentTypes.includes(slot.type)) || [];
          setAvailableTimes(times);
        } else {
          setAvailableTimes([]);
        }
      } else {
        setSelectedDate("");
        setAvailableTimes([]);
        setSelectedTime("");
        setAgreementChecked(false);
        setSame_date_app(true);
      }
    } else {
      setSelectedDate("");
      setAvailableTimes([]);
      setSelectedTime("");
      setAgreementChecked(false);
      setSame_date_app(true);
    }
  };

  const handleTimeChange = (timeValue) => {
    setSelectedTime(timeValue);
    setAgreementChecked(false);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleAgreementChange = () => {
    setAgreementChecked(!agreementChecked);
  };

  const handleAgreementClick = async () => {
    if (!termsInfo) {
      try {
        const response = await fetch(`${API_BASE_PATH}/terms/${clinicSlug}/Appointment Booking/`);
        const data = await response.json();
        if (data.message && data.message.text) {
          settermsInfo(data.message.text);
        } else {
          settermsInfo("<p>Terms and conditions not available at the moment.</p>");
        }
      } catch (error) {
        settermsInfo("<p>Could not load terms and conditions. Please try again later.</p>");
      }
    }
    setOpenAgreementPopup(true);
  };

  const handleCloseAgreementPopup = () => setOpenAgreementPopup(false);
  const handle_app_list = () => setApp_list_dilog(false);

  const handleEmailChange = (value) => {
    const lowercasedEmail = value.toLowerCase();
    setEmail(lowercasedEmail);
    setIsEmailValid(isValidEmail(lowercasedEmail));
  };

  const handleBookAppointment = async () => {
    setSubmitbutton(false);
    const timeParts = selectedTime.split(",");
    const time = timeParts[0];
    const duration = timeParts[1];

    try {
      const response = await fetch(`${API_BASE_PATH}/book-appointment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicSlug,
          location: selectedLocation,
          provider: selectedProvider,
          date: selectedDate,
          time,
          duration,
          appointmentMode,
          reason,
          xps: responseData.xps,
          phoneNumber,
          email,
        }),
      });
      const data = await response.json();

      if (data.status === "success") {
        setButtonRedirect("Home");
        setRedirect(true);
        handleSuccess(data.message);
      } else {
        setButtonRedirect("Try Again");
        setRedirect(true);
        handleFailure(data.message);
      }
    } catch (error) {
      setButtonRedirect("Try Again");
      setRedirect(true);
      handleFailure("Appointment not booked!\nPlease try again.");
    } finally {
      setSubmitbutton(true);
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateProgressAndColor(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateProgressAndColor(prevStep);
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !selectedLocation;
      case 2:
        return !selectedProvider;
      case 3:
        return !appointmentMode;
      case 4:
        return !selectedDate;
      case 5:
        return !selectedTime;
      case 6:
        return !reason.trim() || (responseData?.email_valid === "no" && email.trim() && !isEmailValid);
      default:
        return false;
    }
  };

  const isDateAvailable = (date) => {
    if (!date || !date.isValid()) return false;
    const formattedDate = date.format("YYYY-MM-DD");
    return availableDates.includes(formattedDate);
  };

  const renderTimeSlots = () => {
    if (!availableTimes.length) return null;

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          mt: 1,
          pb: 1.5,
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
        }}
      >
        {availableTimes.map((timeSlot, index) => {
          const timeValue = `${timeSlot.time},${timeSlot.duration}`;
          const isSelected = selectedTime === timeValue;
          return (
            <Card
              key={`${timeSlot.date}_${index}_${timeSlot.time}`}
              variant={isSelected ? "elevation" : "outlined"}
              elevation={isSelected ? 4 : 0}
              onClick={() => handleTimeChange(timeValue)}
              sx={{
                p: 1.5,
                cursor: "pointer",
                borderColor: isSelected ? primaryColor : "divider",
                borderWidth: isSelected ? 2 : 1,
                bgcolor: isSelected ? `${primaryColor}10` : "background.paper",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: primaryColor,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: { xs: "110px", sm: "130px" },
                height: "auto",
                mr: index < availableTimes.length - 1 ? 1.5 : 0,
                flexShrink: 0,
              }}
            >
              <Typography variant="body1" fontWeight={isSelected ? 600 : 400} align="center">
                {formatTime(timeSlot.time)}
              </Typography>
              <Chip
                size="small"
                label={`${timeSlot.duration} min`}
                sx={{
                  mt: 0.5,
                  bgcolor: isSelected ? primaryColor : "rgba(0,0,0,0.05)",
                  color: isSelected ? theme.palette.getContrastText(primaryColor) : theme.palette.text.secondary,
                  fontSize: "0.7rem",
                  height: "20px",
                }}
              />
            </Card>
          );
        })}
      </Box>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Select Doctor (Family Doctor)
        return (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderColor: "divider", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FamilyRestroomIcon sx={{ color: primaryColor, mr: 1 }} />
                <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                  Select Your Family Doctor
                </Typography>
              </Box>

              {drNotice && (
                <Box sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "warning.50",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "flex-start",
                }}>
                  <WarningIcon sx={{ color: "warning.main", mr: 1, mt: 0.3 }} />
                  <Typography color="warning.main" variant="body2">
                    <strong>Notice:</strong> {drNotice}
                  </Typography>
                </Box>
              )}

              <FormControl component="fieldset" fullWidth>
                <RadioGroup value={selectedLocation} onChange={handleLocationChange}>
                  {locations.map((locationName) => (
                    <Card
                      key={locationName}
                      variant="outlined"
                      sx={{
                        mb: 1.5,
                        borderColor: selectedLocation === locationName ? primaryColor : "divider",
                        borderWidth: selectedLocation === locationName ? 2 : 1,
                        bgcolor: selectedLocation === locationName ? `${primaryColor}10` : "background.paper",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: primaryColor,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <FormControlLabel
                        value={locationName}
                        control={<Radio sx={{ color: primaryColor, "&.Mui-checked": { color: primaryColor } }} />}
                        label={
                          <Box sx={{ py: 0.5 }}>
                            <Typography variant="body1" fontWeight={500}>{locationName}</Typography>
                          </Box>
                        }
                        sx={{
                          m: 0,
                          width: "100%",
                          alignItems: "flex-start",
                          ".MuiFormControlLabel-label": { width: "100%" },
                        }}
                      />
                    </Card>
                  ))}
                </RadioGroup>
              </FormControl>
            </Card>
          </Grid>
        );

      case 2: // Select Location
        return (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderColor: "divider", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOnIcon sx={{ color: primaryColor, mr: 1 }} />
                <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                  Select Location
                </Typography>
              </Box>

              {selectedLocation && responseData.location[selectedLocation]?.provider_number ? (
                <Grid container spacing={2}>
                  {Object.keys(responseData.location[selectedLocation].provider_number).map((providerNumber) => {
                    const isSelected = selectedProvider === providerNumber;
                    const provider = responseData.location[selectedLocation].provider_number[providerNumber];
                    const locationDetail = clinicLocation?.find(loc => loc.name === provider?.name);

                    return (
                      <Grid item xs={12} key={providerNumber}>
                        <Card
                          variant={isSelected ? "elevation" : "outlined"}
                          elevation={isSelected ? 4 : 0}
                          onClick={() => handleProviderChange({ target: { value: providerNumber } })}
                          sx={{
                            p: 2,
                            cursor: "pointer",
                            borderColor: isSelected ? primaryColor : "divider",
                            borderWidth: isSelected ? 2 : 1,
                            bgcolor: isSelected ? `${primaryColor}10` : "background.paper",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: primaryColor,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocationOnIcon sx={{ color: isSelected ? primaryColor : "text.secondary", mr: 1 }} />
                            <Box>
                              <Typography
                                variant="body1"
                                fontWeight={isSelected ? 600 : 400}
                                sx={{ color: isSelected ? primaryColor : "text.primary" }}
                              >
                                {locationDetail?.address || "Location Address"}
                              </Typography>
                              {locationDetail?.name && (
                                <Typography variant="body2" color="text.secondary">
                                  {locationDetail.name}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {selectedLocation ? "No locations available for this doctor." : "Please select a doctor first."}
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        );

      case 3: // Select Appointment Mode
        return (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderColor: "divider", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ mr: 1, color: primaryColor }}>
                  {appointmentMode === "Clinic" && <LocalHospitalIcon />}
                  {appointmentMode === "Phone" && <PhoneIcon />}
                  {appointmentMode === "Video" && <VideocamIcon />}
                  {!appointmentMode && <VideocamIcon />}
                </Box>
                <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                  Appointment Mode
                </Typography>
              </Box>

              {appointmentModes.length > 0 ? (
                <Grid container spacing={2}>
                  {appointmentModes.map((mode) => {
                    const isDisabled = responseData.location[selectedLocation]?.provider_number[selectedProvider]?.AppointmentMode[mode] === 0;
                    const isSelected = appointmentMode === mode;

                    return (
                      <Grid item xs={4} sm={4} key={mode}>
                        <Card
                          variant={isSelected ? "elevation" : "outlined"}
                          elevation={isSelected ? 4 : 0}
                          onClick={() => !isDisabled && handleAppointmentModeChange({ target: { value: mode } })}
                          sx={{
                            p: { xs: 1, sm: 1.5 },
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            borderColor: isSelected ? primaryColor : "divider",
                            borderWidth: isSelected ? 2 : 1,
                            bgcolor: isDisabled
                              ? "action.disabledBackground"
                              : isSelected
                                ? `${primaryColor}10`
                                : "background.paper",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: isDisabled ? "divider" : primaryColor,
                              boxShadow: isDisabled ? "none" : "0 2px 8px rgba(0,0,0,0.1)",
                            },
                            opacity: isDisabled ? 0.6 : 1,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            color: isDisabled ? "text.disabled" : isSelected ? primaryColor : "text.primary",
                          }}>
                            {mode === "Clinic" &&
                              <LocalHospitalIcon sx={{ fontSize: { xs: 26, sm: 32 }, mb: { xs: 0.5, sm: 1 } }} />}
                            {mode === "Phone" &&
                              <PhoneIcon sx={{ fontSize: { xs: 26, sm: 32 }, mb: { xs: 0.5, sm: 1 } }} />}
                            {mode === "Video" &&
                              <VideocamIcon sx={{ fontSize: { xs: 26, sm: 32 }, mb: { xs: 0.5, sm: 1 } }} />}
                            <Typography
                              variant={isMobile ? "body2" : "body1"}
                              fontWeight={isSelected ? 600 : 400}
                              align="center"
                            >
                              {mode}
                            </Typography>
                            {isDisabled && (
                              <Typography variant="caption" color="text.disabled" align="center" sx={{ mt: 0.5 }}>
                                Not available
                              </Typography>
                            )}
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {selectedProvider
                      ? "No appointment modes available for the selected location."
                      : "Please select a location to see appointment modes."}
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        );

      case 4: // Select Date
        return (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderColor: "divider", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventIcon sx={{ color: primaryColor, mr: 1 }} />
                <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                  Select Date
                </Typography>
              </Box>

              {availableDates.length > 0 ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={dateObject}
                    onChange={handleDatePickerChange}
                    shouldDisableDate={(dateParam) => !isDateAvailable(dateParam)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    disablePast
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
                    }}
                    componentsProps={{
                      day: {
                        sx: (theme) => ({
                          fontWeight: "500 !important",
                          "&:not(.Mui-selected):not(.MuiPickersDay-today):not(.Mui-disabled):hover": {
                            backgroundColor: alpha(primaryColor, 0.12),
                          },
                          "&.Mui-disabled": {
                            opacity: 0.35,
                            color: theme.palette.text.disabled,
                            backgroundColor: "transparent",
                            pointerEvents: "none",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          },
                          "&.Mui-selected": {
                            fontWeight: 500,
                            backgroundColor: primaryColor,
                            color: theme.palette.getContrastText(primaryColor),
                            "&:hover, &.Mui-focusVisible": {
                              backgroundColor: alpha(primaryColor, 0.85),
                            },
                          },
                          "&.MuiPickersDay-today:not(.Mui-selected):not(.Mui-disabled)": {
                            border: `1px solid ${alpha(primaryColor, 0.6)}`,
                            color: primaryColor,
                            "&:hover": {
                              backgroundColor: alpha(primaryColor, 0.12),
                            },
                          },
                        }),
                      },
                      leftArrowIcon: { sx: { color: primaryColor, fontWeight: 500 } },
                      rightArrowIcon: { sx: { color: primaryColor, fontWeight: 500 } },
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {appointmentMode
                      ? "No dates available for the selected criteria."
                      : "Please select an appointment mode first."}
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        );

      case 5: // Select Time
        return (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderColor: "divider", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccessTimeIcon sx={{ color: primaryColor, mr: 1 }} />
                <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                  Select Time
                </Typography>
              </Box>

              {selectedDate ? (
                <>
                  {availableTimes.length > 0 ? (
                    renderTimeSlots()
                  ) : (
                    <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        No times available for the selected date.
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Please select a date first.
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        );

      case 6: // Contact Info & Reason
        return (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderColor: "divider", borderRadius: 2 }}>
              {responseData?.email_valid === "no" && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="error" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <EmailIcon sx={{ mr: 1, fontSize: 18 }} /> Update Email Address
                  </Typography>
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    Kindly update your email for receiving appointment updates and clinic communications.
                    Rest assured, we do not share your information with any third parties.
                  </Typography>
                  <TextField
                    label="Email Address (optional)"
                    variant="outlined"
                    onChange={(e) => handleEmailChange(e.target.value)}
                    value={email}
                    fullWidth
                    error={!!email.trim() && !isEmailValid}
                    type="email"
                    helperText={!!email.trim() && !isEmailValid ? "Invalid email address" : ""}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
                    }}
                  />
                </Box>
              )}

              {appointmentMode === "Phone" && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <PhoneIcon sx={{ mr: 1, fontSize: 18 }} /> Phone Number for Call
                  </Typography>
                  <TextField
                    type="tel"
                    label="Phone Number"
                    value={formatPhone(phoneNumber)}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                    required
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
                    }}
                  />
                </Box>
              )}

              {appointmentMode === "Video" && (
                <Box
                  sx={{ mb: 3, p: 2, bgcolor: "info.50", borderRadius: 1, display: "flex", alignItems: "flex-start" }}>
                  <InfoIcon sx={{ color: "info.main", mr: 1, mt: 0.3 }} />
                  <Typography variant="body2">
                    If you have provided valid email, you will receive an email with the video meeting link.
                    Please ensure your email is up to date.
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                  <NoteIcon sx={{ mr: 1, fontSize: 18 }} /> Reason for Appointment
                </Typography>
                <TextField
                  label="Reason for Appointment"
                  value={reason}
                  onChange={handleReasonChange}
                  fullWidth
                  multiline
                  required
                  rows={3}
                  placeholder="Briefly describe the reason for your visit."
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
                  }}
                />
              </Box>
            </Card>
          </Grid>
        );

      case 7: // Agreement & Book
        return (
          <AppointmentConfirmationCard selectedLocation={selectedLocation} selectedProvider={selectedProvider}
                                       responseData={responseData} selectedDate={selectedDate}
                                       selectedTime={selectedTime}
                                       appointmentMode={appointmentMode}
                                       reason={reason}
                                       agreementChecked={agreementChecked}
                                       handleAgreementChange={handleAgreementChange}
                                       handleAgreementClick={handleAgreementClick}
                                       same_date_app={same_date_app}
                                       formatTime={formatTime}
                                       primaryColor={primaryColor}
          ></AppointmentConfirmationCard>
        );

      default:
        return null;
    }
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

  const handleCloseApp = () => {
    setOpenModal(false);
    if (buttonRedirect === "Home" || buttonRedirect === "Try Again") {
      redirectHome();
    }
  };

  if (!responseData || !clinicInfo || !clinicLocation) {
    return (
      <Layout clinicInfo={clinicInfo}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress sx={{ color: primaryColor }} />
          <Typography sx={{ ml: 2 }}>Loading appointment data...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout clinicInfo={clinicInfo}>
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Paper
          style={{
            position: "sticky",
            top: "1rem",
            zIndex: 1000,
            padding: "1rem",
            marginBottom: "0.3rem",
            boxShadow: "0 0 10px 2px #2196F3",
            alignItems: "center",
          }}
        >
          <MKTypography
            variant="h6"
            gutterBottom
            style={{ fontSize: "0.81rem", fontWeight: "bold", textAlign: "center" }}
            color={"black"}
          >
            Book Appointment With Your Family Doctor
          </MKTypography>

          <ProfessionalStepper
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            stepLabels={STEP_LABELS}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </Paper>

        <Box sx={{ mt: { xs: 2, sm: 3 } }}>
          {renderStepContent()}
        </Box>

        <Box sx={{
          mt: { xs: 2, sm: 3 },
          display: "flex",
          justifyContent: currentStep === 1 ? "flex-end" : "space-between",
          alignItems: "center",
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          p: { xs: 1.5, sm: 2 },
          borderTop: "1px solid",
          borderColor: "divider",
          zIndex: 10,
          borderRadius: { xs: 0, sm: "0 0 8px 8px" },
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        }}>
          {currentStep > 1 && (
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={!submitbutton}
              startIcon={<KeyboardArrowLeft />}
              sx={{
                borderColor: secondaryColor,
                color: secondaryColor,
                "&:hover": {
                  borderColor: secondaryColor,
                  backgroundColor: alpha(secondaryColor, 0.08),
                },
              }}
            >
              Previous
            </Button>
          )}
          {currentStep < TOTAL_STEPS && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isNextDisabled() || !submitbutton}
              endIcon={<KeyboardArrowRight />}
              sx={{
                bgcolor: primaryColor,
                color: theme.palette.getContrastText(primaryColor),
                "&:hover": {
                  bgcolor: theme.palette.augmentColor({ color: { main: primaryColor } }).dark,
                },
                ml: currentStep === 1 ? "auto" : 0,
              }}
            >
              Next
            </Button>
          )}
          {currentStep === TOTAL_STEPS && (
            <Button
              variant="contained"
              disabled={
                !agreementChecked || !same_date_app || !submitbutton ||
                (responseData.email_valid === "no" && email.trim() && !isEmailValid) ||
                !selectedDate || !selectedTime || !reason.trim() || !appointmentMode
              }
              onClick={handleBookAppointment}
              startIcon={!submitbutton ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              sx={{
                bgcolor: theme.palette.success.main,
                color: theme.palette.getContrastText(theme.palette.success.main),
                "&:hover": {
                  bgcolor: theme.palette.success.dark,
                },
                "&.Mui-disabled": {
                  bgcolor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                },
              }}
            >
              {submitbutton ? "Book Appointment" : "Booking..."}
            </Button>
          )}
        </Box>
      </Container>

      <Dialog
        open={openAgreementPopup}
        onClose={handleCloseAgreementPopup}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ bgcolor: primaryColor, color: theme.palette.getContrastText(primaryColor) }}>
          Terms and Conditions
        </DialogTitle>
        <DialogContent dividers>
          <MKBox p={1}>
            {termsInfo ? <div dangerouslySetInnerHTML={{ __html: termsInfo }} /> :
              <CircularProgress sx={{ color: primaryColor }} />}
          </MKBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAgreementPopup} sx={{ color: primaryColor }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={app_list_dilog}
        onClose={handle_app_list}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ bgcolor: primaryColor, color: theme.palette.getContrastText(primaryColor) }}>
          Your Upcoming Appointments
        </DialogTitle>
        <DialogContent dividers>
          {appointmentlist && appointmentlist.length > 0 ? (
            <Card variant="outlined" sx={{ borderColor: "success.main", borderRadius: 1 }}>
              <CardContent>
                {appointmentlist}
              </CardContent>
            </Card>
          ) : (
            <Typography>You have no upcoming appointments.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handle_app_list} sx={{ color: primaryColor }}>Close</Button>
        </DialogActions>
      </Dialog>

      {!submitbutton && (
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

      <NotificationDialog
        open={openModal}
        onClose={handleCloseApp}
        content={modalContent}
        isError={isError}
        closeButtonLabel={buttonRedirect}
      />
    </Layout>
  );
};

export default FamilyAppointmentPage;