import React from "react";
import {
  Grid,
  Card,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import NoteIcon from "@mui/icons-material/Note";
import WarningIcon from "@mui/icons-material/Warning";

const AppointmentConfirmationCard = ({
                                       selectedLocation,
                                       selectedProvider,
                                       responseData,
                                       selectedDate,
                                       selectedTime,
                                       appointmentMode,
                                       reason,
                                       agreementChecked,
                                       handleAgreementChange,
                                       handleAgreementClick,
                                       same_date_app,
                                       formatTime,
                                       primaryColor,
                                     }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Mobile Version - Compact Layout
  const MobileCard = () => (
    <Card variant="outlined" sx={{ p: 2, pb:0, borderColor: "divider", borderRadius: 2, width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <CheckCircleIcon sx={{ color: primaryColor, mr: 1, fontSize: 20 }} />
        <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500, fontSize: "1.1rem" }}>
          Confirm Details
        </Typography>
      </Box>

      <Box sx={{ mb: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
        {/* Location & Doctor - Single Row */}
        <Box sx={{ display: "flex", mb: 1.5 }}>
          <Box sx={{ flex: 1, mr: 1 }}>
            <Typography variant="caption" color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 12, mr: 0.3 }} /> Location
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>{selectedLocation}</Typography>
          </Box>
          <Box sx={{ flex: 1, ml: 1 }}>
            <Typography variant="caption" color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <PersonIcon sx={{ fontSize: 12, mr: 0.3 }} /> Doctor
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
              {selectedProvider && selectedProvider !== "Select Doctor" && responseData.location[selectedLocation]?.provider_number[selectedProvider]?.name}
            </Typography>
          </Box>
        </Box>

        {/* Date & Time - Single Row */}
        <Box sx={{ display: "flex", mb: 1.5 }}>
          <Box sx={{ flex: 1, mr: 1 }}>
            <Typography variant="caption" color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <EventIcon sx={{ fontSize: 12, mr: 0.3 }} /> Date
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>{selectedDate}</Typography>
          </Box>
          <Box sx={{ flex: 1, ml: 1 }}>
            <Typography variant="caption" color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 12, mr: 0.3 }} /> Time
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
              {selectedTime && formatTime(selectedTime.split(",")[0])}
            </Typography>
          </Box>
        </Box>

        {/* Appointment Type & Reason - Side by Side */}
        <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
          {/* Appointment Type */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              {appointmentMode === "Clinic" && <LocalHospitalIcon sx={{ fontSize: 12, mr: 0.3 }} />}
              {appointmentMode === "Phone" && <PhoneIcon sx={{ fontSize: 12, mr: 0.3 }} />}
              {appointmentMode === "Video" && <VideocamIcon sx={{ fontSize: 12, mr: 0.3 }} />}
              Type
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>{appointmentMode}</Typography>
          </Box>

          {/* Reason */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <NoteIcon sx={{ fontSize: 12, mr: 0.3 }} /> Reason
            </Typography>
            <Typography variant="body2" sx={{
              maxHeight: "60px",
              overflow: "auto",
              // bgcolor: "background.paper",
              // p: 1,
              // borderRadius: 1,
              // border: "1px solid",
              // borderColor: "divider",
              // fontSize: "0.85rem",
            }}>
              {reason}
            </Typography>
          </Box>
        </Box>

      </Box>

      {/* Agreement - Compact */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={agreementChecked}
              onChange={handleAgreementChange}
              name="agreement"
              color="primary"
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: primaryColor },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: primaryColor,
                },
              }}
            />
          }
          label={
            <span
              onClick={handleAgreementClick}
              style={{
                cursor: "pointer",
                color: primaryColor,
                textDecoration: "underline",
                fontSize: "0.8rem",
              }}
            >
        I agree to the terms and conditions.
      </span>
          }
        />
      </Box>

      {/* Warning for same date appointment */}
      {!same_date_app && selectedDate && (
        <Box sx={{ p: 1.5, bgcolor: "Error.50", borderRadius: 1, display: "flex", alignItems: "flex-start" }}>
          <WarningIcon sx={{ color: "Error.main", mr: 1, mt: 0.2, fontSize: 18 }} />
          <Typography color="error.main" sx={{ fontSize: "0.85rem" }}>
            You already have an appointment on this date, You can not book on same day again.
          </Typography>
        </Box>
      )}
    </Card>
  );

  // Desktop Version - Full Layout
  const DesktopCard = () => (
    <Card variant="outlined" sx={{ p: 2, borderColor: "divider", borderRadius: 2, width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <CheckCircleIcon sx={{ color: primaryColor, mr: 1 }} />
        <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 500 }}>
          Confirm Appointment Details
        </Typography>
      </Box>

      <Box sx={{ mb: 2, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
              <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} /> Location
            </Typography>
            <Typography variant="body1">{selectedLocation}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} /> Doctor
            </Typography>
            <Typography variant="body1">
              {selectedProvider && selectedProvider !== "Select Doctor" && responseData.location[selectedLocation]?.provider_number[selectedProvider]?.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
              <EventIcon sx={{ fontSize: 16, mr: 0.5 }} /> Date
            </Typography>
            <Typography variant="body1">{selectedDate}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} /> Time
            </Typography>
            <Typography variant="body1">
              {selectedTime && formatTime(selectedTime.split(",")[0])}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
              {appointmentMode === "Clinic" && <LocalHospitalIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              {appointmentMode === "Phone" && <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              {appointmentMode === "Video" && <VideocamIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              Appointment Type
            </Typography>
            <Typography variant="body1">{appointmentMode}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
              <NoteIcon sx={{ fontSize: 16, mr: 0.5 }} /> Reason
            </Typography>
            <Typography variant="body1" sx={{
              maxHeight: "80px",
              // overflow: "auto",
              // bgcolor: "background.paper",
              // p: 1,
              // borderRadius: 1,
              // border: "1px solid",
              // borderColor: "divider",
            }}>
              {reason}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={agreementChecked}
              onChange={handleAgreementChange}
              name="agreement"
              color="primary"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: primaryColor },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: primaryColor },
              }}
            />
          }
          label={
            <span
              onClick={handleAgreementClick}
              style={{
                cursor: "pointer",
                color: primaryColor,
                textDecoration: "underline",
                fontSize: "0.875rem",
              }}
            >
        I agree to the terms and conditions.
      </span>
          }
        />

      </Box>

      {!same_date_app && selectedDate && (
        <Box sx={{ p: 2, mt: 1, bgcolor: "Error.50", borderRadius: 1, display: "flex", alignItems: "flex-start" }}>
          <WarningIcon sx={{ color: "Error.main", mr: 1, mt: 0.3 }} />
          <Typography color="error.main">
            You already have an appointment on this date, You can not book on same day again.
          </Typography>
        </Box>
      )}
    </Card>
  );

  return (
    <Grid item xs={12} md={6}>
      {isMobile ? <MobileCard /> : <DesktopCard />}
    </Grid>
  );
};

export default AppointmentConfirmationCard;