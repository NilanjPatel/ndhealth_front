// src/components/TerminalPage.jsx
import API_BASE_PATH from "../../apiConfig";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardHeader,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  styled,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Info,
  Refresh,
  ArrowBack,
  Person,
  Schedule,
  Close,
  VerifiedUser,
  Edit,
  Done,
} from "@mui/icons-material";

import Layout from "./Layout";
import "nd_health/components/css/Marquee.css";
import {
  formatTime,
  formatDob,
  formatHin,
  isValidEmail,
  formatPostalCode,
  formatPhone,
} from "nd_health/components/resources/utils";

// Constants
const DIALOG_TYPES = {
  PATIENT_INFO: 'patient_info',
  SUCCESS: 'success',
  ERROR: 'error',
  CONFIRMATION: 'confirmation'
};

const CHECK_IN_STATES = {
  SELECTING_DOCTOR: 'selecting_doctor',
  SELECTING_APPOINTMENT: 'selecting_appointment',
  VERIFYING_IDENTITY: 'verifying_identity',
  UPDATING_INFO: 'updating_info',
  COMPLETED: 'completed'
};

// Step configuration for progress indicator
const STEPS = [
  {
    label: 'Select Doctor',
    icon: Person,
    state: CHECK_IN_STATES.SELECTING_DOCTOR,
    description: 'Choose your healthcare provider'
  },
  {
    label: 'Pick Appointment',
    icon: Schedule,
    state: CHECK_IN_STATES.SELECTING_APPOINTMENT,
    description: 'Select your appointment time'
  },
  {
    label: 'Verify Identity',
    icon: VerifiedUser,
    state: CHECK_IN_STATES.VERIFYING_IDENTITY,
    description: 'Confirm your date of birth'
  },
  {
    label: 'Update Info',
    icon: Edit,
    state: CHECK_IN_STATES.UPDATING_INFO,
    description: 'Review and update your details'
  },
  {
    label: 'Complete',
    icon: Done,
    state: CHECK_IN_STATES.COMPLETED,
    description: 'Check-in successful'
  }
];

// Custom styled components for vertical step display
const StepsSidebar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  height: 'fit-content',
  position: 'sticky',
  top: theme.spacing(2),
}));

const StepItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isCompleted',
})(({ theme, isActive, isCompleted }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  transition: 'all 0.2s ease',
  backgroundColor: isActive
    ? theme.palette.primary.main + '15'
    : isCompleted
      ? theme.palette.success.main + '10'
      : 'transparent',
  border: isActive
    ? `2px solid ${theme.palette.primary.main}`
    : '2px solid transparent',
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StepIconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isCompleted',
})(({ theme, isActive, isCompleted }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // width: 25,
  // height: 25,
  borderRadius: '50%',
  marginRight: theme.spacing(2),
  backgroundColor: isCompleted
    ? theme.palette.success.main
    : isActive
      ? theme.palette.primary.main
      : theme.palette.grey[300],
  color: isCompleted || isActive ? 'white' : theme.palette.grey[600],
  transition: 'all 0.3s ease',
  flexShrink: 0,
}));

const StepContent = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
}));

const StepNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isCompleted',
})(({ theme, isActive, isCompleted }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: isCompleted
    ? theme.palette.success.main
    : isActive
      ? theme.palette.primary.main
      : theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const TerminalPage = () => {
  const { clinicSlug } = useParams();
  const location = useLocation();

  // Derived state from URL
  const pathSegments = location.pathname.split("/");
  const clinicSlugCurrent = pathSegments[pathSegments.indexOf("terminal") + 1];
  const clinicLocation = pathSegments[pathSegments.indexOf("terminal") + 2];

  // Core state
  const [checkInState, setCheckInState] = useState(CHECK_IN_STATES.SELECTING_DOCTOR);
  const [clinicInfo, setClinicInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [pharmacyAdv, setPharmacyAdv] = useState(false);

  // Form state
  const [dob, setDob] = useState("");
  const [updatedInfo, setUpdatedInfo] = useState({
    address: "",
    city: "",
    postal: "",
    phone: "",
    alternative_phone: "",
    email: "",
    version_code: "",
    appointmentNumber: 0,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [dialogContent, setDialogContent] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // Fetch clinic data
  const fetchClinicData = useCallback(async () => {
    if (loading || (appointments.length > 0 && doctors.length > 0)) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_PATH}/terminal/${clinicSlugCurrent}/${clinicLocation}/`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setClinicInfo(data.clinic);
      setAppointments(data.appointments || []);
      setDoctors(data.doctors_info || []);

      if (data.pharmacy_adv) {
        setPharmacyAdv(data.pharmacy_adv);
      }
    } catch (error) {
      console.error("Error fetching clinic information:", error);
      showSnackbar("Failed to load clinic information. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [clinicSlugCurrent, clinicLocation, appointments.length, doctors.length]);

  useEffect(() => {
    fetchClinicData().then(r => {});
  }, [fetchClinicData]);

  // Utility functions
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const openDialog = (type, content = "") => {
    setDialogType(type);
    setDialogContent(content);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
    setDialogContent("");
  };

  const resetToStart = () => {
    setCheckInState(CHECK_IN_STATES.SELECTING_DOCTOR);
    setSelectedDoctor(null);
    setSelectedAppointment(null);
    setPatientInfo(null);
    setDob("");
    setIsUpdatingInfo(false);
    setFilteredAppointments([]);
    closeDialog();
  };

  // Get current step index
  const getCurrentStepIndex = () => {
    return STEPS.findIndex(step => step.state === checkInState);
  };

  // Get current step info
  const getCurrentStep = () => {
    return STEPS[getCurrentStepIndex()] || STEPS[0];
  };

  // Event handlers
  const handleDoctorSelect = (doctor) => {
    fetchClinicData().then(r => {}); // refresh
    setSelectedDoctor(doctor);

    const doctorAppointments = appointments.filter(
      (appointment) => appointment.doctorID__id === doctor.doctor__id
    );

    setFilteredAppointments(doctorAppointments);

    if (doctorAppointments.length > 0) {
      setCheckInState(CHECK_IN_STATES.SELECTING_APPOINTMENT);
      showSnackbar(`Selected Dr. ${doctor.doctor__user__first_name} ${doctor.doctor__user__last_name}`, "success");
    } else {
      openDialog(DIALOG_TYPES.ERROR, "No appointments available with this doctor today.");
    }
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setCheckInState(CHECK_IN_STATES.VERIFYING_IDENTITY);
  };

  const handleIdentityVerification = async () => {
    if (!selectedAppointment || !dob || dob.length <= 9) {
      showSnackbar("Please enter a valid date of birth", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_PATH}/terminal/${clinicSlugCurrent}/${selectedAppointment.appointmentId}/${dob}/`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setPatientInfo(data.data);
        setUpdatedInfo({
          address: data.data.address || "",
          city: data.data.city || "",
          postal: data.data.postal || "",
          phone: data.data.phone || "",
          alternative_phone: data.data.alternative_phone || "",
          email: data.data.email || "",
          version_code: data.data.version_code || "",
          appointmentNumber: data.data.appointmentNumber || 0,
        });
        openDialog(DIALOG_TYPES.PATIENT_INFO);
        setCheckInState(CHECK_IN_STATES.UPDATING_INFO);
      } else {
        openDialog(DIALOG_TYPES.ERROR, data.message || "Identity verification failed");
      }
    } catch (error) {
      console.error("Error verifying identity:", error);
      openDialog(DIALOG_TYPES.ERROR, "Unable to verify identity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (isUpdatingInfo && !isEmailValid) {
      showSnackbar("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        appointmentId: selectedAppointment.appointmentId,
        id: selectedAppointment.id,
        appointmentNumber: updatedInfo.appointmentNumber,
        phone: updatedInfo.phone,
        update: isUpdatingInfo,
      };

      if (isUpdatingInfo) {
        Object.assign(requestBody, {
          address: updatedInfo.address,
          city: updatedInfo.city,
          postal: updatedInfo.postal,
          alternative_phone: updatedInfo.alternative_phone,
          email: updatedInfo.email,
          cs: updatedInfo.version_code,
        });
      }

      const response = await fetch(`${API_BASE_PATH}/updateUserInfo/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setCheckInState(CHECK_IN_STATES.COMPLETED);
        openDialog(DIALOG_TYPES.SUCCESS, data.message || "Check-in completed successfully!");
        showSnackbar("Check-in completed successfully!", "success");
      } else {
        openDialog(DIALOG_TYPES.ERROR, data.message || "Check-in failed");
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      openDialog(DIALOG_TYPES.ERROR, "Check-in failed. Please try again or contact staff.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    switch (field) {
      case "phone":
      case "alternative_phone":
        formattedValue = formatPhone(value);
        break;
      case "email":
        formattedValue = value.toLowerCase();
        setIsEmailValid(isValidEmail(formattedValue));
        break;
      case "postal":
        formattedValue = formatPostalCode(value);
        break;
      case "version_code":
        formattedValue = value.toUpperCase();
        break;
      default:
        formattedValue = value;
    }

    setUpdatedInfo((prevInfo) => ({
      ...prevInfo,
      [field]: formattedValue,
    }));
  };

  const formatPatientName = (patientName) => {
    const [first, last] = patientName.split(",");
    if (first !== "" && last === "") {
      return `${first?.slice(0, 2) || ""}`;
    }
    if (first !== "" && last !== "") {
      return `${first?.slice(0, 2) || ""}, ${last?.slice(0, 2) || ""}`;
    }
    if (first === "" && last !== "") {
      return `${last?.slice(0, 2) || ""}`;
    }
    return "";
  };

  // Render functions
  // Render functions
  const renderVerticalSteps = () => {
    const currentStepIndex = getCurrentStepIndex();

    return (
      <StepsSidebar>
        <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 2 }}>
          Check-In Progress
        </Typography>

        {STEPS.map((step, index) => {
          const StepIconComponent = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <StepItem key={step.label} isActive={isActive} isCompleted={isCompleted}>
              <StepIconWrapper isActive={isActive} isCompleted={isCompleted}>
                {isCompleted ? (
                  <CheckCircle fontSize="small" />
                ) : (
                  <StepIconComponent fontSize="small" />
                )}
              </StepIconWrapper>

              <StepContent>
                <StepNumber isActive={isActive} isCompleted={isCompleted}>
                  {isCompleted ? 'COMPLETED' : isActive ? 'CURRENT' : `STEP ${index + 1}`}
                </StepNumber>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 600 : 500,
                    color: isCompleted
                      ? 'success.main'
                      : isActive
                        ? 'primary.main'
                        : 'text.primary',
                    lineHeight: 1.2,
                  }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    mt: 0.5,
                    lineHeight: 1.3,
                  }}
                >
                  {step.description}
                </Typography>
              </StepContent>
            </StepItem>
          );
        })}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Step {currentStepIndex + 1} of {STEPS.length}
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 4,
              backgroundColor: 'grey.200',
              borderRadius: 2,
              mt: 1,
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                width: `${((currentStepIndex + 1) / STEPS.length) * 100}%`,
                height: '100%',
                backgroundColor: 'primary.main',
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Box>
      </StepsSidebar>
    );
  };
  const renderNavigationButtons = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Button
          variant="outlined"
          onClick={resetToStart}
          startIcon={<ArrowBack />}
          fullWidth
          size="large"
          disabled={loading}
        >
          {checkInState === CHECK_IN_STATES.SELECTING_DOCTOR ? "Choose a Doctor" : "Back to Doctors"}
        </Button>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          variant="contained"
          onClick={fetchClinicData}
          startIcon={<Refresh />}
          fullWidth
          size="large"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Refresh"}
        </Button>
      </Grid>
    </Grid>
  );

  const renderDoctorSelection = () => (
    <Card elevation={2}>
      <CardHeader
        title="Select Your Doctor"
        titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
        avatar={<Person color="primary" />}
      />
      <CardContent>
        <Grid container spacing={2}>
          {doctors.map((doctor) => (
            <Grid item key={doctor.doctor__id} xs={12} md={6}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    elevation: 4,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleDoctorSelect(doctor)}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    Dr. {doctor.doctor__user__first_name} {doctor.doctor__user__last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click to view appointments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderAppointmentSelection = () => (
    <Card elevation={2}>
      <CardHeader
        title={`Appointments with Dr. ${selectedDoctor?.doctor__user__first_name} ${selectedDoctor?.doctor__user__last_name}`}
        titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
        avatar={<Schedule color="primary" />}
      />
      <CardContent>
        {filteredAppointments.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {filteredAppointments.map((appointment) => (
                <Grid item key={appointment.appointmentId} xs={12} md={6}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        elevation: 4,
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => handleAppointmentSelect(appointment)}
                  >
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {formatTime(appointment.appointmentTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Name: {formatPatientName(appointment.patientName)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Alert severity="info" sx={{ mt: 2 }}>
              If you don't remember your appointment time, look for the first 2 characters of your name.
              If you provided an email, appointment details were sent to your inbox.
            </Alert>
          </>
        ) : (
          <Alert severity="warning">No appointments available</Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderIdentityVerification = () => (
    <Card elevation={2} sx={{ backgroundColor: "#f8f9fa" }}>
      <CardHeader
        title="Verify Your Identity"
        titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
        avatar={<Info color="primary" />}
      />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`Appointment: ${formatTime(selectedAppointment.appointmentTime)}`}
            color="primary"
            variant="outlined"
            size="medium"
          />
        </Box>

        <TextField
          label="Date of Birth"
          placeholder="YYYY-MM-DD"
          value={formatDob(dob)}
          onChange={(e) => setDob(e.target.value)}
          fullWidth
          type="tel"
          inputMode="numeric"
          sx={{ mb: 2 }}
          helperText="Enter your date of birth in YYYY-MM-DD format"
        />

        <Button
          variant="contained"
          onClick={handleIdentityVerification}
          disabled={dob.length <= 9 || loading}
          size="large"
          fullWidth
        >
          {loading ? <CircularProgress size={20} /> : "Verify & Proceed"}
        </Button>
      </CardContent>
    </Card>
  );

  const renderPatientInfoDialog = () => (
    <Dialog open={dialogOpen} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Verify & Update Your Information
          <IconButton onClick={closeDialog}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Health Card Version Code"
              value={updatedInfo.version_code}
              onChange={(e) => handleInputChange("version_code", e.target.value)}
              fullWidth
              disabled={!isUpdatingInfo}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              value={updatedInfo.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              fullWidth
              disabled={!isUpdatingInfo}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="City"
              value={updatedInfo.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              fullWidth
              disabled={!isUpdatingInfo}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Postal Code"
              placeholder="XXX-XXX"
              value={updatedInfo.postal}
              onChange={(e) => handleInputChange("postal", e.target.value)}
              fullWidth
              disabled={!isUpdatingInfo}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              placeholder="123-456-7890"
              value={formatPhone(updatedInfo.phone)}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              fullWidth
              type="tel"
              disabled={!isUpdatingInfo}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Alternate Phone"
              placeholder="123-456-7890"
              value={formatPhone(updatedInfo.alternative_phone)}
              onChange={(e) => handleInputChange("alternative_phone", e.target.value)}
              fullWidth
              type="tel"
              disabled={!isUpdatingInfo}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email Address"
              value={updatedInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              fullWidth
              type="email"
              disabled={!isUpdatingInfo}
              error={!isEmailValid}
              helperText={!isEmailValid ? "Please enter a valid email address" : ""}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="secondary">
          Cancel
        </Button>
        {!isUpdatingInfo && (
          <Button
            onClick={() => setIsUpdatingInfo(true)}
            variant="outlined"
          >
            Update Information
          </Button>
        )}
        <Button
          onClick={handleCheckIn}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle />}
        >
          {isUpdatingInfo ? "Submit & Check-In" : "Skip & Check-In"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderSuccessDialog = () => (
    <Dialog open={dialogOpen} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircle color="success" />
          Check-In Successful!
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="success" sx={{ mb: 2 }}>
          {dialogContent}
        </Alert>
        <Typography variant="body1">
          Your check-in has been completed successfully. Please have a seat and wait for your name to be called.
        </Typography>
        {selectedAppointment && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Appointment Details:
            </Typography>
            <Typography variant="body2">
              Time: {formatTime(selectedAppointment.appointmentTime)}
            </Typography>
            <Typography variant="body2">
              Doctor: Dr. {selectedDoctor?.doctor__user__first_name} {selectedDoctor?.doctor__user__last_name}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={resetToStart} variant="contained" fullWidth>
          Start New Check-In
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderErrorDialog = () => (
    <Dialog open={dialogOpen} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Error color="error" />
          Error
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          {dialogContent}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          If this problem persists, please contact the clinic staff for assistance.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Try Again
        </Button>
        <Button onClick={resetToStart} variant="outlined">
          Start Over
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading && !clinicInfo) {
    return (
      <Layout clinicInfo={null}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout clinicInfo={clinicInfo}>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar - Steps */}
          <Grid item xs={12} md={4} lg={3}>
            {clinicInfo && renderVerticalSteps()}
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} md={8} lg={9}>
            {renderNavigationButtons()}

            {checkInState === CHECK_IN_STATES.SELECTING_DOCTOR && renderDoctorSelection()}
            {checkInState === CHECK_IN_STATES.SELECTING_APPOINTMENT && renderAppointmentSelection()}
            {checkInState === CHECK_IN_STATES.VERIFYING_IDENTITY && renderIdentityVerification()}
          </Grid>
        </Grid>

        {/* Dialogs */}
        {dialogType === DIALOG_TYPES.PATIENT_INFO && renderPatientInfoDialog()}
        {dialogType === DIALOG_TYPES.SUCCESS && renderSuccessDialog()}
        {dialogType === DIALOG_TYPES.ERROR && renderErrorDialog()}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={closeSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default TerminalPage;