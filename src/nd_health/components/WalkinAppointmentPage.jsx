import React, {useState, useEffect, useCallback} from "react";
import {useParams, useLocation} from "react-router-dom";
import API_BASE_PATH from "../../apiConfig";
import Layout from "nd_health/components/Layout";
import {
    Typography,
    Button,
    Paper,
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
    DialogActions,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Chip,
    useTheme,
    useMediaQuery,
    Container,
    IconButton,
    Tooltip,
    MobileStepper
} from "@mui/material";
import { alpha } from '@mui/material/styles';
// Updated imports for dayjs
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Icons
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoteIcon from '@mui/icons-material/Note';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';

import {formatPhone, isValidEmail, redirectHomeM} from "nd_health/components/resources/utils";
import NdLoader from "../components/resources/Ndloader.jsx";
import MKTypography from "components/MKTypography";
import MKBox from "../../components/MKBox";
import NotificationDialog from "./resources/Notification";
import GoHome from "./resources/GoHome";
import {StepConnector } from "@mui/material";
import { styled } from "@mui/system";
import ProfessionalStepper from "./resources/ProfessionalStepper";
import AppointmentConfirmationCard from "./resources/AppointmentConfirmationCard";

const TOTAL_STEPS = 7;
const STEP_LABELS = [
    "Location",
    "Doctor",
    "Mode",
    "Date",
    "Time",
    "Details",
    "Confirm"
];

const STEP_ICONS = [
    <LocationOnIcon />,
    <PersonIcon />,
    <LocalHospitalIcon />,
    <EventIcon />,
    <AccessTimeIcon />,
    <NoteIcon />,
    <CheckCircleIcon />
];
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
    [`& .${StepConnector.line}`]: {
        borderColor: theme.palette.divider,
        borderTopWidth: 2,
    },
}));

const WalkinAppointmentPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const {clinicSlug} = useParams();
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedProvider, setSelectedProvider] = useState("Select Doctor");
    const [selectedDate, setSelectedDate] = useState(""); // Stores date as 'YYYY-MM-DD' string
    const [selectedTime, setSelectedTime] = useState("");
    const [availableTimes, setAvailableTimes] = useState([]);
    const [availableDates, setAvailableDates] = useState([]); // Stores dates as 'YYYY-MM-DD' strings
    const [dateObject, setDateObject] = useState(null); // Stores dayjs object or null for DatePicker
    const [slotIndex, setSlotIndex] = useState(0);
    const [appointmentMode, setSelectedAppointmentMode] = useState("");
    const [appointmentModes, setAppointmentModes] = useState([]);
    const [isAppointmentAvailable, setIsAppointmentAvailable] = useState(false);
    const [reason, setReason] = useState("");
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [openAgreementPopup, setOpenAgreementPopup] = useState(false);
    const [termsInfo, settermsInfo] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [appointmentBookContent, setAppointmentBookContent] = useState("");
    const [openApp, setOpenApp] = useState(false);
    const [buttonRedirect, setButtonRedirect] = useState("");
    const [progress, setProgress] = useState(0);

    const [appointmentlist, setAppointmentlist] = useState([]);
    const [app_list_dilog, setApp_list_dilog] = useState(false);
    const [same_date_app, setSame_date_app] = useState(true);

    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [submitbutton, setSubmitbutton] = useState(true);

    const location = useLocation();
    const responseData = location.state && location.state.responseData;
    const clinicInfo = location.state && location.state.clinicInfo;
    const clinicLocation = location.state && location.state.locationsData;
    const [titlePaperColor, setTitlePaperColor] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [isError, setIsError] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const [currentStep, setCurrentStep] = useState(1);

    const primaryColor = clinicInfo?.colors?.primary || theme.palette.primary.main;
    const secondaryColor = clinicInfo?.colors?.secondary || theme.palette.secondary.main;
    const [hasShownAppointmentDialog, setHasShownAppointmentDialog] = useState(false);
    const updateProgressAndColor = useCallback((step) => {
        const newProgress = (step / TOTAL_STEPS) * 100;
        setProgress(newProgress);
        if (newProgress >= 100 && step === TOTAL_STEPS) {
            setTitlePaperColor(primaryColor);
        } else if (newProgress > 0) {
            setTitlePaperColor(secondaryColor);
        } else {
            setTitlePaperColor("");
        }
    }, [TOTAL_STEPS, primaryColor, secondaryColor]);

    // Updated formatTime to use dayjs
    const formatTime = (timeString) => {
        if (!timeString) return "";
        // Assuming timeString is in "HH:mm" or "H:m" format
        return dayjs(timeString, "HH:mm").format("h:mm A");
    };

    useEffect(() => {
        if (responseData) {
            const locKeys = Object.keys(responseData.location);
            setLocations(locKeys);

            if (locKeys.length === 1 && !selectedLocation) {
                setSelectedLocation(locKeys[0]);
            }

            if (responseData.letest_appointments && responseData.letest_appointments.length > 0) {
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
        } else {
            if (typeof redirectHomeM === 'function') {
                redirectHomeM(clinicSlug);
            } else {
                window.location.href = `/clinic/${clinicSlug}/`;
            }
        }
    }, [responseData, selectedLocation, clinicSlug]); // formatTime removed as it's stable if dayjs is stable

    // Add a separate useEffect for progress updates
    useEffect(() => {
        updateProgressAndColor(currentStep);
    }, [currentStep, updateProgressAndColor]);

    const redirectHome = () => {
        setOpenApp(false);
        if (typeof redirectHomeM === 'function') {
            redirectHomeM(clinicSlug);
        } else {
            window.location.href = `/clinic/${clinicSlug}/`;
        }
    };

    const handleLocationChange = (event) => {
        const locationName = event.target.value;
        setSelectedLocation(locationName);
        setSelectedProvider('Select Doctor');
        setAppointmentModes([]);
        setSelectedAppointmentMode("");
        setAvailableDates([]);
        setSelectedDate('');
        setDateObject(null);
        setAvailableTimes([]);
        setSelectedTime('');
        setIsAppointmentAvailable(false);
        setAgreementChecked(false);
        setSame_date_app(true);
    };

    const handleProviderChange = (event) => {
        const providerNumber = event.target.value;
        setSelectedProvider(providerNumber);
        if (providerNumber && providerNumber !== "Select Doctor" && responseData.location[selectedLocation]?.provider_number[providerNumber]) {
            const providerData = responseData.location[selectedLocation].provider_number[providerNumber];
            setAppointmentModes(Object.keys(providerData.AppointmentMode));
            setIsAppointmentAvailable(Object.keys(providerData.letestappointmentslots || {}).length > 0);
        } else {
            setAppointmentModes([]);
            setIsAppointmentAvailable(false);
        }
        setSelectedAppointmentMode("");
        setAvailableDates([]);
        setSelectedDate('');
        setDateObject(null);
        setAvailableTimes([]);
        setSelectedTime('');
        setAgreementChecked(false);
        setSame_date_app(true);
    };

    const handleAppointmentModeChange = (event) => {
        const selectedMode = event.target.value;
        setSelectedAppointmentMode(selectedMode);

        setSelectedDate('');
        setDateObject(null);
        setSelectedTime('');
        setAvailableTimes([]);
        setAgreementChecked(false);
        setSame_date_app(true);

        if (selectedMode === 'Phone') {
            setPhoneNumber(responseData.patient_phone || "");
            setSelectedOption('phone');
        } else if (selectedMode === 'Video') {
            setSelectedOption('email');
        } else if (selectedMode === 'Clinic') {
            setSelectedOption('clinic');
        }

        if (selectedLocation && selectedProvider && selectedProvider !== "Select Doctor" && selectedMode) {
            const appointmentTypes = responseData.appointment_bookCode[selectedMode];
            const dates = Object.keys(
              responseData.location[selectedLocation]?.provider_number[selectedProvider]?.letestappointmentslots || {}
            ).filter((date) =>
              responseData.location[selectedLocation]?.provider_number[selectedProvider]?.letestappointmentslots[date].some(
                (slot) => appointmentTypes.includes(slot.type)
              )
            );
            setAvailableDates(dates);
        } else {
            setAvailableDates([]);
        }
    };

    // Handle date change from DatePicker (uses dayjs)
    const handleDatePickerChange = (newDate) => { // newDate is a dayjs object or null
        setDateObject(newDate); // Always update dateObject to reflect picker's state
        if (newDate && newDate.isValid()) {
            const formattedDate = newDate.format('YYYY-MM-DD'); // dayjs format
            if (availableDates.includes(formattedDate)) {
                setSelectedDate(formattedDate);
                setSelectedTime('');
                setAgreementChecked(false);
                let conflict = false;
                if (!app_list_dilog) {
                    setApp_list_dilog(true);
                }
                if (responseData.letest_appointments) {
                    for (let i = 0; i < responseData.letest_appointments.length; i++) {
                        if (responseData.letest_appointments[i].appointmentDate === formattedDate) {
                            conflict = true;
                            break;
                        }
                    }
                }
                setSame_date_app(!conflict);
                if (selectedLocation && selectedProvider && selectedProvider !== "Select Doctor" && appointmentMode) {
                    const appointmentTypes = responseData.appointment_bookCode[appointmentMode];
                    const times = responseData.location[selectedLocation]?.provider_number[selectedProvider]?.letestappointmentslots[formattedDate]
                      .filter(slot => appointmentTypes.includes(slot.type)) || [];
                    setAvailableTimes(times);
                } else {
                    setAvailableTimes([]);
                }
            } else {
                // Date is valid dayjs object but not in the availableDates list
                setSelectedDate('');
                setAvailableTimes([]);
                setSelectedTime('');
                setAgreementChecked(false);
                setSame_date_app(true); // No selected date, so no conflict
            }
        } else {
            // newDate is null (cleared) or an invalid dayjs object
            setSelectedDate('');
            setAvailableTimes([]);
            setSelectedTime('');
            setAgreementChecked(false);
            setSame_date_app(true); // No selected date, so no conflict
        }
    };

    // For dropdown date selection (fallback, uses dayjs for parsing to dateObject)
    const handleDateChange = (event) => {
        const dateValue = event.target.value; // dateValue is 'YYYY-MM-DD' string
        setSelectedDate(dateValue);

        const parsedDate = dayjs(dateValue, 'YYYY-MM-DD'); // dayjs parse
        if (parsedDate.isValid()) {
            setDateObject(parsedDate); // Store dayjs object
        } else {
            // console.error("Error parsing date string with dayjs:", dateValue);
            setDateObject(null);
        }

        setSelectedTime('');
        setAgreementChecked(false);

        let conflict = false;
        if (responseData.letest_appointments && dateValue) {
            for (let i = 0; i < responseData.letest_appointments.length; i++) {
                if (responseData.letest_appointments[i].appointmentDate === dateValue) {
                    conflict = true;
                    break;
                }
            }
        }
        setSame_date_app(!conflict);


        if (selectedLocation && selectedProvider && selectedProvider !== "Select Doctor" && appointmentMode && dateValue) {
            const appointmentTypes = responseData.appointment_bookCode[appointmentMode];
            const times = responseData.location[selectedLocation]?.provider_number[selectedProvider]?.letestappointmentslots[dateValue]
              .filter(slot => appointmentTypes.includes(slot.type)) || [];
            setAvailableTimes(times);
        } else {
            setAvailableTimes([]);
        }
    };

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
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
                // console.error("Error fetching clinic terms:", error);
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

    const handleCloseApp = () => {
        setOpenApp(false);
        if (buttonRedirect === 'Home' || buttonRedirect === 'Try Again') {
            redirectHome();
        }
    };

    const handleBookAppointment = async () => {
        setSubmitbutton(false);
        const timeParts = selectedTime.split(',');
        const time = timeParts[0];
        const duration = timeParts[1];

        try {
            const response = await fetch(`${API_BASE_PATH}/book-appointment/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    clinicSlug, selectedLocation, provider: selectedProvider,
                    date: selectedDate, time, duration, appointmentMode,
                    reason, xps: responseData.xps, phoneNumber: phoneNumber, email: email, appointmentNumber: slotIndex
                }),
            });
            const data = await response.json();
            setAppointmentBookContent(data.message || "Received an empty response from the server.");
            if (data.status === 'success') {
                setButtonRedirect('Home');
            } else {
                setButtonRedirect('Try Again');
            }
        } catch (error) {
            // console.error("Booking error:", error);
            setAppointmentBookContent("An error occurred while booking. Please try again.");
            setButtonRedirect('Try Again');
        } finally {
            setSubmitbutton(true);
            setOpenApp(true);
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
            case 1: return !selectedLocation;
            case 2: return !selectedProvider || selectedProvider === "Select Doctor";
            case 3: return !appointmentMode;
            case 4: return !selectedDate; // selectedDate is string 'YYYY-MM-DD'
            case 5: return !selectedTime;
            case 6: return !reason.trim() || (responseData?.email_valid === "no" && email.trim() && !isEmailValid);
            default: return false;
        }
    };

    // Function to check if a date is available (date param is a dayjs object)
    const isDateAvailable = (date) => {
        if (!date || !date.isValid()) return false; // dayjs isValid
        const formattedDate = date.format('YYYY-MM-DD'); // dayjs format
        return availableDates.includes(formattedDate);
    };

    const renderTimeSlots = () => {
        if (!availableTimes.length) return null;

        return (
          <Box
            sx={{
                display: 'flex', // Arrange items in a row
                flexDirection: 'row',
                overflowX: 'auto', // Enable horizontal scrolling
                whiteSpace: 'nowrap', // Prevent items from wrapping to the next line (optional, flex usually handles this)
                mt: 1,
                pb: 1.5, // Add some padding at the bottom to ensure scrollbar doesn't overlap content
                '&::-webkit-scrollbar': { // Optional: Style the scrollbar for a cleaner look
                    height: '8px',
                },
                '&::-webkit-scrollbar-thumb': { // Optional: Style the scrollbar thumb
                    background: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-track': { // Optional: Style the scrollbar track
                    background: 'transparent',
                }
            }}
          >
              {availableTimes.map((timeSlot, index) => {
                  const isSelected = selectedTime === `${timeSlot.time},${timeSlot.duration}`;
                  return (
                    <Card
                      key={`${timeSlot.date}_${index}_${timeSlot.time}`} // Key moved to the direct child of map
                      variant={isSelected ? "elevation" : "outlined"}
                      elevation={isSelected ? 4 : 0}
                      onClick={() => {setSelectedTime(`${timeSlot.time},${timeSlot.duration}`);setSlotIndex(timeSlot.appointmentNumber);}}
                      sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          borderColor: isSelected ? primaryColor : 'divider',
                          borderWidth: isSelected ? 2 : 1,
                          bgcolor: isSelected ? `${primaryColor}10` : 'background.paper',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                              borderColor: primaryColor,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          },
                          display: 'inline-flex', // Or 'flex' if you prefer, for internal alignment
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: { xs: '110px', sm: '130px' }, // Ensure cards have a minimum width
                          height: 'auto', // Let content define height, or set a fixed one if preferred
                          mr: index < availableTimes.length - 1 ? 1.5 : 0, // Margin to the right for spacing, except for the last item
                          flexShrink: 0, // Prevent cards from shrinking
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
                              bgcolor: isSelected ? primaryColor : 'rgba(0,0,0,0.05)',
                              color: isSelected ? (theme.palette.getContrastText(primaryColor)) : theme.palette.text.secondary,
                              fontSize: '0.7rem',
                              height: '20px'
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
            case 1: // Select Location
                return (
                  <Grid item xs={12}>
                      <Card variant="outlined" sx={{ p: {xs: 1.5, sm: 2}, borderColor: 'divider', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <LocationOnIcon sx={{ color: primaryColor, mr: 1 }} />
                              <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                                  Select Location
                              </Typography>
                          </Box>
                          <FormControl component="fieldset" fullWidth>
                              <RadioGroup value={selectedLocation} onChange={handleLocationChange}>
                                  {locations.map((locationName) => {
                                      const locDetail = clinicLocation?.find(loc => loc.name === locationName);
                                      return (
                                        <Card
                                          key={locationName}
                                          variant="outlined"
                                          sx={{
                                              mb: 1,
                                              borderColor: selectedLocation === locationName ? primaryColor : 'divider',
                                              borderWidth: selectedLocation === locationName ? 2 : 1,
                                              bgcolor: selectedLocation === locationName ? `${primaryColor}10` : 'background.paper',
                                              transition: 'all 0.2s ease',
                                              '&:hover': {
                                                  borderColor: primaryColor,
                                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                              }
                                          }}
                                        >
                                            <FormControlLabel
                                              value={locationName}
                                              control={<Radio sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }} />}
                                              label={
                                                  <Box sx={{ py: 0.5 }}>
                                                      <Typography variant="h6" fontWeight={500}>{locDetail?.name || locationName}</Typography>
                                                      {locDetail?.address && (
                                                        <Typography variant="caption" color="text.secondary">{locDetail.address}</Typography>
                                                      )}
                                                  </Box>
                                              }
                                              sx={{
                                                  m: 0,
                                                  width: '100%',
                                                  alignItems: 'flex-start',
                                                  '.MuiFormControlLabel-label': { width: '100%' }
                                              }}
                                            />
                                        </Card>
                                      );
                                  })}
                              </RadioGroup>
                          </FormControl>
                      </Card>
                  </Grid>
                );
            case 2: // Select Doctor
                return (
                  <Grid item xs={12}>
                      <Card variant="outlined" sx={{ p: {xs: 1.5, sm: 2}, borderColor: 'divider', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <PersonIcon sx={{ color: primaryColor, mr: 1 }} />
                              <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                                  Select Doctor
                              </Typography>
                          </Box>

                          {selectedLocation && responseData.location[selectedLocation]?.provider_number ? (
                            <Grid container spacing={2}>
                                {Object.keys(responseData.location[selectedLocation].provider_number).map((providerNumber) => {
                                    const isSelected = selectedProvider === providerNumber;
                                    const providerName = responseData.location[selectedLocation].provider_number[providerNumber]?.name;

                                    return (
                                      <Grid item xs={12} sm={6} md={4} key={providerNumber}>
                                          <Card
                                            variant={isSelected ? "elevation" : "outlined"}
                                            elevation={isSelected ? 4 : 0}
                                            onClick={() => handleProviderChange({ target: { value: providerNumber }})} // Ensure event structure for handler
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                borderColor: isSelected ? primaryColor : 'divider',
                                                borderWidth: isSelected ? 2 : 1,
                                                bgcolor: isSelected ? `${primaryColor}10` : 'background.paper',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    borderColor: primaryColor,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                },
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}
                                          >
                                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                  <PersonIcon sx={{ color: isSelected ? primaryColor : 'text.secondary', mr: 1 }} />
                                                  <Typography
                                                    variant="body1"
                                                    fontWeight={isSelected ? 600 : 400}
                                                    sx={{ color: isSelected ? primaryColor : 'text.primary' }}
                                                  >
                                                      {providerName}
                                                  </Typography>
                                              </Box>
                                          </Card>
                                      </Grid>
                                    );
                                })}
                            </Grid>
                          ) : (
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2" color="textSecondary">
                                    {selectedLocation ? "No doctors available at this location." : "Please select a location first."}
                                </Typography>
                            </Box>
                          )}
                      </Card>
                  </Grid>
                );
            case 3: // Select Appointment Mode
                return (
                  <Grid item xs={12}>
                      <Card variant="outlined" sx={{ p: {xs: 1.5, sm: 1}, borderColor: 'divider', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ mr: 1, color: primaryColor }}>
                                  {appointmentMode === 'Clinic' && <LocalHospitalIcon />}
                                  {appointmentMode === 'Phone' && <PhoneIcon />}
                                  {appointmentMode === 'Video' && <VideocamIcon />}
                                  {!appointmentMode && <VideocamIcon />} {/* Default icon */}
                              </Box>
                              <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                                  Appointment Mode
                              </Typography>
                          </Box>

                          {appointmentModes.length > 0 ? (
                            <Grid container spacing={1}>
                                {appointmentModes.map((mode) => {
                                    const isDisabled = responseData.location[selectedLocation]?.provider_number[selectedProvider]?.AppointmentMode[mode] === 0;
                                    const isSelected = appointmentMode === mode;

                                    return (
                                      <Grid item xs={4} sm={4} key={mode}>
                                          <Card
                                            variant={isSelected ? "elevation" : "outlined"}
                                            elevation={isSelected ? 4 : 0}
                                            onClick={() => !isDisabled && handleAppointmentModeChange({ target: { value: mode }})}
                                            sx={{
                                                p: { xs: 1, sm: 1.5 }, // Reduced padding for xs, slightly reduced for sm
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                borderColor: isSelected ? primaryColor : 'divider',
                                                borderWidth: isSelected ? 2 : 1,
                                                bgcolor: isDisabled
                                                  ? 'action.disabledBackground'
                                                  : isSelected
                                                    ? `${primaryColor}10` // Consider alpha(primaryColor, 0.1) if you have alpha imported
                                                    : 'background.paper',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    borderColor: isDisabled ? 'divider' : primaryColor,
                                                    boxShadow: isDisabled ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'
                                                },
                                                opacity: isDisabled ? 0.6 : 1,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                          >
                                              <Box sx={{
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                                  textAlign: 'center', // Ensure text inside box is centered if it wraps
                                                  color: isDisabled ? 'text.disabled' : isSelected ? primaryColor : 'text.primary'
                                              }}>
                                                  {mode === 'Clinic' && <LocalHospitalIcon sx={{ fontSize: { xs: 26, sm: 32 }, mb: { xs: 0.5, sm: 1 } }} />}
                                                  {mode === 'Phone' && <PhoneIcon sx={{ fontSize: { xs: 26, sm: 32 }, mb: { xs: 0.5, sm: 1 } }} />}
                                                  {mode === 'Video' && <VideocamIcon sx={{ fontSize: { xs: 26, sm: 32 }, mb: { xs: 0.5, sm: 1 } }} />}
                                                  <Typography
                                                    // Use isMobile to change variant
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
                                      </Grid>                                    );
                                })}
                            </Grid>
                          ) : (
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2" color="textSecondary">
                                    {selectedProvider && selectedProvider !== "Select Doctor"
                                      ? "No appointment modes available for the selected doctor."
                                      : "Please select a doctor to see appointment modes."}
                                </Typography>
                            </Box>
                          )}
                      </Card>
                  </Grid>
                );
            case 4: // Select Date
                return (
                  <Grid item xs={12}>
                      <Card variant="outlined" sx={{ p: {xs: 1.5, sm: 2}, borderColor: 'divider', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <EventIcon sx={{ color: primaryColor, mr: 1 }} />
                              <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                                  Select Date
                              </Typography>
                          </Box>

                          {availableDates.length > 0 ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  label={"Select Date"}
                                  value={dateObject} // Expects dayjs object or null
                                  onChange={handleDatePickerChange}
                                  shouldDisableDate={(dateParam) => !isDateAvailable(dateParam)} // dateParam is dayjs object
                                  renderInput={(params) => <TextField {...params} fullWidth />}
                                  disablePast
                                  sx={{ // Styles for the TextField input
                                      width: '100%',
                                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor }
                                  }}
                                  componentsProps={{
                                      day: {
                                          sx: (theme) => ({
                                              fontWeight: '500 !important',  // Force the weight
                                              // General hover for enabled, non-selected, non-today days
                                              '&:not(.Mui-selected):not(.MuiPickersDay-today):not(.Mui-disabled):hover': {
                                                  backgroundColor: alpha(primaryColor, 0.12), // Subtle hover
                                              },
                                              // Styles for DISABLED days
                                              '&.Mui-disabled': {
                                                  opacity: 0.35, // Significantly more faded
                                                  color: theme.palette.text.disabled,
                                                  backgroundColor: 'transparent', // No background
                                                  pointerEvents: 'none', // No interaction cues
                                                  '&:hover': {
                                                      backgroundColor: 'transparent', // No hover effect
                                                  },
                                              },
                                              // Styles for SELECTED days
                                              '&.Mui-selected': {
                                                  fontWeight:500,
                                                  backgroundColor: primaryColor,
                                                  color: theme.palette.getContrastText(primaryColor),
                                                  '&:hover, &.Mui-focusVisible': { // Hover and keyboard focus
                                                      backgroundColor: alpha(primaryColor, 0.85), // Slightly adjust on hover/focus
                                                  },
                                              },
                                              // Styles for TODAY's date (if not selected and not disabled)
                                              '&.MuiPickersDay-today:not(.Mui-selected):not(.Mui-disabled)': {
                                                  border: `1px solid ${alpha(primaryColor, 0.6)}`, // Border for today
                                                  color: primaryColor, // Make today's date number use primaryColor
                                                  '&:hover': {
                                                      backgroundColor: alpha(primaryColor, 0.12), // Consistent hover
                                                  }
                                              },
                                          }),
                                      },
                                      // Optional: Style the calendar header (day names like S, M, T, W, T, F, S)
                                      dayOfWeek: {
                                          sx: {
                                              color: theme.palette.text.primary,
                                              fontWeight: 'medium',
                                          }
                                      },
                                      // Optional: Style the arrow buttons for month navigation
                                      leftArrowIcon: { sx: { color: primaryColor, fontWeight:500 } },
                                      rightArrowIcon: { sx: { color: primaryColor, fontWeight:500 } },
                                  }}
                                />
                            </LocalizationProvider>
                          ) : (
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2" color="textSecondary">
                                    {appointmentMode
                                      ? "No dates available for the selected criteria."
                                      : "Please select an appointment mode first."}
                                </Typography>
                            </Box>
                          )}

                          {/*{availableDates.length > 0 && (*/}
                          {/*  <Box sx={{ mt: 2, display: { xs: 'block', sm: 'none' } }}> /!* Fallback for mobile *!/*/}
                          {/*      <Typography variant="subtitle2" sx={{ mb: 1 }}>*/}
                          {/*          Or select from list:*/}
                          {/*      </Typography>*/}
                          {/*      <Select*/}
                          {/*        value={selectedDate} // selectedDate is 'YYYY-MM-DD' string*/}
                          {/*        onChange={handleDateChange}*/}
                          {/*        fullWidth*/}
                          {/*        displayEmpty*/}
                          {/*        sx={{*/}
                          {/*            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },*/}
                          {/*            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor },*/}
                          {/*            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor }*/}
                          {/*        }}*/}
                          {/*      >*/}
                          {/*          <MenuItem value="" disabled><em>Select Date</em></MenuItem>*/}
                          {/*          {availableDates.map((dateStr, index) => (*/}
                          {/*            <MenuItem key={`${dateStr}_${index}`} value={dateStr}>{dateStr}</MenuItem>*/}
                          {/*          ))}*/}
                          {/*      </Select>*/}
                          {/*  </Box>*/}
                          {/*)}*/}
                      </Card>
                  </Grid>
                );
            case 5: // Select Time
                return (
                  <Grid item xs={12}>
                      <Card variant="outlined" sx={{ p: {xs: 1.5, sm: 2}, borderColor: 'divider', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                      <Typography variant="body2" color="textSecondary">
                                          No times available for the selected date.
                                      </Typography>
                                  </Box>
                                )}
                            </>
                          ) : (
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
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
                      <Card variant="outlined" sx={{ p: {xs: 1.5, sm: 2}, borderColor: 'divider', borderRadius: 2 }}>
                          {/*<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>*/}
                          {/*    <NoteIcon sx={{ color: primaryColor, mr: 1 }} />*/}
                          {/*    <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>*/}
                          {/*        Appointment Details*/}
                          {/*    </Typography>*/}
                          {/*</Box>*/}

                          {responseData?.email_valid === "no" && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="error" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <EmailIcon sx={{ mr: 1, fontSize: 18 }} /> Update Email Address
                                </Typography>
                                <TextField
                                  label="Email Address"
                                  variant="outlined"
                                  onChange={(e) => handleEmailChange(e.target.value)}
                                  value={email}
                                  fullWidth
                                  error={!!email.trim() && !isEmailValid}
                                  type="email"
                                  helperText={!!email.trim() && !isEmailValid ? "Invalid email address" : ""}
                                  sx={{
                                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor }
                                  }}
                                />
                            </Box>
                          )}

                          {appointmentMode === "Phone" && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <PhoneIcon sx={{ mr: 1, fontSize: 18 }} /> Phone Number for Call
                                </Typography>
                                <TextField
                                  type="tel"
                                  value={formatPhone(phoneNumber)}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                  fullWidth
                                  required
                                  sx={{
                                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor }
                                  }}
                                />
                            </Box>
                          )}

                          {appointmentMode === "Video" && (
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'info.50', borderRadius: 1, display: 'flex', alignItems: 'flex-start' }}>
                                <InfoIcon sx={{ color: 'info.main', mr: 1, mt: 0.3 }} />
                                <Typography variant="body2">
                                    You will receive an email with the video meeting link. Please ensure your email is up to date.
                                </Typography>
                            </Box>
                          )}

                          <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                  <NoteIcon sx={{ mr: 1, fontSize: 18 }} /> Reason for Appointment
                              </Typography>
                              <TextField
                                value={reason}
                                onChange={handleReasonChange}
                                fullWidth
                                multiline
                                required
                                rows={3}
                                placeholder="Briefly describe the reason for your visit."
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: primaryColor }
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
                )
                // return (
                //   <Grid item xs={6}>
                //       <Card variant="outlined" sx={{ p: {xs: 1.5, sm: 2}, borderColor: 'divider', borderRadius: 2 }}>
                //           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                //               <CheckCircleIcon sx={{ color: primaryColor, mr: 1 }} />
                //               <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
                //                   Confirm Appointment Details
                //               </Typography>
                //           </Box>
                //
                //           <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                //               <Grid container spacing={2}>
                //                   <Grid item xs={12} sm={6}>
                //                       <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                //                           <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} /> Location
                //                       </Typography>
                //                       <Typography variant="body1">{selectedLocation}</Typography>
                //                   </Grid>
                //                   <Grid item xs={12} sm={6}>
                //                       <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                //                           <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} /> Doctor
                //                       </Typography>
                //                       <Typography variant="body1">
                //                           {selectedProvider && selectedProvider !== "Select Doctor" && responseData.location[selectedLocation]?.provider_number[selectedProvider]?.name}
                //                       </Typography>
                //                   </Grid>
                //                   <Grid item xs={12} sm={6}>
                //                       <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                //                           <EventIcon sx={{ fontSize: 16, mr: 0.5 }} /> Date
                //                       </Typography>
                //                       <Typography variant="body1">{selectedDate}</Typography>
                //                   </Grid>
                //                   <Grid item xs={12} sm={6}>
                //                       <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                //                           <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} /> Time
                //                       </Typography>
                //                       <Typography variant="body1">
                //                           {selectedTime && formatTime(selectedTime.split(',')[0])}
                //                       </Typography>
                //                   </Grid>
                //                   <Grid item xs={12}>
                //                       <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                //                           {appointmentMode === 'Clinic' && <LocalHospitalIcon sx={{ fontSize: 16, mr: 0.5 }} />}
                //                           {appointmentMode === 'Phone' && <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />}
                //                           {appointmentMode === 'Video' && <VideocamIcon sx={{ fontSize: 16, mr: 0.5 }} />}
                //                           Appointment Type
                //                       </Typography>
                //                       <Typography variant="body1">{appointmentMode}</Typography>
                //                   </Grid>
                //                   <Grid item xs={12}>
                //                       <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                //                           <NoteIcon sx={{ fontSize: 16, mr: 0.5 }} /> Reason
                //                       </Typography>
                //                       <Typography variant="body1" sx={{
                //                           maxHeight: '80px',
                //                           overflow: 'auto',
                //                           bgcolor: 'background.paper',
                //                           p: 1,
                //                           borderRadius: 1,
                //                           border: '1px solid',
                //                           borderColor: 'divider'
                //                       }}>
                //                           {reason}
                //                       </Typography>
                //                   </Grid>
                //               </Grid>
                //           </Box>
                //
                //           <Box sx={{ mb: 2 }}>
                //               <FormControlLabel
                //                 control={
                //                     <Switch
                //                       checked={agreementChecked}
                //                       onChange={handleAgreementChange}
                //                       name="agreement"
                //                       color="primary"
                //                       sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: primaryColor }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: primaryColor } }}
                //                     />
                //                 }
                //                 label={
                //                     <Typography variant="body2">
                //                         I agree to the terms and conditions.
                //                     </Typography>
                //                 }
                //               />
                //               <Typography
                //                 onClick={handleAgreementClick}
                //                 sx={{
                //                     cursor: "pointer",
                //                     color: primaryColor,
                //                     textDecoration: 'underline',
                //                     display: 'inline-block',
                //                     ml: isMobile ? 0 : 4,
                //                     mt: isMobile ? 1 : 0,
                //                     fontSize: '0.875rem'
                //                 }}
                //               >
                //                   View Terms and Conditions
                //               </Typography>
                //           </Box>
                //
                //           {!same_date_app && selectedDate && (
                //             <Box sx={{ p: 2, mt: 1, bgcolor: 'error.50', borderRadius: 1, display: 'flex', alignItems: 'flex-start' }}>
                //                 <WarningIcon sx={{ color: 'error.main', mr: 1, mt: 0.3 }} />
                //                 <Typography color="error.main">
                //                     You already have an appointment on this date. Booking another may lead to conflicts.
                //                 </Typography>
                //             </Box>
                //           )}
                //       </Card>
                //   </Grid>
                // );
            default: return null;
        }
    };

    if (!responseData || !clinicInfo || !clinicLocation) {
        return (
          <Layout clinicInfo={clinicInfo}>
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                  <CircularProgress sx={{ color: primaryColor }} />
                  <Typography sx={{ml: 2}}>Loading appointment data...</Typography>
              </Box>
          </Layout>
        );
    }

    return (
      <Layout clinicInfo={clinicInfo}>
          <Container maxWidth="md" sx={{ py: {xs: 0, sm: 3}, px: {xs: 1, sm: 1, md: 3} }}>
              <Paper
                style={{
                    position: "sticky",
                    top: "1rem",
                    zIndex: 1000,
                    padding: "1rem",
                    marginBottom: "0.3rem",
                    boxShadow: "0 0 10px 2px #2196F3",
                    alignItems: "center", // Vertically centers the content

                }}
              >
                  <MKTypography
                    variant="h6"
                    gutterBottom
                    style={{ fontSize: "0.81rem", fontWeight: "bold", textAlign: "center" }}
                    color={"black"}
                  >
                      Book Walk-in Appointment
                  </MKTypography>
                  {/* Stepper for all steps */}

                  <ProfessionalStepper
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    stepLabels={STEP_LABELS}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                  />
              </Paper>

              {/*<GoHome clinicSlug={clinicSlug} />*/}

              <Box sx={{ mt: {xs: 0, sm: 3} }}>
                  {renderStepContent()}
              </Box>

              <Box sx={{
                  mt: {xs: 1, sm: 3},
                  display: 'flex',
                  justifyContent: currentStep === 1 ? 'flex-end' : 'space-between',
                  alignItems: 'center',
                  position: 'sticky',
                  bottom: 0,
                  bgcolor: 'background.paper',
                  p: {xs: 1.5, sm: 2},
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  zIndex: 10, // Ensure it's above content but below dialogs
                  borderRadius: {xs: 0, sm: '0 0 8px 8px'}, // Match card radius if applicable
                  boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
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
                          '&:hover': {
                              borderColor: secondaryColor,
                              backgroundColor: alpha(secondaryColor, 0.08)
                          }
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
                          '&:hover': {
                              bgcolor: theme.palette.augmentColor({ color: { main: primaryColor } }).dark
                          },
                          ml: currentStep === 1 ? 'auto' : 0 // Push to right if only Next button
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
                      startIcon={!submitbutton ? <CircularProgress size={10} color="inherit" /> : <CheckCircleIcon />}
                      sx={{
                          bgcolor: theme.palette.success.main,
                          color: theme.palette.getContrastText(theme.palette.success.main),
                          '&:hover': {
                              bgcolor: theme.palette.success.dark
                          },
                          '&.Mui-disabled': {
                              bgcolor: theme.palette.action.disabledBackground,
                              color: theme.palette.action.disabled
                          },
                          // px: 3,
                          // py: 1
                      }}
                    >
                        {submitbutton ? "Book" : "Booking..."}
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
                sx: { borderRadius: 2 }
            }}
          >
              <DialogTitle sx={{ bgcolor: primaryColor, color: theme.palette.getContrastText(primaryColor) }}>Terms and Conditions</DialogTitle>
              <DialogContent dividers>
                  <MKBox p={1}>
                      {termsInfo ? <div dangerouslySetInnerHTML={{__html: termsInfo}}/> : <CircularProgress sx={{color: primaryColor}}/>}
                  </MKBox>
              </DialogContent>
              <DialogActions>
                  <Button
                    onClick={handleCloseAgreementPopup}
                    sx={{ color: primaryColor }}
                  >
                      Close
                  </Button>
              </DialogActions>
          </Dialog>

          <Dialog
            open={openApp}
            onClose={handleCloseApp}
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
          >
              <DialogTitle sx={{
                  backgroundColor: buttonRedirect === 'Home' ? theme.palette.success.light : theme.palette.warning.light,
                  color: buttonRedirect === 'Home' ? theme.palette.success.contrastText : theme.palette.warning.contrastText,
              }}>
                  {buttonRedirect === 'Home' ? 'Appointment Booked' : 'Notification'}
              </DialogTitle>
              <DialogContent dividers>
                  <Typography>{appointmentBookContent}</Typography>
              </DialogContent>
              <DialogActions>
                  <Button
                    onClick={handleCloseApp}
                    variant="contained"
                    sx={{
                        bgcolor: buttonRedirect === 'Home' ? theme.palette.success.main : theme.palette.warning.main,
                        color: buttonRedirect === 'Home' ? theme.palette.getContrastText(theme.palette.success.main) : theme.palette.getContrastText(theme.palette.warning.main),
                        '&:hover': {
                            bgcolor: buttonRedirect === 'Home' ? theme.palette.success.dark : theme.palette.warning.dark,
                        }
                    }}
                  >
                      {buttonRedirect || "Close"}
                  </Button>
              </DialogActions>
          </Dialog>

          <Dialog
            open={app_list_dilog}
            onClose={handle_app_list}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
          >
              <DialogTitle sx={{ bgcolor: primaryColor, color: theme.palette.getContrastText(primaryColor) }}>
                  Your Upcoming Appointments
              </DialogTitle>
              <DialogContent dividers>
                  {appointmentlist && appointmentlist.length > 0 ? (
                    <Card variant="outlined" sx={{borderColor: 'success.main', borderRadius: 1}}>
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

          {!submitbutton && currentStep === TOTAL_STEPS && (
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1301, // Higher than dialogs
                backdropFilter: 'blur(3px)'
            }}>
                <NdLoader size="lg" variant="solid" value={70} color="primary"/>
            </Box>
          )}

          <NotificationDialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            content={modalContent}
            isError={isError}
          />
      </Layout>
    );
};

export default WalkinAppointmentPage;