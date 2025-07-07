// src/components/clinicInfo.js
import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardActions,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import { AccessTime, Event, Cancel, Home } from "@mui/icons-material";
import Layout from "nd_health/components/Layout";
import "nd_health/components/css/Marquee.css";
import MKButton from "../../components/MKButton";
import NotificationDialog from "./resources/Notification";
import API_BASE_PATH from "apiConfig";

const ManageAppointment = () => {
  const location = useLocation();
  const { clinicSlug } = useParams();
  const { appointmentData, clinicInfo } = location.state || {};
  const [homeButton, setHomeButton] = useState(true);
  const [disabledAppointments, setDisabledAppointments] = useState({});
  const [notice, setNotice] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");


  useEffect(() => {
    const fetchClinicAppointmentPolicy = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);
        const data = await response.json();

        if (data.notices) {
          const notices = data.notices.filter(Boolean).join(" | ");
          setNotice(notices);
        }
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    };

    fetchClinicAppointmentPolicy();
  }, [clinicSlug]);

  const handleRequest = async (appid) => {
    try {
      const response = await fetch(`${API_BASE_PATH}/cancel/${appid}/`);
      const data = await response.json();

      if (!data.status) {
        handleFailure("Something went wrong. Please try again later.");
      }

      if (data.status === "success") {
        handleSuccess(data.message);
        setDisabledAppointments((prev) => ({ ...prev, [appid]: true }));
      } else if (data.status === "failed") {
        handleFailure(data.message);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      handleFailure("Appointment cancellation failed. Please try again later.");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const formatTime = (timeString) => {
    const formattedTime = new Date(`2000-01-01T${timeString}`);
    return formattedTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const redirectHome = () => {
    window.location.href = `/clinic/${clinicSlug}/`;
  };

  const handleFailure = (message) => {
    setModalContent(message);
    setIsError(true);
    setOpenModal(true);
  };

  const handleSuccess = (message) => {
    setModalContent(message);
    setIsError(false);
    setOpenModal(true);
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        {clinicInfo ? (
          <>
            {notice && (
              <div className="marquee-container">
                <div className="marquee-content">Clinic Notice: {notice}</div>
              </div>
            )}
            <h2></h2>

            <Card>
              <CardHeader title={`Information of your appointment at ${clinicInfo.name}`} />
              {appointmentData.appointment.map((app) => (
                <Card key={app.id} sx={{ margin: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <Event />
                        </Avatar>
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6" component="div">
                          {app.appointmentType || "Appointment Details"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <AccessTime fontSize="small" /> {formatTime(app.startTime)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: {app.appointmentDate}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <MKButton
                          color="primary"
                          variant="contained"
                          disabled={disabledAppointments[app.id] || false}
                          onClick={() => handleRequest(app.id)}
                          startIcon={<Cancel />}
                        >
                          Cancel
                        </MKButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
              <CardActions style={{ display: "flex", justifyContent: "center" }}>
                <Grid item xs={12}>
                  <MKButton
                    color="info"
                    variant="contained"
                    disabled={!homeButton}
                    onClick={redirectHome}
                    fullWidth
                    startIcon={<Home />}
                  >
                    Go Home
                  </MKButton>
                </Grid>
              </CardActions>
            </Card>
          </>
        ) : (
          <p>Loading...</p>
        )}

        {/* Modal */}
        <NotificationDialog
          open={openModal}
          onClose={handleCloseModal}
          content={modalContent}
          isError={isError}
        />
      </div>
    </Layout>
  );
};

export default ManageAppointment;